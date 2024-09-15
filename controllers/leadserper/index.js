const { azureSearchGetDetails } = require('../../lib/azure_openai')
const { serpLeads } = require('../../lib/leads_serper')

function extractJsonObject(text) {
    try {
        // Try to parse the entire text as JSON first
        return JSON.parse(text);
    } catch (e) {
        // If that fails, try to find and extract the JSON object
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e) {
                console.error("Found a match, but it's not valid JSON:", e);
            }
        }
        
        // If no valid JSON object is found, throw an error
        throw new Error("No valid JSON object found in the text");
    }
}

// Add organization users
const searchLeads = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const { niche, location, organizationId, selectLinkedIn,
        selectTwitter,
        selectFacebook,
        selectInstagram } = req.body;

    var siteArr = [];

    if (selectLinkedIn) {
        siteArr.push("site:linkedin.com");
    }

    if (selectTwitter) {
        siteArr.push("site:x.com");
    }

    if (selectFacebook) {
        siteArr.push("site:facebook.com");
    }

    if (selectInstagram) {
        siteArr.push("site:instagram.com");
    }

    const searchResponse = await serpLeads(siteArr, niche, location, organizationId);

    const getUserDeatilsResponse = await azureSearchGetDetails(searchResponse);

    const jsonObject = extractJsonObject(getUserDeatilsResponse);

    console.log(jsonObject);
    res.status(200).json({ status: true, data: jsonObject });
}

module.exports = {
    searchLeads
}