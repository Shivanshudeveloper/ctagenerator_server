const axios = require("axios");
const { OTHER_SERVICE_URL } = require("../../config/config");
const User_Model = require('../../models/User');
const DraftAiAgentSettings_Model = require("../../models/DraftAiAgentSettings");
const AIAgents_Model = require('../../models/AIAgents');


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
    const { organizationId, linkedInUrl, prospectName, prospectTitle, prospectCompany, prospectLocation, productDescription, gptPrompt, aiModel, wordLength, emailTone } = req.body;

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
            emailTone
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
  const { organizationId, linkedInUrl, prospectName, prospectTitle, prospectCompany, prospectLocation, productDescription, gptPrompt, aiModel, wordLength, emailTone } = req.body;

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
          emailTone
      })

      await updateEngageCredit(organizationId, 1);

      res.status(200).json({ message: "Email generated successfully", data: response?.data });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
}

// Save the settings for Draft AI Agent
const saveSettings = async (req, res) => {
  const { organizationId, linkedInUrl, prospectName, prospectTitle, prospectCompany, 
          prospectLocation, agentObjectId, productDescription, gptPrompt, aiModel, wordLength, 
          emailTone, agentType } = req.body;

  try {

      const settings = await AIAgents_Model.findById({ _id: agentObjectId });


      const updatedDraft = await DraftAiAgentSettings_Model.findOneAndUpdate(
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
              emailTone
          },
          { 
              new: true,
              upsert: true 
          }
      );

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


module.exports = {
    generateEmail,
    generateColdDm,
    saveSettings,
    getAiAgentSettings,
    generateEmailAiAgent,
    generateColdDmAiAgent
}

