const axios = require('axios');


async function serpLeads(siteArr, niche, location, organizationId) {
    const randomSite = Math.floor(Math.random() * siteArr.length);
    console.log("Site Arr", siteArr)
    console.log("Searching for", siteArr[randomSite]);

    const searchQuery = `${siteArr[randomSite]} "${niche}" ("gmail.com" OR "yahoo.com" OR "outlook.com") ${location}`;


    const serperApiKey = process.env.SERPER_API_KEY;

    let data = JSON.stringify({
        "q": searchQuery,
        "num": 20
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