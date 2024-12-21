const AICampagins_Model = require('../../models/AICampagins');
const AICampaginLeads_Model = require('../../models/AICampaginLeads');
const LeadListsData_Model = require('../../models/LeadListsData');

const { v4: uuidv4 } = require("uuid");

// Create new AI Agent
const createNewAiCampagin = async (req, res) => {
    const { 
        organizationId, 
        userEmail, 
        aiAgentUid, 
        name, 
        listName, 
        phoneNumbers
    } = req.body;

    try {
        // Find an existing token by title
        let existingAICampagin = await AICampagins_Model.findOne({ name, organizationId });

        if (existingAICampagin) {
            return res.status(200).json({ status: true, data: "AI Campagin name already exist" });
        } 

        // Create campaign
        const campaignUid = `CAMPAIGN_${Date.now()}_${uuidv4()}`;

        const newCampaign = new AICampagins_Model({
            organizationId,
            userEmail,
            campaginUid: campaignUid,
            aiAgentUid,
            name,
            listName,
            phoneNumbers,
            status: 'active'
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


module.exports = {
    createNewAiCampagin,
    getCampaignLeads,
    updateCampaignLeadStatus
};