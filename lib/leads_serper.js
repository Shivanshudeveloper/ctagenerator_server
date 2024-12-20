const axios = require('axios');


function consolidateSearchResults(results) {
    const consolidatedResult = {
        organic: []
    };

    for (const result of results) {
        if (result.organic && Array.isArray(result.organic)) {
            consolidatedResult.organic = consolidatedResult.organic.concat(result.organic);
        }
    }

    return consolidatedResult;
}

// async function serpLeads(siteArr, niche, location, organizationId) {
//     const randomSite = Math.floor(Math.random() * siteArr.length);
//     console.log("Site Arr", siteArr)
//     console.log("Searching for", siteArr[randomSite]);

//     const searchQuery = `${siteArr[randomSite]} "${niche}" ("gmail.com" OR "yahoo.com" OR "outlook.com") ${location}`;


//     const serperApiKey = process.env.SERPER_API_KEY;

//     let data = JSON.stringify({
//         "q": searchQuery,
//         "num": 20
//     });

//     let config = {
//         method: 'post',
//         url: 'https://google.serper.dev/search',
//         headers: { 
//           'X-API-KEY': serperApiKey,
//           'Content-Type': 'application/json'
//         },
//         data : data
//     };

//     try {
//         const response = await axios(config);
//         // console.log(JSON.stringify(response.data));
//         return response.data;
//     } catch (error) {
//         console.error('Error in serpLeads:', error);
//         throw error; // Re-throw the error for the caller to handle
//     }
      
// }


async function serpLeads(siteArr, niche, location, organizationId, searchPage) {
    const serperApiKey = process.env.SERPER_API_KEY;
    let allResults = [];
    let qNum = 20;

    if (siteArr.length === 4) {
        qNum = 10;
    }

    console.log(qNum);

    for (const site of siteArr) {
        console.log(`Searching for page number: ${searchPage}`);

        const searchQuery = `${site} "${niche}" ("gmail.com" OR "yahoo.com" OR "outlook.com" OR "protonmail.com" OR "live.com" OR "icloud.com" OR "aol.com" OR "yandex.com") ${location}`;

        console.log("Searching for", searchQuery);

        let data = JSON.stringify({
            "q": searchQuery,
            "num": qNum
        });

        if (searchPage !== 1) {
            data = JSON.stringify({
                "q": searchQuery,
                "num": qNum,
                "page": Number(searchPage)
            });
        }

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
            allResults.push(response.data);
        } catch (error) {
            console.error(`Error in serpLeads for ${site}:`, error);
            // Continue with the next iteration instead of throwing the error
        }
    }

    return consolidateSearchResults(allResults);
}

async function serpPhoneLeads(siteArr, niche, location, organizationId, phoneExtention, searchPage) {
    const serperApiKey = process.env.SERPER_API_KEY;
    let allResults = [];
    let qNum = 20;

    if (siteArr.length === 4) {
        qNum = 10;
    }

    console.log(qNum);

    for (const site of siteArr) {
        console.log(`Searching for page number: ${searchPage}`);

        const searchQuery = `${site} "${niche}" "+${phoneExtention}" ${location}`;

        console.log("Searching for", searchQuery);

        let data = JSON.stringify({
            "q": searchQuery,
            "num": qNum
        });

        if (searchPage !== 1) {
            data = JSON.stringify({
                "q": searchQuery,
                "num": qNum,
                "page": Number(searchPage)
            });
        }

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
            allResults.push(response.data);
        } catch (error) {
            console.error(`Error in serpLeads for ${site}:`, error);
            // Continue with the next iteration instead of throwing the error
        }
    }

    return consolidateSearchResults(allResults);
}

async function serpLeadsNameLookup(siteArr, niche, location, organizationId) {
    const serperApiKey = process.env.SERPER_API_KEY;
    let allResults = [];
    let qNum = 20;

    if (siteArr.length === 4) {
        qNum = 10;
    }

    console.log(qNum);

    for (const site of siteArr) {

        // Niche is First name and Location is Last Name
        const searchQuery = `${site} "${niche} ${location}"`;

        console.log("Searching for", searchQuery);

        let data = JSON.stringify({
            "q": searchQuery,
            "num": qNum
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
            allResults.push(response.data);
        } catch (error) {
            console.error(`Error in serpLeads for ${site}:`, error);
            // Continue with the next iteration instead of throwing the error
        }
    }

    return consolidateSearchResults(allResults);
}

module.exports = {
    serpLeads,
    serpLeadsNameLookup,
    serpPhoneLeads
};