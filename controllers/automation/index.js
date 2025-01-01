const PhoneNumbers_Model = require('../../models/PhoneNumbers');
const AICampaginLeads_Model = require('../../models/AICampaginLeads');

const { v4: uuidv4 } = require("uuid");
const { getStatusfromAI } = require('../ai');

const DtmfTone = {
    One: '1',
    Two: '2'
};

const responseTypes = {
    confirm: {
        label: "Confirm",
        phrases: ["Confirm", "Yes", "Sure", "Okay", "Confirmed", "That's correct", "Correct", "Fine", "That works"],
        tone: DtmfTone.One
    },
    cancel: {
        label: "Cancel",
        phrases: ["Cancel", "No", "Don't", "Cancelled", "Not available", "Can't make it", "Cannot", "Not possible", "Reschedule", "Another time", "Different time", "Move the meeting", "Change time", "Change the time", "Different date"],
        tone: DtmfTone.Two
    }
};

function getMessageStatus(conversationArray) {
    // Check if array is empty
    if (!conversationArray || conversationArray.length === 0) {
        return {
            status: 'not_pick_up',
            message: 'No conversation found'
        };
    }

    // Check if array length is 1
    if (!conversationArray || conversationArray.length === 1) {
        return {
            status: 'call_disconnected',
            message: 'No conversation found'
        };
    }

    // Find the last user message
    const lastUserMessage = [...conversationArray]
        .reverse()
        .find(msg => msg.role === 'user');
    
    if (!lastUserMessage) {
        return {
            status: 'unknown',
            message: 'No user message found'
        };
    }

    const userContent = lastUserMessage.content.trim().toLowerCase();

    // Check for confirmation phrases
    const isConfirmed = responseTypes.confirm.phrases
        .some(phrase => userContent.includes(phrase.toLowerCase()));

    // Check for cancellation phrases
    const isCancelled = responseTypes.cancel.phrases
        .some(phrase => userContent.includes(phrase.toLowerCase()));

    if (isConfirmed && !isCancelled) {
        return {
            status: 'confirmed',
            tone: responseTypes.confirm.tone,
            message: 'User confirmed the meeting'
        };
    }

    if (isCancelled && !isConfirmed) {
        return {
            status: 'cancelled',
            tone: responseTypes.cancel.tone,
            message: 'User cancelled the meeting'
        };
    }

    return {
        status: 'ambiguous',
        message: 'Unable to determine user intent'
    };
}

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
    const { phoneNumber, status } = req.body;
    console.log(phoneNumber, status);
    
    try {
        const updatedPhoneNumber = await PhoneNumbers_Model.findOneAndUpdate(
            { phoneNumber },
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
    var { leadObjectId, conversation, callDuration, type } = req.body;

    try {
        console.log(leadObjectId, conversation, callDuration, type);

        var status = "completed";

        if (type === "yesorno") {
            console.log("yesorno Call");

            if (!conversation || conversation.length === 0) {  // Check if conversation is undefined OR empty
                status = "not_pick_up";
            } else {
                const result = getMessageStatus(conversation);
                status = result?.status;
            }
        } else if (type === "directmessage") {
            if (conversation.length === 1) {
                status = "completed";
            } else {
                status = "call_disconnected";
            }
        } else {
            console.log("conversational Call");
            if (!conversation || conversation.length === 0) {  // Check if conversation is undefined OR empty
                status = "not_pick_up";
            } else if (conversation.length === 3) {
                status = "not_interested";
            } else {
                status = await getStatusfromAI(conversation);  
                status = status.toLowerCase();
            }
        }

        console.log(status);
        
        const updatedCampaignLead = await AICampaginLeads_Model.findOneAndUpdate(
            { _id: leadObjectId },
            { conversationHistory: conversation, status, callDuration },
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