const PhoneNumbers_Model = require('../../models/PhoneNumbers');
const AICampaginLeads_Model = require('../../models/AICampaginLeads');

const { v4: uuidv4 } = require("uuid");

// Create new phone number
const createPhoneNumber = async (req, res) => {
    const { phoneNumber, status, organizationId } = req.body;

    try {
        const newPhoneNumber = new PhoneNumbers_Model({
            phoneNumber,
            status,
            organizationId
        });

        await newPhoneNumber.save();
        return res.status(201).json({ 
            success: true, 
            data: newPhoneNumber 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};

// Update phone number status
const updatePhoneNumberStatus = async (req, res) => {
    const { organizationId, phoneNumber, status } = req.body;

    try {
        const updatedPhoneNumber = await PhoneNumbers_Model.findOneAndUpdate(
            { organizationId, phoneNumber },
            { status },
            { new: true }
        );

        if (!updatedPhoneNumber) {
            return res.status(404).json({ 
                success: false, 
                data: "Phone number not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: updatedPhoneNumber 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};

// Delete phone number
const deletePhoneNumber = async (req, res) => {
    const { phoneNumber } = req.params;

    try {
        const deletedPhoneNumber = await PhoneNumbers_Model.findOneAndDelete({ 
            phoneNumber 
        });

        if (!deletedPhoneNumber) {
            return res.status(404).json({ 
                success: false, 
                data: "Phone number not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: "Phone number deleted successfully" 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};

// Find one by organizationId
const findByOrganizationId = async (req, res) => {
    const { organizationId } = req.params;

    try {
        const phoneNumber = await PhoneNumbers_Model.find({ 
            organizationId 
        });

        if (!phoneNumber) {
            return res.status(404).json({ 
                success: false, 
                data: "Phone number not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: phoneNumber 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};

// Find one by phone number
const findByPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.params;

    try {
        const phone = await PhoneNumbers_Model.findOne({ 
            phoneNumber 
        });

        if (!phone) {
            return res.status(404).json({ 
                success: false, 
                data: "Phone number not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: phone 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};

// Find all phone numbers
const findAllPhoneNumbers = async (req, res) => {
    try {
        const phoneNumbers = await PhoneNumbers_Model.find();

        return res.status(200).json({ 
            success: true, 
            data: phoneNumbers 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};


// Update Campaign Lead Automation
const updateCampaignLead = async (req, res) => {
    const { _id, status } = req.body;

    try {
        const updatedCampaignLead = await AICampaginLeads_Model.findOneAndUpdate(
            { _id },
            { status },
            { new: true }
        );

        if (!updatedCampaignLead) {
            return res.status(404).json({ 
                success: false, 
                data: "Phone number not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: updatedCampaignLead 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};



// Add lead conversations
const addLeadConversations = async (req, res) => {
    const { leadObjectId, conversation } = req.body;

    try {

        const updatedCampaignLead = await AICampaginLeads_Model.findOneAndUpdate(
            { _id: leadObjectId },
            { conversationHistory: conversation },
            { new: true }
        );

        if (!updatedCampaignLead) {
            return res.status(404).json({ 
                success: false, 
                data: "Campagin Not Updated" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: updatedCampaignLead 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};



module.exports = {
    createPhoneNumber,
    updatePhoneNumberStatus,
    deletePhoneNumber,
    findByOrganizationId,
    findByPhoneNumber,
    findAllPhoneNumbers,
    updateCampaignLead,
    addLeadConversations
};