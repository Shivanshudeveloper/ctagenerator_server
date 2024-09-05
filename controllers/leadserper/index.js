const { azureSearchGetDetails } = require('../../lib/azure_openai')
const { serpLeads } = require('../../lib/leads_serper')



// Add organization users
const searchLeads = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const { niche, location, organizationId } = req.body;

    const searchResponse = await serpLeads(niche, location, organizationId);

    const getUserDeatilsResponse = await azureSearchGetDetails(searchResponse);

    console.log(getUserDeatilsResponse);
    res.status(200).json({ status: true, data: getUserDeatilsResponse });

}

module.exports = {
    searchLeads
}