const axios = require('axios');


async function serpLeads(niche, location, organizationId) {

    const searchQuery = `site:linkedin.com "${niche}" "gmail.com" ${location}`;

    console.log(searchQuery);

    const serperApiKey = process.env.SERPER_API_KEY;

    let data = JSON.stringify({
        "q": searchQuery,
        "num": 50
    });

    let config = {
        method: 'post',
        url: 'https://google.serper.dev/search',
        headers: { 
          'X-API-KEY': serperApiKey,
          'Content-Type': 'application/json'
        },
        data : data
    };

    try {
        const response = await axios(config);
        // console.log(JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error in serpLeads:', error);
        throw error; // Re-throw the error for the caller to handle
    }
      
}


module.exports = {
    serpLeads, 
};