


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