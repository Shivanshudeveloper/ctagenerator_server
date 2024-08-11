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

async function azureBotResponseForMedical(question) {

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_KEY
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    const client = new AzureOpenAI({ apiKey, endpoint, deployment, apiVersion });

    const result = await client.chat.completions.create({
        messages: [
            {
                role: "system", content: `
                you are a medical expert. You don't need to introduce yourself just simply answer the question that the user has asked. the user will very likely ask you about the symptoms of a disease, the treatment of a disease, or the cause of a disease. You need to keep the tone friendly and based on the above information provided you need to answer the most probable cause of the symptoms or disease and give advise for the treatment in same response.

                dont show emotions or any personal information. just answer the question.
                keep the response short of atmost 20 words and to the point.
                you dont need to ask any question back to the user.
                converse in easy language that a normal person can understand.
                converse in a way that you are a medical expert if the symtomps or disease is not major or fatal.
                if the symptoms or disease is major or fatal, you can suggest the user to visit a doctor or hospital.
                if the symptoms or disease is not major or fatal, you can suggest the user to take some medicine or rest.
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

module.exports = {azureBotResponse,azureBotResponseForMedical};
