require('dotenv').config();
const { AzureOpenAI } = require("openai")
const { DefaultAzureCredential, getBearerTokenProvider } = require("@azure/identity")
const { AzureKeyCredential } = require("@azure/openai")

async function azureBotResponse(information, question) {

    const { companyName, companyDescription, url, productName, productDescription, aiAgentName } = information;

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_KEY
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

    const result = await client.chat.completions.create({
        messages: [
            {
                role: "system", content: `
                You are a Sales Agent for the company ${companyName} named ${aiAgentName}. You don't need to introduce yourself just simply answer the question that the user has asked. If the user asks to connect with the team member or something like contacting a real person just politely say. "Sure, please you can book a meeting with our team by our meeting link." That is all do not change or add anything to it.
                The website of the company is this, ${url}.
                The description of ${companyName} is this, ${companyDescription}.
                The product of Sortwind is ${productName} and the description of the product is this, ${productDescription}.
                You need to keep the tone friendly and based on the above information provided you need to answer the question.
                ALSO MAKE SURE NOT TO ANSWER ANYTHING THAT YOU DON'T KNOW. FOR SUCH QUESTION YOU CAN POLITELY SAY I CAN CONNECT WITH OUR TEAM MEMBER THAT CAN HELP YOU.
                ` },
            { role: "user", content: question },
        ],
        model: 'gpt-3.5-turbo-16k',
    });

    let response = '';

    for (const choice of result.choices) {
        response = choice.message.content;
    }
    return response;
}

async function azureDetectEmailScraperInstruction(searchResponse, requestedFields = null) {
    try {
        // Validate input
        if (!searchResponse) {
            throw new Error('Invalid searchResponse: missing searchResponse data');
        }

        // Validate environment variables
        const requiredEnvVars = [
            'AZURE_LEADS_OPENAI_ENDPOINT',
            'AZURE_LEADS_OPENAI_KEY',
            'AZURE_LEADS_OPENAI_DEPLOYMENT',
            'AZURE_LEADS_OPENAI_API_VERSION'
        ];

        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        }

        const endpoint = process.env.AZURE_LEADS_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_LEADS_OPENAI_KEY;
        const deployment = process.env.AZURE_LEADS_OPENAI_DEPLOYMENT;
        const apiVersion = process.env.AZURE_LEADS_OPENAI_API_VERSION;

        const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

        // Default sources if not specified
        const defaultSources = ["LinkedIn", "Twitter", "Facebook", "Instagram"];

        // Build the prompt based on requested fields
        let questionBase = `Analyze the provided data`;
        let fieldsToExtract = [];

        if (!requestedFields || requestedFields.includes('Niche')) {
            fieldsToExtract.push('Niche');
        }
        if (!requestedFields || requestedFields.includes('Location')) {
            fieldsToExtract.push('Location');
        }
        if (!requestedFields || requestedFields.includes('Sources')) {
            fieldsToExtract.push('Sources');
        }

        const question = `${questionBase} and extract the following information: ${fieldsToExtract.join(', ')}.
Return ONLY a JSON object with this exact structure:
{
    "data": [
        {
            ${fieldsToExtract.map(field => `"${field}": "${field === 'Sources' ? '[]' : 'example'}"`).join(',\n            ')}
        }
    ]
}
For Sources, only include LinkedIn, Twitter, Facebook, or Instagram.
If you can't find Niche or Location, use "NOT_ABLE_TO_FIND".
Do not include any additional text or explanations.`;

        // Ensure searchResponse data is properly stringified
        const aiContent = JSON.stringify(searchResponse, null, 2);

        const result = await client.chat.completions.create({
            messages: [
                { role: "system", content: aiContent },
                { role: "user", content: question }
            ],
            model: 'gpt-35-turbo-16k',
            temperature: 0.3,
            max_tokens: 2000
        });

        // Extract response
        const response = result.choices[0]?.message?.content;
        
        if (!response) {
            throw new Error('No response received from Azure OpenAI');
        }

        // Parse and validate response
        try {
            const parsedResponse = JSON.parse(response);
            
            if (!parsedResponse.data || !Array.isArray(parsedResponse.data)) {
                throw new Error('Invalid response structure: missing data array');
            }

            // Process each item in the data array
            parsedResponse.data = parsedResponse.data.map(item => {
                // Set default values for missing fields
                const processedItem = {
                    Niche: item.Niche || "NOT_ABLE_TO_FIND",
                    Location: item.Location || "NOT_ABLE_TO_FIND",
                    Sources: Array.isArray(item.Sources) ? item.Sources : defaultSources
                };

                // If Sources is empty, use default sources
                if (processedItem.Sources.length === 0) {
                    processedItem.Sources = defaultSources;
                }

                // Validate Sources values
                processedItem.Sources = processedItem.Sources.filter(source => 
                    defaultSources.includes(source)
                );

                // If all sources were filtered out, use defaults
                if (processedItem.Sources.length === 0) {
                    processedItem.Sources = defaultSources;
                }

                return processedItem;
            });

            return parsedResponse;
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            // Attempt to fix common JSON issues
            const cleanedResponse = response
                .replace(/[\n\r\t]/g, '')
                .replace(/,\s*}/g, '}')
                .trim();
            
            try {
                const fixedResponse = JSON.parse(cleanedResponse);
                // Apply the same processing to the fixed response
                if (fixedResponse.data) {
                    fixedResponse.data = fixedResponse.data.map(item => ({
                        Niche: item.Niche || "NOT_ABLE_TO_FIND",
                        Location: item.Location || "NOT_ABLE_TO_FIND",
                        Sources: Array.isArray(item.Sources) && item.Sources.length > 0 
                            ? item.Sources.filter(source => defaultSources.includes(source))
                            : defaultSources
                    }));
                }
                return fixedResponse;
            } catch {
                throw new Error('Failed to parse response as JSON');
            }
        }
    } catch (error) {
        console.error('Error in azureDetectScraperInstruction:', error);
        
        return {
            error: true,
            message: error.message,
            details: error.response?.data || null
        };
    }
}

async function azureDetectPhoneScraperInstruction(searchResponse, requestedFields = null) {
    try {
        // ===== 1) Validate input  =====
        if (!searchResponse) {
            throw new Error('Invalid searchResponse: missing searchResponse data');
        }

        // ===== 2) Country Code Mapping  =====
        const countryCodeMap = {
            // Major countries
            'USA': '+1',
            'UK': '+44',
            'India': '+91',
            'Australia': '+61',
            'Canada': '+1',
            
            // Cities with their country codes
            'New Delhi': '+91',
            'Mumbai': '+91',
            'New York': '+1',
            'Los Angeles': '+1',
            'London': '+44',
            'Sydney': '+61',
            'Toronto': '+1',
            
            // Common country variations
            'United States': '+1',
            'United States of America': '+1',
            'US': '+1',
            'United Kingdom': '+44',
            'Britain': '+44',
            'Great Britain': '+44',
            'England': '+44'
        };

        // ===== 3) Helper: Extract explicit phone extension from the query  =====
        function extractExplicitPhoneExtension(query) {
            if (!query) return null;
            
            const patterns = [
              // e.g., "Please use the phone extension as +44"
              /please\s*use\s*(?:the\s+)?phone\s+extension\s+as\s*\+(\d+)/i,
          
              // e.g., "phone extension as +44"
              /phone\s+extension\s+as\s*\+(\d+)/i,
          
              // e.g., "with +44" or "numbers with +44"
              /\b(?:with|numbers?\s+with)\s*\+(\d+)/i,
              
              // Fallback for any explicit +NN pattern in the text
              /\+(\d+)/
            ];
          
            for (const pattern of patterns) {
              const match = query.match(pattern);
              if (match) {
                return `+${match[1]}`;
              }
            }
          
            return null;
        }
          

        // ===== 4) Helper: Determine phone extension from location  =====
        function getPhoneExtension(location, query) {
            // First check for explicit extension in query
            const explicitExtension = extractExplicitPhoneExtension(query);
            
            if (explicitExtension) return explicitExtension;
            
            if (!location || location === "NOT_ABLE_TO_FIND") return "NOT_ABLE_TO_FIND";
            
            // Check direct mapping
            const directMatch = countryCodeMap[location.trim()];
            if (directMatch) return directMatch;
            
            // Check for country names in the location string
            for (const [country, code] of Object.entries(countryCodeMap)) {
                if (location.toLowerCase().includes(country.toLowerCase())) {
                    return code;
                }
            }
            
            return "NOT_ABLE_TO_FIND";
        }

        // ===== 5) Validate environment variables  =====
        const requiredEnvVars = [
            'AZURE_LEADS_OPENAI_ENDPOINT',
            'AZURE_LEADS_OPENAI_KEY',
            'AZURE_LEADS_OPENAI_DEPLOYMENT',
            'AZURE_LEADS_OPENAI_API_VERSION'
        ];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        }

        const endpoint = process.env.AZURE_LEADS_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_LEADS_OPENAI_KEY;
        const deployment = process.env.AZURE_LEADS_OPENAI_DEPLOYMENT;
        const apiVersion = process.env.AZURE_LEADS_OPENAI_API_VERSION;

        const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

        // Default sources if not specified
        const defaultSources = ["LinkedIn", "Twitter", "Facebook", "Instagram"];

        // ===== 6) Build the prompt  =====
        // Extract the user query
        const query = typeof searchResponse === 'string' 
            ? searchResponse 
            : searchResponse.query || JSON.stringify(searchResponse);

        // Determine which fields to extract
        let fieldsToExtract = [];
        if (!requestedFields || requestedFields.includes('Niche')) {
            fieldsToExtract.push('Niche');
        }
        if (!requestedFields || requestedFields.includes('Location')) {
            fieldsToExtract.push('Location');
        }
        if (!requestedFields || requestedFields.includes('Sources')) {
            fieldsToExtract.push('Sources');
        }
        if (!requestedFields || requestedFields.includes('PhoneExtension')) {
            fieldsToExtract.push('PhoneExtension');
        }

        // Construct final instructions to the model
        const fieldsJsonStructure = fieldsToExtract.map(field => {
            if (field === 'Sources') return `"${field}": []`;
            if (field === 'PhoneExtension') return `"${field}": "+XX"`;
            return `"${field}": "example"`;
        }).join(',\n            ');

        const question = `
You are a helpful assistant that returns ONLY valid JSON and nothing else.
Analyze the provided data and extract the following information: ${fieldsToExtract.join(', ')}.
Return ONLY a JSON object with this exact structure:

{
    "data": [
        {
            ${fieldsJsonStructure}
        }
    ]
}

For "Niche" and "Location", if you cannot find a value, use "NOT_ABLE_TO_FIND".
For "Sources", only include any of these platforms if they appear: "LinkedIn", "Twitter", "Facebook", "Instagram".
If no sources found in the user's request, leave "Sources" as an empty array.
For "PhoneExtension", first check if there's an explicit mention in the user query (e.g., +1 or +91).
If none found, infer it from the location if possible; otherwise use "NOT_ABLE_TO_FIND".
Do not include any text or explanations before or after the JSON.
`;

        // ===== 7) Call Azure OpenAI  =====
        // We pass the user's query in the system context so the model can see it,
        // but we also remind the model it must return only JSON.
        const aiContent = JSON.stringify(searchResponse, null, 2);

        const result = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `System data (for context only, do not output):\n${aiContent}`
                },
                {
                    role: "user",
                    content: question
                }
            ],
            model: 'gpt-35-turbo-16k',
            temperature: 0.3,
            max_tokens: 2000
        });

        const rawResponse = result.choices[0]?.message?.content;
        if (!rawResponse) {
            throw new Error('No response received from Azure OpenAI');
        }

        // ===== 8) Parse the JSON response  =====
        let parsedResponse;

        try {
            // Attempt direct parse
            parsedResponse = JSON.parse(rawResponse.trim());
        } catch (err) {
            console.warn('JSON parse error in direct attempt. Trying to locate JSON in raw response...');
            
            // Attempt to find the JSON portion via regex
            const jsonMatch = rawResponse.match(/\{[\s\S]*\}(\s*\})?/m);
            if (jsonMatch) {
                const potentialJson = jsonMatch[0];
                try {
                    parsedResponse = JSON.parse(potentialJson.trim());
                } catch (innerErr) {
                    console.warn('Second parsing attempt also failed, attempting cleanup...');
                    // Final fallback: naive cleanup
                    const cleaned = potentialJson
                        .replace(/```[\s\S]*?```/g, '') // remove code fences
                        .replace(/[\n\r\t]/g, ' ')
                        .replace(/,\s*}/g, '}')
                        .trim();

                    parsedResponse = JSON.parse(cleaned);
                }
            } else {
                console.warn('No JSON block found, attempting naive cleanup on entire raw response...');
                const cleaned = rawResponse
                    .replace(/```[\s\S]*?```/g, '')
                    .replace(/[\n\r\t]/g, ' ')
                    .replace(/,\s*}/g, '}')
                    .trim();

                parsedResponse = JSON.parse(cleaned);
            }
        }

        if (!parsedResponse || !parsedResponse.data || !Array.isArray(parsedResponse.data)) {
            throw new Error('Invalid response structure: Missing "data" array after parsing.');
        }

        // ===== 9) Final Processing of Parsed Response  =====
        parsedResponse.data = parsedResponse.data.map(item => {
            const finalNiche = item.Niche || "NOT_ABLE_TO_FIND";
            const finalLocation = item.Location || "NOT_ABLE_TO_FIND";

            // If the model didn't provide Sources or it's not an array, 
            // or if the user didn't mention any source, default to an empty array initially
            let finalSources = Array.isArray(item.Sources) 
                ? item.Sources.filter(s => defaultSources.includes(s))  // filter only allowed
                : [];

            // If finalSources is still empty after filtering, 
            // we interpret it as "user did not specify any sources" => use all defaults
            if (!finalSources.length) {
                finalSources = defaultSources;
            }

            var phoneExtension, tempPhoneExtension;

            tempPhoneExtension = getPhoneExtension(finalLocation, query);
            console.log(tempPhoneExtension);
            
            if (tempPhoneExtension === "NOT_ABLE_TO_FIND") {
                tempPhoneExtension = item.PhoneExtension;
            }
            
            return {
                Niche: finalNiche,
                Location: finalLocation,
                Sources: finalSources,
                PhoneExtension: tempPhoneExtension
            };
        });

        return parsedResponse;

    } catch (error) {
        console.error('Error in azureDetectPhoneScraperInstruction:', error);

        return {
            error: true,
            message: error.message,
            details: error.response?.data || null
        };
    }
}




async function azureDetectLeadFinderFiltersInstruction(searchResponse, requestedFields = null) {
    try {
        // Validate input
        if (!searchResponse) {
            throw new Error('Invalid searchResponse: missing searchResponse data');
        }

        // Valid countries list
        const validCountries = [
            "United States", "United Kingdom", "Canada", "Cyprus",
            "Finland", "Serbia", "Spain", "Switzerland", "Greece",
            "Russia", "Czechia", "Portugal", "Norway", "Finland",
            "Denmark", "Latvia", "Estonia", "Ukraine", "Bulgaria", "Italy"
        ];

        // Country aliases mapping
        const countryAliases = {
            'USA': 'United States',
            'US': 'United States',
            'UK': 'United Kingdom',
            'Britain': 'United Kingdom',
            'Great Britain': 'United Kingdom',
            'England': 'United Kingdom'
        };

        // Function to normalize and validate country
        function validateCountry(location) {
            if (!location) return "NOT_ABLE_TO_FIND";

            // Check direct match
            if (validCountries.includes(location)) {
                return location;
            }

            // Check aliases
            const aliasMatch = countryAliases[location];
            if (aliasMatch) {
                return aliasMatch;
            }

            // Check if country name is part of the location
            for (const country of validCountries) {
                if (location.toLowerCase().includes(country.toLowerCase())) {
                    return country;
                }
            }

            for (const [alias, country] of Object.entries(countryAliases)) {
                if (location.toLowerCase().includes(alias.toLowerCase())) {
                    return country;
                }
            }

            return "NOT_ABLE_TO_FIND";
        }

        // Function to extract keywords/technologies
        function extractKeywords(text) {
            if (!text) return ["NOT_ABLE_TO_FIND"];
            
            const keywords = text.split(/[,;&|]+|\sand\s|\sor\s/)
                .map(k => k.trim())
                .filter(k => k.length > 0 && k.toLowerCase() !== 'the' && k.toLowerCase() !== 'and');

            return keywords.length > 0 ? keywords : ["NOT_ABLE_TO_FIND"];
        }

        const endpoint = process.env.AZURE_LEADS_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_LEADS_OPENAI_KEY;
        const deployment = process.env.AZURE_LEADS_OPENAI_DEPLOYMENT;
        const apiVersion = process.env.AZURE_LEADS_OPENAI_API_VERSION;

        const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

        // Extract instruction from searchResponse
        const instruction = typeof searchResponse === 'string' ? searchResponse : 
                          searchResponse.instruction || JSON.stringify(searchResponse);

        const question = `Please analyze the following request and extract only the explicitly mentioned information:
"${instruction}"

Format the response as a JSON object with these fields:
- firstName (use "NOT_ABLE_TO_FIND" if not specified)
- lastName (use "NOT_ABLE_TO_FIND" if not specified)
- industry (use "NOT_ABLE_TO_FIND" if not specified)
- keywords (array of mentioned technologies)
- country (mentioned location)

Response format:
{
    "data": [
        {
            "firstName": "string",
            "lastName": "string",
            "industry": "string",
            "keywords": ["string"],
            "country": "string"
        }
    ]
}`;

        const result = await client.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are an assistant that helps extract structured information from text requests."
                },
                { role: "user", content: question }
            ],
            model: 'gpt-35-turbo-16k',
            temperature: 0,
            max_tokens: 2000
        });

        const response = result.choices[0]?.message?.content;
        
        if (!response) {
            throw new Error('No response received from Azure OpenAI');
        }

        try {
            const parsedResponse = JSON.parse(response);
            
            if (!parsedResponse.data || !Array.isArray(parsedResponse.data)) {
                throw new Error('Invalid response structure: missing data array');
            }

            // Process the response
            parsedResponse.data = parsedResponse.data.map(item => {
                return {
                    firstName: "NOT_ABLE_TO_FIND",
                    lastName: "NOT_ABLE_TO_FIND",
                    industry: "NOT_ABLE_TO_FIND",
                    keywords: extractKeywords(instruction.match(/(?:uses?|using|with|in|about|for)\s+([^,\.]+)/i)?.[1] || ""),
                    country: validateCountry(item.country || "")
                };
            });

            return {
                status: true,
                data: parsedResponse
            };

        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            throw new Error('Failed to parse response as JSON');
        }
    } catch (error) {
        console.error('Error in azureDetectLeadFinderFiltersInstruction:', error);
        
        return {
            status: false,
            error: true,
            message: error.message,
            details: error.response?.data || null
        };
    }
}


module.exports = {
    azureBotResponse, 
    azureDetectEmailScraperInstruction,
    azureDetectPhoneScraperInstruction,
    azureDetectLeadFinderFiltersInstruction
};
