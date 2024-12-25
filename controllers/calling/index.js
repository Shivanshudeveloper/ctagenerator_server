const { CallClient, Features } = require('@azure/communication-calling');
const { CommunicationIdentityClient } = require('@azure/communication-identity');
const PhoneNumbers_Model = require('../../models/PhoneNumbers');


// Make a test call
const makeManualCallCampaign = async (req, res) => {
    const {
        prospectDetails
    } = req.body;

    try {

        let existingPhoneNumber = await PhoneNumbers_Model.findOne({ status: 'available', organizationId: 'global' });

        if (!existingPhoneNumber) {
            return res.status(201).json({ status: true, data: "No Phone Number Available" });
        } 
        
        // Code to make a manual call

        // Initialize ACS clients
        const identityClient = new CommunicationIdentityClient(process.env.ACS_CONNECTION_STRING);
        const callClient = new CallClient();
        
        // Create user and get token
        const user = await identityClient.createUser();
        const tokenResponse = await identityClient.getToken(user, ["voip"]);

        // Initialize call agent
        const callAgent = await callClient.createCallAgent(tokenResponse.token);

        // Prepare call options
        const callOptions = {
            alternateCallerId: {
                phoneNumber: existingPhoneNumber?.phoneNumber
            }
        };
        
        // Start the call
        const call = await callAgent.startCall([{ phoneNumber: prospectDetails.phoneNumber }], callOptions);
        
    } catch (error) {
        console.error('Campaign creation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create campaign'
        });
    }
}


module.exports = {
    makeManualCallCampaign
};