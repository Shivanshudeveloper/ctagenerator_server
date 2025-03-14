const axios = require("axios");

const AICampagins_Model = require('../../models/AICampagins');
const PhoneNumbers_Model = require('../../models/PhoneNumbers');
const AIAgents_Model = require('../../models/AIAgents');

const AICampaginLeads_Model = require('../../models/AICampaginLeads');
const LeadListsData_Model = require('../../models/LeadListsData');
const Events_Model = require('../../models/Events');

const { v4: uuidv4 } = require("uuid");
const { CALLING_SERVICE_URL, OUTBOUND_CALLING_SERVICE_URL } = require('../../config/config');

// Create new AI Agent
const createNewAiCampagin = async (req, res) => {
    const { 
        organizationId, 
        userEmail, 
        aiAgentUid, 
        name, 
        listName, 
    } = req.body;

    try {
        // Find an existing token by title
        let existingAICampagin = await AICampagins_Model.findOne({ name, organizationId });

        if (existingAICampagin) {
            return res.status(201).json({ status: true, data: "AI Campagin name already exist" });
        } 

        // Create campaign
        const campaignUid = `CAMPAIGN_${Date.now()}_${uuidv4()}`;

        const newCampaign = new AICampagins_Model({
            organizationId,
            userEmail,
            campaignUid,
            aiAgentUid,
            name,
            listName,
            status: 'pause'
        });

        const resdata = await newCampaign.save();

        console.log("New Campagin Created:" ,resdata);

        // Find all leads for the list
        const leads = await LeadListsData_Model.find({ 
            organizationId, 
            listName 
        }).select('_id').lean();


        // Prepare bulk campaign leads mapping
        const campaignLeadsMappings = leads.map(lead => ({
            organizationId,
            campaignUid,
            leadId: lead._id,
            status: 'pending'
        }));

        // Use bulk insert for better performance
        if (campaignLeadsMappings?.length > 0) {
            await AICampaginLeads_Model.insertMany(campaignLeadsMappings);
        }

        return res.status(200).json({
            success: true,
            data: {
                campaign: newCampaign,
                leadsCount: campaignLeadsMappings.length
            }
        });

    } catch (error) {
        console.error('Campaign creation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create campaign'
        });
    }
}

// Get campaign leads with pagination
const getCampaignLeads = async (req, res) => {
    try {
        const { campaignUid } = req.params;
        const { page = 1, limit = 50, status } = req.query;

        const query = { campaignUid };
        if (status) query.status = status;

        const leads = await AICampaginLeads_Model.find(query)
            .populate('leadId')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await AICampaginLeads_Model.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                leads,
                total,
                pages: Math.ceil(total / limit),
                currentPage: page
            }
        });

    } catch (error) {
        console.error('Error fetching campaign leads:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch campaign leads'
        });
    }
};

// Get all campaign leads with pagination
const getAllCampaignLeads = async (req, res) => {
    try {
        const { campaignUid } = req.params;

        const query = { campaignUid };

        const leads = await AICampaginLeads_Model.find(query)
            .populate('leadId')
            .sort({ createdAt: -1 });

        const total = await AICampaginLeads_Model.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                leads,
                total
            }
        });

    } catch (error) {
        console.error('Error fetching campaign leads:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch campaign leads'
        });
    }
};

// Update campaign lead status
const updateCampaignLeadStatus = async (req, res) => {
    try {
        const { leadId, campaignUid } = req.params;
        const { status } = req.body;

        const updatedLead = await AICampaginLeads_Model.findOneAndUpdate(
            { leadId, campaignUid },
            {
                $set: { 
                    status,
                    lastContactAttempt: new Date()
                },
                $inc: { attempts: 1 }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: updatedLead
        });

    } catch (error) {
        console.error('Error updating campaign lead:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update campaign lead'
        });
    }
};

// Get one AI Campagin Details
const getCampaignDetails = async (req, res) => {
    const { _id } = req.params;

    try {
        const campaign = await AICampagins_Model.findById({ _id });

        if (!campaign) {
            return res.status(404).json({ success: false, data: {} });
        }

        return res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
};

// Get one All User AI Campagin Details
const getAllUserCampaignDetails = async (req, res) => {
    const { organizationId } = req.params;

    try {
        const campaign = await AICampagins_Model.find({ organizationId }).sort({ createdAt: -1 });

        if (!campaign) {
            return res.status(404).json({ success: false, data: [] });
        }

        return res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
};

// Make a test call
const makeTestCallCampaign = async (req, res) => {
    const {
        organizationId, 
        campaignUid,
        targetPhoneNumber,
        prospectFirstName,
        prospectLastName,
    } = req.body;

    try {

        let existingPhoneNumber = await PhoneNumbers_Model.findOne({ status: 'available', organizationId: 'global' });

        if (!existingPhoneNumber) {
            return res.status(201).json({ status: true, data: "No Phone Number Available" });
        } 
        
        // Find an existing data
        let existingAICampagin = await AICampagins_Model.findOne({ campaignUid });
        let existingAigent = await AIAgents_Model.findOne({ aiAgentUid: existingAICampagin?.aiAgentUid });

        var callingData;

        var initialGreeting = `Hi, ${prospectFirstName} I am ${existingAigent?.name} from ${existingAigent?.trainingData.company} is this a good time to chat with you?`;
        var productDescription = existingAigent?.trainingData.productDescription;
        var gptPrompt = existingAigent?.trainingData.gptPrompt || "";
        var aiCompanyName = existingAigent?.trainingData.company || "";

        var systemPromptGpt = `${gptPrompt}. Your prospect name to whom you are talking is ${prospectFirstName}. IMPORTANT: Don't simply tell the product description be more human like if user is interested about the product then start your conversation like, I would like to tell you about our product that can help your business, [SERVICE DESCRIPTION]. Keep your responses concise and under 60 words and don't introduce yourself.Be friendly and conversational, focusing on key points only. Make sure not to introduce yourself or say things like Hope you are doing well. Just tell about the product and try to convert the lead.' You also need to end the conversation fast, if the prospect is interested or like the service just tell him someone from our team will reach him out and say 'Good Bye'. If he is not interested, busy or don't want to talk simply end the conversation by 'Good Bye'`

        console.log(systemPromptGpt);
        
        if (existingAigent?.trainingData.agentType === "Conversational") {
            
            callingData = {
                targetPhoneNumber,
                sourcePhoneNumber: existingPhoneNumber?.phoneNumber,
                campaignUid: campaignUid,
                initialGreeting,
                timeoutPrompt: "I apologize, but I didn't hear anything. Could you please repeat that?",
                goodbyePrompt: "Thank you for your time. Have a great day!",
                systemPrompt: systemPromptGpt,
                ssmlConfig: {
                    voiceName: existingAigent?.trainingData.voiceName || "en-US-JennyNeural",
                    styleDegree: existingAigent?.trainingData.styleDegree || "2",
                    style: existingAigent?.trainingData.style || "cheerful",
                    rate: existingAigent?.trainingData.rate || "0.9",
                    pitch: existingAigent?.trainingData.pitch || "+0.1st",
                    role: existingAigent?.trainingData.voiceType || "YoungAdultFemale"
                }
            }
            
            console.log(callingData);

            // Make the POST request using axios
            const response = await axios.post(`${OUTBOUND_CALLING_SERVICE_URL}/outboundCall`, callingData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return res.status(200).json({
                success: true,
                data: {
                    serviceResponse: response?.data
                }
            });
        } else if (existingAigent?.trainingData.agentType === "Yes or No") {
            callingData = {
                targetPhoneNumber,
                sourcePhoneNumber: existingPhoneNumber?.phoneNumber,
                campaignUid: campaignUid,
                mainMenu: `${productDescription}. Please say Confirm to confirm it or say Cancel to cancel it.`,
                confirmText: "Thank you, it's confirmed!",
                cancelText: "Sure, we've canceled it!",
                customerQueryTimeout: "I’m sorry I didn’t receive a response, please try again.",
                noResponse: "I didn't receive an input, we will go ahead and confirm your appointment. Goodbye",
                invalidAudio: "I’m sorry, I didn’t understand your response, please try again."
            }

            console.log(callingData);

            // Make the POST request using axios
            const response = await axios.post(`${CALLING_SERVICE_URL}/appointmentCall`, callingData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return res.status(200).json({
                success: true,
                data: {
                    serviceResponse: response?.data
                }
            });
        } else {
            callingData = {
                targetPhoneNumber,
                sourcePhoneNumber: existingPhoneNumber?.phoneNumber,
                campaignUid: campaignUid,
                message: `${productDescription}`,
            }

            console.log(callingData);

            // Make the POST request using axios
            const response = await axios.post(`${CALLING_SERVICE_URL}/directMessageCall`, callingData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return res.status(200).json({
                success: true,
                data: {
                    serviceResponse: response?.data
                }
            });
        }
    } catch (error) {
        console.error('Campaign creation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create campaign'
        });
    }
}

// Update AI Campaign
const updateAiCampagin = async (req, res) => {
    const { _id } = req.params;
    const updateData = req.body;

    try {
        // If replace is true, delete all events for this campaign
        // if (updateData.replace && updateData.campaignUid) {
        //     try {
        //         await Events_Model.deleteMany({ campaignUid: updateData.campaignUid });
        //     } catch (deleteError) {
        //         console.error('Error deleting events:', deleteError);
        //         return res.status(500).json({ 
        //             success: false, 
        //             data: "Error deleting campaign events" 
        //         });
        //     }
        // }

        // Remove extra fields that shouldn't be in the update
        const { replace, campaignUid, ...cleanUpdateData } = updateData;

        const updatedAgent = await AICampagins_Model.findByIdAndUpdate(
            _id,
            { $set: cleanUpdateData },
            { new: true, runValidators: true }
        );

        if (!updatedAgent) {
            return res.status(404).json({ 
                success: false, 
                data: "AI Campaign not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: updatedAgent 
        });
    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong" 
        });
    }
};

// Update AI Campaign
const deleteAiCampagin = async (req, res) => {
    const { campaignUid } = req.params;

    try {
        
        const aiCampaign = await AICampagins_Model.findOne({ campaignUid });
 
        if (aiCampaign?.status === "active") {
            return res.status(409).json({ success: false, data: "AI Campaign is active please pause it and then remove it." });
        }

        await Promise.all([
            AICampagins_Model.deleteOne({ campaignUid }),
            AICampaginLeads_Model.deleteMany({ campaignUid })
        ]);

        return res.status(200).json({ success: true, data: "AI Campaign deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
};

module.exports = {
    createNewAiCampagin,
    getCampaignLeads,
    updateCampaignLeadStatus,
    getCampaignDetails,
    getAllUserCampaignDetails,
    makeTestCallCampaign,
    updateAiCampagin,
    deleteAiCampagin,
    getAllCampaignLeads
};