const { UnipileClient } = require('unipile-node-sdk');


const Domains_Model = require("../../models/Domains");
const SocialAccounts_Model = require("../../models/SocialAccounts");
const LinkedInInvitations_Model = require("../../models/LinkedInInvitations");

const { BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE, CALLBACK_UNIPILE, APP_AGENTS_URL } = require('../../config/config');
const { searchLinkedInProfile } = require('./helper');

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
    const { organizationId, listName, agentUid } = req.params;
    
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
        notify_url: `${CALLBACK_UNIPILE}/api/v1/main/linkedin/linkedincallback/${organizationId}/${listName}/${agentUid}`,
        success_redirect_url: APP_AGENTS_URL
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
    const { organizationId, listName, agentUid } = req.params;

    console.log('Received auth data:', data);

    // Extract critical info (e.g., account_id, provider)
    const accountId = data.account_id; // Store this for future API calls

    console.log(accountId, organizationId, listName, agentUid);

    const existingAccount = await SocialAccounts_Model.findOne({
        organizationId,
        agentUid,
        accountId
    });

    if (existingAccount) {
        console.log("Account already exist linkedin ", accountId);
        return res.status(400).json({
            data: 'Account Already Exist in the List and Agent'
        });
    }

    // Create new account record
    const newAccount = new SocialAccounts_Model({
      organizationId,
      listName,
      agentUid,
      accountId,
      accountName: data.name,
      status: data.status,
      type: "LINKEDIN"
    });
    await newAccount.save();
    
    res.status(200).json({ success: true });
};

// Retrive All Account and Filter only Organization Account
const getAllAccount = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { organizationId, agentUid } = req.body;
  console.log("Retrieving accounts for:", organizationId, agentUid);

  try {
    // First, query MongoDB to get the relevant account IDs
    const socialAccounts = await SocialAccounts_Model.find({
      organizationId: organizationId,
      agentUid: agentUid
    }).select('accountId');
    
    // Extract accountId values from the query results
    const accountIds = socialAccounts.map(account => account.accountId);
    
    console.log("Found account IDs in database:", accountIds);
    
    // If no accounts found, return empty array
    if (accountIds.length === 0) {
      return res.status(200).json([]);
    }
    
    // Fetch all accounts from Unipile with pagination
    const client = new UnipileClient(BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE);
    
    let allAccounts = [];
    let nextCursor = null;
    const limit = 100; // You can adjust this value based on your needs (up to 250)
    
    do {
      // Make the API request with pagination parameters
      const options = { limit };
      if (nextCursor) {
        options.cursor = nextCursor;
      }
      
      console.log(`Fetching accounts with options:`, options);
      
      const response = await client.account.getAll(options);
      
      // Extract returned items
      const items = response?.items || [];
      console.log(`Retrieved ${items.length} accounts in this page`);
      
      // Add to our collection
      allAccounts = [...allAccounts, ...items];
      
      // Get cursor for next page (if any)
      nextCursor = response?.cursor || null;
      
    } while (nextCursor);
    
    console.log(`Total accounts fetched from Unipile: ${allAccounts.length}`);
    
    // Filter only the accounts whose id exists in the accountIds array from MongoDB
    const filteredAccounts = allAccounts.filter(account =>
      accountIds.includes(account.id)
    );
    
    console.log(`Accounts matching DB criteria: ${filteredAccounts.length}`);
    
    return res.status(200).json(filteredAccounts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Failed to retrieve accounts",
      details: error.message,
    });
  }
};


// Remove the LinkedIn Account
const removeLinkedInAccount = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { accountId } = req.body;
  console.log("Deleting account for ", accountId);

  try {
    const deletedAccount = await SocialAccounts_Model.findOneAndDelete({
      accountId
    });

    if (!deletedAccount) {
      return res.status(404).json({ status: false, data: "Account not found" });
    }

    const client = new UnipileClient(BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE)
	  const response = await client.account.delete(accountId)
    
    return res.status(200).json({ status: true, data: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Failed to retrieve accounts",
      details: error.message,
    });
  }
};


// Send LinkedIn Invitation
const sendLinkedInInvitaion = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { accountId, identifier, message, agentUid, organizationId } = req.body;

  console.log("Invitation sending for ", accountId, identifier);

  try {
    const profileResults = await searchLinkedInProfile(accountId, identifier);
    const profileProviderId = profileResults?.provider_id;

    if (!profileProviderId) {
      return res.status(400).json({
        error: "Invalid request",
        details: "Could not find LinkedIn profile for the given identifier"
      });
    }

    const client = new UnipileClient(BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE);
    
    // Create the base invitation object
    const invitationParams = {
      account_id: accountId,
      provider_id: profileProviderId,
    };

    // Add message only if it exists and is not empty
    if (message) {
      invitationParams.message = message;
    }

    const response = await client.users.sendInvitation(invitationParams);

    // Create New Invitaion Record
    const newInvitation = new LinkedInInvitations_Model({
        invitationId: response?.invitation_id,
        accountId, 
        organizationId,
        message: message || "",
        agentUid
    });
    await newInvitation.save();

    return res.status(200).json({ response });

  } catch (error) {
    console.error("Invitation Error:", error);

    // Handle specific Unipile API errors
    if (error.body?.status && error.body?.title) {
      return res.status(error.body.status).json({
        error: error.body.title,
        details: error.body.detail,
        type: error.body.type
      });
    }

    // Handle network errors or other exceptions
    return res.status(500).json({
      error: "Failed to send invitation",
      details: error.message
    });
  }
};


// Retrive Information about a Profile
const retriveProfileInformation = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { accountId, identifier } = req.body;

  console.log("Invitation sending for ", accountId, identifier);

  try {
    const profileResults = await searchLinkedInProfile(accountId, identifier);

    if (!profileResults) {
      return res.status(400).json({
        error: "Invalid request",
        details: "Could not find LinkedIn profile for the given identifier"
      });
    }

    return res.status(200).json({ profileResults });
  } catch (error) {
    // Handle network errors or other exceptions
    return res.status(500).json({
      error: "Failed to retrive profile",
      details: error.message
    });
  }
};

module.exports = {
    addCustomDomain,
    connectLinkedInAccount,
    callBackLinkedIn,
    getAllAccount,
    removeLinkedInAccount,
    sendLinkedInInvitaion,
    retriveProfileInformation
}
