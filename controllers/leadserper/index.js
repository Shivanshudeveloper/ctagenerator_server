const { azureSearchGetDetails } = require('../../lib/azure_openai')
const { serpLeads } = require('../../lib/leads_serper')



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

    console.log(getUserDeatilsResponse);
    res.status(200).json({ status: true, data: getUserDeatilsResponse });

}

module.exports = {
    searchLeads
}