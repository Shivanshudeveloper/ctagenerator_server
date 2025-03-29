const { UnipileClient } = require('unipile-node-sdk');


const Domains_Model = require("../../models/Domains");
const { BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE, CALLBACK_UNIPILE } = require('../../config/config');


const addCustomDomain = async (req, res) => {
    let { userEmail, organizationId, domainName } = req.body;

    domainName = domainName.toLowerCase().trim();

    try {
        // Validate domain name format
        const domainRegex = /^([a-zA-Z0-9]-?)+(\.[a-zA-Z0-9-]+)+$/;
        if (!domainRegex.test(domainName)) {
            return res.status(400).json({ error: 'Invalid domain name format' });
        }

        const existingDomain = await Domains_Model.findOne({
            organizationId,
            domainName // No need for case-insensitive regex since we normalized it
        });

        if (existingDomain) {
            return res.status(400).json({
                error: 'Domain already exists for this organization',
                data: 'Please use a different domain name'
            });
        }

        // Create new domain record
        const newDomain = new Domains_Model({
            organizationId,
            domainName, // Will be stored in lowercase
            userEmail
        });

        await newDomain.save();

        return res.status(200).json({
            data: 'Domain added successfully',
        });

    } catch (error) {
        console.error('Error adding custom domain:', error);
        res.status(500).json({ 
            error: 'Failed to add custom domain',
            details: error.message 
        });
    }
}

// LinkedIn Account Connect
const connectLinkedInAccount = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { organizationId, listName } = req.params;
    
    // Calculate expiration time - 1 hour from now
    const date = new Date(Date.now() + 60 * 60 * 1000);
    // Format to ISO string with milliseconds properly formatted
    const expiresOn = date.toISOString();
    
    // Required inputs for hosted auth link
    const type = "create";
    const providers = ["LINKEDIN"];
    const api_url = `${BASE_URL_UNIPILE}`;
  
    try {
      const client = new UnipileClient(BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE);
      const response = await client.account.createHostedAuthLink({
        type,
        providers,
        api_url,
        expiresOn,
        // You might need to add a name parameter as it's required according to the schema
        name: `linkedin-${organizationId}-${Date.now()}`, // Add a unique identifier
        notify_url: `${CALLBACK_UNIPILE}/api/v1/main/linkedin/linkedincallback/${organizationId}/${listName}`,
        success_redirect_url: 'http://localhost:3000/'
      });
  
      // Return the auth URL to the client
      res.status(200).json({ authUrl: response.url });
    } catch (error) {
      console.error("Unipile Auth Error:", error.message || error);
      res.status(500).json({ 
        error: "Failed to generate LinkedIn auth link", 
        details: error.message || error
      });
    }
};

// LinkedIn CallBack
const callBackLinkedIn = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
      
    const data = req.body;
    const { organizationId, listName } = req.params;

    console.log('Received auth data:', data);

    // Extract critical info (e.g., account_id, provider)
    const accountId = data.account_id; // Store this for future API calls

    console.log(accountId, organizationId, listName);
    
    // Respond to Unipile (optional)
    res.status(200).json({ success: true });
};

// Retrive All Account and Filter only Organization Account
const getAllAccount = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { organizationId } = req.body;
    console.log("Retrieving accounts for:", organizationId);
  
    try {
      const client = new UnipileClient(BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE);
      const response = await client.account.getAll();
      const responseArray = response?.items || [];
  
      // Array of IDs to filter for
      const arrayId = ["AmhI2yYaQqSFBjN2bPGqmQ", "9xEqWIR_SZCjMmjtuvaGPA"];
  
      // Filter only the accounts whose id exists in the arrayId
      const filteredAccounts = responseArray.filter(account =>
        arrayId.includes(account.id)
      );
  
      return res.status(200).json(filteredAccounts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Failed to retrieve accounts",
        details: error.message,
      });
    }
};

module.exports = {
    addCustomDomain,
    connectLinkedInAccount,
    callBackLinkedIn,
    getAllAccount
}
