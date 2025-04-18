const axios = require("axios");
const { OTHER_SERVICE_URL } = require("../../config/config");
const User_Model = require('../../models/User');
const DraftAiAgentSettings_Model = require("../../models/DraftAiAgentSettings");
const AIAgents_Model = require('../../models/AIAgents');
const DraftAgentLeads_Model = require('../../models/DraftAgentLeads');
const LeadFilters_Model = require('../../models/LeadFilters');

const sendEmailSendingAiResend = require("../../lib/resend_email").default.sendEmailSendingAiResend;
const sendEmailSendingImap = require("../../lib/email_sending").default.sendEmailSendingImap;




// Substact Credit of User
async function updateEngageCredit(organizationId, creditToSubtract) {
    try {
      const result = await User_Model.findOneAndUpdate(
        { organizationId: organizationId },
        [
          {
            $set: {
              engageCredit: {
                $max: [
                  { $subtract: [{ $ifNull: ['$engageCredit', 0] }, creditToSubtract] },
                  0
                ]
              }
            }
          }
        ],
        { new: true, runValidators: true }
      );
  
      if (!result) {
        throw new Error('User not found');
      }
  
      console.log('Updated user:', result);
      return result;
    } catch (error) {
      console.error('Error updating leads credit:', error);
      throw error;
    }
}

// Generate Cold Email
const generateEmail = async (req, res) => {
    const { organizationId, linkedInUrl, prospectName, prospectTitle, prospectCompany, prospectLocation, productDescription, gptPrompt, aiModel, wordLength, emailTone, language, ctaSettings, userCompany } = req.body;
    
    try {
        var response = await axios.post(`${OTHER_SERVICE_URL}/api/v1/enrich/createcoldemail`, {
            linkedinUrl: linkedInUrl,
            prospectName,
            prospectTitle,
            companyName: prospectCompany,
            prospectLocation,
            productDescription,
            gptPrompt,
            modelName: aiModel,
            wordLength,
            emailTone,
            language,
            ctaSettings,
            userCompany
        })

        console.log(response?.data);

        await updateEngageCredit(organizationId, 1);

        res.status(200).json({ message: "Email generated successfully", data: response?.data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// Public use API to create emails for AI Agent
const generateEmailAiAgent = async (req, res) => {
  const { organizationId, agentId, linkedInUrl = "", prospectName = "", prospectTitle = "", prospectCompany = "", prospectLocation = "" } = req.body;

  try {

      // Validate required fields
      if (!organizationId || !agentId) {
          return res.status(400).json({ message: 'organizationId and agentId are required' });
      }

      // Validate at least one input method is provided
      if (!linkedInUrl && (!prospectName || !prospectTitle || !prospectCompany || !prospectLocation)) {
        return res.status(400).json({ 
            message: 'Either linkedInUrl OR all prospect details (name, title, company, location) must be provided'
        });
      }

      const settings = await DraftAiAgentSettings_Model.findOne({ agentObjectId: agentId });

      if (!settings) {
          return res.status(201).json({ message: 'No Agent was Found!', data: {} });
      }


      var response = await axios.post(`${OTHER_SERVICE_URL}/api/v1/enrich/createcoldemail`, {
          linkedinUrl: linkedInUrl,
          prospectName,
          prospectTitle,
          companyName: prospectCompany,
          prospectLocation,
          productDescription: settings.productDescription,
          gptPrompt: settings.gptPrompt,
          modelName: settings.aiModel,
          wordLength: settings.wordLength,
          emailTone: settings.emailTone
      });

      console.log(response?.data);

      await updateEngageCredit(organizationId, 1);

      res.status(200).json({ message: "Email generated successfully", data: response?.data, creditUsed: 1 });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
}

// Public use API to create DMs for AI Agent
const generateColdDmAiAgent = async (req, res) => {
  const { organizationId, agentId, linkedInUrl = "", prospectName = "", prospectTitle = "", prospectCompany = "", prospectLocation = "" } = req.body;
 
  try {
      // Validate required fields
      if (!organizationId || !agentId) {
          return res.status(400).json({ message: 'organizationId and agentId are required' });
      }

      // Validate at least one input method is provided
      if (!linkedInUrl && (!prospectName || !prospectTitle || !prospectCompany || !prospectLocation)) {
        return res.status(400).json({ 
            message: 'Either linkedInUrl OR all prospect details (name, title, company, location) must be provided'
        });
      }

      const settings = await DraftAiAgentSettings_Model.findOne({ agentObjectId: agentId });
 
      if (!settings) {
          return res.status(201).json({ message: 'No Agent was Found!', data: {} });
      }
 
      var response = await axios.post(`${OTHER_SERVICE_URL}/api/v1/enrich/createcolddms`, {
          linkedinUrl: linkedInUrl,
          prospectName,
          prospectTitle,
          companyName: prospectCompany,
          prospectLocation,
          productDescription: settings.productDescription,
          gptPrompt: settings.gptPrompt,
          modelName: settings.aiModel,
          wordLength: settings.wordLength,  
          emailTone: settings.emailTone
      });
 
      await updateEngageCredit(organizationId, 1);
      res.status(200).json({ message: "DM generated successfully", data: response?.data, creditUsed: 1 });
 
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
}

// Generate Cold DM
const generateColdDm = async (req, res) => {
  const { organizationId, linkedInUrl, prospectName, prospectTitle, prospectCompany, prospectLocation, productDescription, gptPrompt, aiModel, wordLength, emailTone, language } = req.body;

  try {
      var response = await axios.post(`${OTHER_SERVICE_URL}/api/v1/enrich/createcolddms`, {
          linkedinUrl: linkedInUrl,
          prospectName,
          prospectTitle,
          companyName: prospectCompany,
          prospectLocation,
          productDescription,
          gptPrompt,
          modelName: aiModel,
          wordLength,
          emailTone,
          language
      })

      await updateEngageCredit(organizationId, 1);

      res.status(200).json({ message: "Email generated successfully", data: response?.data });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
}

// Save the settings for Draft AI Agents
const saveSettings = async (req, res) => {
  const { organizationId, linkedInUrl, prospectName, prospectTitle, prospectCompany, 
          prospectLocation, agentObjectId, productDescription, gptPrompt, aiModel, wordLength, 
          emailTone, language, agentType, webhook, listName, ctaSettings, userCompany } = req.body;

  try {

      const settings = await AIAgents_Model.findById({ _id: agentObjectId });

      var updatedDraft;

      if (!webhook) {
          updatedDraft = await DraftAiAgentSettings_Model.findOneAndUpdate(
            { agentObjectId },
            {
                organizationId,
                linkedInUrl,
                prospectName,
                aiModel,
                prospectTitle,
                prospectCompany,
                prospectLocation,
                productDescription,
                agentObjectId,
                aiAgentUid: settings?.aiAgentUid || "NA",
                gptPrompt,
                agentType,
                wordLength,
                emailTone,
                language,
                ctaSettings,
                userCompany
            },
            { 
                new: true,
                upsert: true 
            }
        );
      } else {
          updatedDraft = await DraftAiAgentSettings_Model.findOneAndUpdate(
            { agentObjectId },
            {
                organizationId,
                agentObjectId,
                webhook
            },
            { 
                new: true,
                upsert: true 
            }
        );
      }

    // Resume List incase if it was stoped

    const findSettingStatus = await LeadFilters_Model.findOne({ 
        listName, 
        organizationId, 
        agentType, 
        status: 3 
    });

    if (findSettingStatus && findSettingStatus.status === 3) {
        // ✅ Check if any leads were actually inserted
        await LeadFilters_Model.updateMany(
            { listName, organizationId, agentType },
            { $set: { status: 2 } }
        );
        console.log("Status changed for the Draft Filter");
    }


    

    res.status(200).json({ 
        message: "Draft settings saved successfully", 
        data: updatedDraft 
    });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
}


// Get the draft ai agent settings
const getAiAgentSettings = async (req, res) => {
  const { agentObjectId } = req.params;

  try {
      const settings = await DraftAiAgentSettings_Model.findOne({ agentObjectId });
      
      if (!settings) {
          return res.status(201).json({ message: 'Settings not found', data: {} });
      }

      res.status(200).json({
          message: 'Settings retrieved successfully',
          data: settings
      });

  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
}

// Get the Website AI agent settings
const getAiAgentWebsiteScraperSettings = async (req, res) => {
    const { agentObjectId } = req.params;
  
    try {
        const settings = await AIAgents_Model.findById({ _id: agentObjectId });
        
        if (!settings) {
            return res.status(201).json({ message: 'Settings not found', data: {} });
        }
  
        res.status(200).json({
            message: 'Settings retrieved successfully',
            data: settings
        });
  
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
  }


// Get draft leads with pagination
const getDraftLeads = async (req, res) => {
  try {
      const { agentUid } = req.params;
      const { page = 1, limit = 50, status } = req.query;

      const query = { aiAgentUid: agentUid };
      if (status) query.status = status;

      const leads = await DraftAgentLeads_Model.find(query)
          .populate('leadId')
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });

      const total = await DraftAgentLeads_Model.countDocuments(query);

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

// Get Draft Email Sending
const getDraftLeadsEmailSending = async (req, res) => {
    try {
        const { listName, organizationId, selectedFilter } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Base query to filter by listName and organizationId
        const query = { listName, organizationId };

        // Apply additional filters based on selectedFilter
        if (selectedFilter !== 'all') {
            switch (selectedFilter) {
                case 'done':
                    query.emailSend = 'done';
                    break;
                case 'wrong_prospect_email':
                    query.emailSend = 'wrong_prospect_email';
                    break;
                case 'linkedin_details_not_found':
                    query.status = 'linkedin_details_not_found';
                    break;
                case 'pending':
                    // Pending: emailSend is not 'done' or 'wrong_prospect_email' AND status is not 'linkedin_details_not_found'
                    query.emailSend = { $nin: ['done', 'wrong_prospect_email'] };
                    query.status = { $ne: 'linkedin_details_not_found' };
                    break;
                default:
                    // Handle unexpected filters (optional: throw error)
                    break;
            }
        }

        // Fetch paginated leads
        const leads = await DraftAgentLeads_Model.find(query)
            .populate('leadId')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Calculate total documents for pagination
        const total = await DraftAgentLeads_Model.countDocuments(query);

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

// Get Draft DM Sending
const getDraftLeadsDmSending = async (req, res) => {
    try {
        const { listName, organizationId, selectedFilter } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Base query to filter by listName and organizationId
        const query = { listName, organizationId };

        // Apply additional filters based on selectedFilter
        if (selectedFilter !== 'all') {
            switch (selectedFilter) {
                case 'done':
                    query.dmSend = 'done';
                    break;
                case 'wrong_prospect_linkedin':
                    query.dmSend = 'wrong_prospect_linkedin';
                    break;
                case 'connection_request_send':
                    query.dmSend = 'connection_request_send';
                    break;
                case 'linkedin_details_not_found':
                    query.status = 'linkedin_details_not_found';
                    break;
                case 'pending':
                    // Pending: dmSend is not 'done' or 'wrong_prospect_linkedin' AND status is not 'linkedin_details_not_found'
                    query.dmSend = { $nin: ['done', 'wrong_prospect_linkedin'] };
                    query.status = { $ne: 'linkedin_details_not_found' };
                    break;
                default:
                    // Handle unexpected filters (optional: throw error)
                    break;
            }
        }

        // Fetch paginated leads
        const leads = await DraftAgentLeads_Model.find(query)
            .populate('leadId')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Calculate total documents for pagination
        const total = await DraftAgentLeads_Model.countDocuments(query);

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

// Get Draft Email Sending
const getEmailSendingStats = async (req, res) => {
    try {
        const { listName, organizationId } = req.params;
        const { status } = req.query;

        const baseQuery = { listName, organizationId };
        if (status) baseQuery.status = status;

        // Get all leads without paginations
        const totalLeads = await DraftAgentLeads_Model.countDocuments(baseQuery);

        // Get email status counts
        const doneCount = await DraftAgentLeads_Model.countDocuments({
            ...baseQuery,
            emailSend: 'done'
        });

        const pendingCount = await DraftAgentLeads_Model.countDocuments({
            ...baseQuery,
            $or: [
                { emailSend: 'not_send' },
                {
                    $and: [
                        // Check for missing emailSend only when status is 'done' OR 'pending'
                        { status: { $in: ['done', 'pending'] } },
                        { emailSend: { $exists: false } }
                    ]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            data: {
                total: totalLeads,
                emailStatusCounts: {
                    done: doneCount,
                    pending: pendingCount
                }
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

// Get DM Stats for LinkedIn Agent
const getDmSendingStats = async (req, res) => {
    try {
        const { listName, organizationId } = req.params;
        const { status } = req.query;

        const baseQuery = { listName, organizationId };
        if (status) baseQuery.status = status;

        // Get all leads without paginations
        const totalLeads = await DraftAgentLeads_Model.countDocuments(baseQuery);

        // Get email status counts
        const doneCount = await DraftAgentLeads_Model.countDocuments({
            ...baseQuery,
            dmSend: 'done'
        });

        const invitationCount = await DraftAgentLeads_Model.countDocuments({
            ...baseQuery,
            dmSend: 'connection_request_send'
        });

        const pendingCount = await DraftAgentLeads_Model.countDocuments({
            ...baseQuery,
            $or: [
                { dmSend: 'not_send' },
                {
                    $and: [
                        // Check for missing dmSend only when status is 'done' OR 'pending'
                        { status: { $in: ['done', 'pending'] } },
                        { dmSend: { $exists: false } }
                    ]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            data: {
                total: totalLeads,
                dmStatusCount: {
                    done: doneCount,
                    pending: pendingCount,
                    invitation: invitationCount
                }
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

// Get Draft Email Sending Graph Data
const getEmailSendGraphData = async (req, res) => {
    try {
        const { listName, organizationId } = req.params;

        // Debugging: Log received parameters
        console.log('Received listName:', listName, 'organizationId:', organizationId);

        // Calculate date range (last 7 days including today)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the day 7 days ago

        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        const emailStatsGraph = await DraftAgentLeads_Model.aggregate([
            {
                $match: {
                    listName: listName,
                    organizationId: organizationId,
                    emailSend: 'done',
                    createdAt: { // Changed from processedAt to createdAt
                        $gte: sevenDaysAgo,
                        $lte: today
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$createdAt" // Group by createdAt
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1
                }
            }
        ]);

        // Debugging: Log aggregation result
        console.log('Aggregation result:', JSON.stringify(emailStatsGraph, null, 2));

        return res.status(200).json({
            success: true,
            data: emailStatsGraph
        });

    } catch (error) {
        console.error('Error fetching email stats:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch email statistics'
        });
    }
};

// Get all draft leads with pagination
const getAllDraftLeads = async (req, res) => {
  try {
      const { agentUid } = req.params;

      const query = { aiAgentUid: agentUid };

      const leads = await DraftAgentLeads_Model.find(query)
          .populate('leadId')
          .sort({ createdAt: -1 });

      const total = await DraftAgentLeads_Model.countDocuments(query);

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

// Update Draft Setting Enable and Disable
const updateDraftSettingEnable = async (req, res) => {
    try {
        const { webhookEnable, agentObjectId } = req.body;

        const updatedSettings = await DraftAiAgentSettings_Model.findOneAndUpdate(
            { agentObjectId },
            { 
                $set: { 
                    webhookEnable
                } 
            }
        );
    
        if (!updatedSettings) {
            throw new Error('Settings not found');
        }
  
        return res.status(200).json({
            success: true,
            data: "Settings Updated"
        });
    } catch (error) {
      console.error('Error updating leads credit:', error);
      throw error;
    }
}


// Update Draft Setting Enable and Disable
const sendEmailResendDomain = async (req, res) => {
    try {
        const { mailBox, prospectEmail, emailBody, subjectName } = req.body;

        await sendEmailSendingAiResend(mailBox, prospectEmail, emailBody, subjectName);
  
        return res.status(200).json({
            success: true,
            data: "Email Send Updated"
        });
    } catch (error) {
      console.error('Error updating leads credit:', error);
      throw error;
    }
}

// Update Draft Setting Enable and Disable
const sendEmailImap = async (req, res) => {
    try {
        const { mailBox, prospectEmail, emailBody, subjectName } = req.body;

        await sendEmailSendingImap(mailBox, prospectEmail, emailBody, subjectName);
  
        return res.status(200).json({
            success: true,
            data: "Email Send Updated"
        });
    } catch (error) {
      console.error('Error updating leads credit:', error);
      throw error;
    }
}


module.exports = {
    generateEmail,
    generateColdDm,
    saveSettings,
    getAiAgentSettings,
    generateEmailAiAgent,
    generateColdDmAiAgent,
    getDraftLeads,
    getAllDraftLeads,
    updateDraftSettingEnable,
    getAiAgentWebsiteScraperSettings,
    sendEmailResendDomain,
    getDraftLeadsEmailSending,
    getEmailSendingStats,
    getEmailSendGraphData,
    sendEmailImap,
    getDraftLeadsDmSending,
    getDmSendingStats
}

