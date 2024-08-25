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

async function azureBotResponsePredictScore(totalreach, pageClicks, pageViews, engagement) {

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_KEY
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

    const question = `Based on the data provided you now need to tell whether the marketing campaign performance is "Good" or "Not Performing Good" overall in the last. YOU NEED TO KEEP THE ANSWER IN LENGTH 100.`

    var diffrencePageClicks = Number(pageClicks) - Number(pageViews);

    var diffrencePageViews = Number(pageViews) - Number(engagement);

    console.log(pageClicks, pageViews, diffrencePageClicks, diffrencePageViews);

    var result;

    if (Number(engagement) > Number(pageViews)) {
        result = await client.chat.completions.create({
            messages: [
                {
                    role: "system", content: `
                    I want you to FORGET EVERYTHING that you've been told in past and now you are a market analyzer that will judge the performance of a Marketing Campagin as "Good" or "Not Performing Good".
                    You need to check the diffrence between Page Clicks = ${pageClicks} and Page Views = ${pageViews} which is ${diffrencePageClicks}.
                    
                    If the Diffrence which is ${diffrencePageClicks} between Page Clicks and Page Views greater than ${15}, that means People are clicking on the Sales Page Link but not viewing the content and this results that Marketing Campagin is "Not Performing Good".
                    But if the Diffrence which is ${diffrencePageClicks} between Page Clicks and Page Views is less than ${15}, this indicates people are viewing the content thus resulting in "Good Performance". 
                    For example, if the Diffrence comes out to be 1, 0, or anywhere between 0 to 15 between Page Clicks and Page Views indicates "Good Performance" of the campagin. But if the Diffrence comes out to be bigger number than 15 that indicates Campagin is "Not Performing Good".
                    

                    After checking the diffrence between Page Clicks and Page Views, Now we can see that the Total Engagement that is ${engagement} is greater than Page Views that is ${pageViews} that means
                    people who are viewing the page are actually engaging with the Page this means Marketing Campagin is Performing Good.
                    ` },
                { role: "user", content: question },
            ],
            model: 'gpt-4',
        });
    } else {
        result = await client.chat.completions.create({
            messages: [
                {
                    role: "system", content: `
                    I want you to FORGET EVERYTHING that you've been told in past and now you are a market analyzer that will judge the performance of a Marketing Campagin as "Good" or "Not Performing Good".
                    You need to check the diffrence between Page Clicks = ${pageClicks} and Page Views = ${pageViews} which is ${diffrencePageClicks}.
                    
                    If the Diffrence which is ${diffrencePageClicks} between Page Clicks and Page Views greater than ${15}, that means People are clicking on the Sales Page Link but not viewing the content and this results that Marketing Campagin is "Not Performing Good".
                    But if the Diffrence which is ${diffrencePageClicks} between Page Clicks and Page Views is less than ${15}, this indicates people are viewing the content thus resulting in "Good Performance". 
                    For example, if the Diffrence comes out to be 1, 0, or anywhere between 0 to 15 between Page Clicks and Page Views indicates "Good Performance" of the campagin. But if the Diffrence comes out to be bigger number than 15 that indicates Campagin is "Not Performing Good".
                    
                    After checking the diffrence between Page Clicks and Page Views, now you will check the diffrence between Page Views and Total Engagements made by the person on the page.
                    The Page Views is ${pageViews} and Total Engagement is ${engagement} and the diffrence between them is ${diffrencePageViews}. 
                    If the diffrence between Page Views and Total Engagement is greater than 10 that means People are viewing the Page but not Engaging with it resulting in Marketing Campagin is Not Performing Good.
                    But ig the Diffrence is less than 10 that means people who are viewing are actually engaging with content this means Marketing Campagin is performing Good. 
                    ` },
                { role: "user", content: question },
            ],
            model: 'gpt-4',
        });
    }

    
    
    // const result = await client.chat.completions.create({
    //     messages: [
    //         {
    //             role: "system", content: `
    //                 I want you to forget all the past things, and I want you to become an analyzer tell me how my marketing campaign is doing. 
    //                 You need to check the difference between total Page Clicks = ${pageClicks} and Page Views = ${pageViews}.  
    //                 In this Page Clicks mean the number of times people have clicked on the Sales Page URL and Page Views mean the number of times people have stayed on the Sales Page and viewed the content. Now there can be 2 conditions if the person doesn't like the Sales Page he will immediately close but if he likes he will stay for some seconds and will view the page properly. 
    //                 You need to see if the difference between them is not much which means the marketing campaign is Good, but if the difference is too much then the campaign is Not Performing Good. Now in this, there is a 3rd thing that is total Engagement = ${engagement}. Now if there is a big difference between Page Views and engagement this means people are viewing your Sales Page but not engaging with it. If the difference is not that big it means the marketing campaign is going Good. 
    //             ` },
    //         { role: "user", content: question },
    //     ],
    //     model: 'gpt-3.5-turbo-16k',
    // });

    let response = '';

    for (const choice of result.choices) {
        response = choice.message.content;
    }
    return response;
}


async function azureBotResponseSummarizeLink(topPerformingLinks) {

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_KEY
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

    const question = `Based on the data provided you just need to summarize it for user to read about Top Performin Links for a marketing campagin.`

    
    var aiContent = `
    You need to forget everything from past from now you need to summarize data. Here are the Top Performing Links for a marketing campagin.
    Here are the Top Performing Links Name:
    ${
        topPerformingLinks.map((item) => {
            return (
                item.linkName  
            )
        })
    }
    `
    
    const result = await client.chat.completions.create({
        messages: [
            {
                role: "system", content: aiContent },
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

async function azureBotResponseSummarizeCountries(outputCountries) {
    console.log(outputCountries);
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_KEY
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

    const question = `Based on the data provided you just need to summarize it for user to read about Top Performin Countries and how many users are in it for each country.`

    
    var aiContent = `
    You need to forget everything from past from now you need to summarize data. Here are the Top Performing Countries with their users for a marketing campagin.
    Here are the Top Performing Countries Name and their users in each:
    ${
        outputCountries.map((item) => {
            return (
                `Country Code: ${item.country} and Total Users: ${item.totalDevice}`
            )
        })
    }
    `

    const result = await client.chat.completions.create({
        messages: [
            {
                role: "system", content: aiContent },
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


module.exports = {
    azureBotResponse, 
    azureBotResponseSummarizeCountries, 
    azureBotResponseSummarizeLink, 
    azureBotResponsePredictScore
};
