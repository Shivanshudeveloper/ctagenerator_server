const sdk = require("microsoft-cognitiveservices-speech-sdk");
const { v4: uuidv4 } = require("uuid");

const AIAgents_Model = require('../../models/AIAgents');
const AICampagins_Model = require('../../models/AICampagins');
const LeadListsData_Model = require('../../models/LeadListsData');
const AICampaginLeads_Model = require('../../models/AICampaginLeads');

// Create new AI Agent
const createNewAiAgent = async (req, res) => {
    const { organizationId, userEmail, name, trainingData } = req.body;


    try {
        // Find an existing token by title
        let existingAIAgent = await AIAgents_Model.findOne({ name, organizationId });

        if (existingAIAgent) {
            return res.status(201).json({ status: true, data: "AI Agent name already exist" });
        } 

        const aiAgentUid = `AIAGENT_${Date.now()}_${uuidv4()}`;

        const newAiAgent = new AIAgents_Model({
            organizationId,
            userEmail,
            aiAgentUid,
            name,
            trainingData,
            status: "Live"
        });

        const resdata = await newAiAgent.save();

        console.log("New Ageent Created:" ,resdata);

        return res.status(200).json({ status: true, data: resdata });


    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, data: "Something went wrong" });
    }
}

// New AI Agent Create
const createNewAiAgentWorkFlow = async (req, res) => {
    const { organizationId, userEmail, name, trainingData, listName } = req.body;

    try {
        // Find an existing token by title
        let existingAIAgent = await AIAgents_Model.findOne({ name, organizationId });

        if (existingAIAgent) {
            return res.status(201).json({ status: true, data: "AI Agent name already exists" });
        } 

        const aiAgentUid = `AIAGENT_${Date.now()}_${uuidv4()}`;
        const campaignName = `Campaign_${Date.now()}_${name}`;
        const campaignUid = `CAMPAIGN_${Date.now()}_${uuidv4()}`;

        // Create new AI Agent
        const newAiAgent = new AIAgents_Model({
            organizationId,
            userEmail,
            aiAgentUid,
            name,
            trainingData,
            status: "Live"
        });
        const savedAgent = await newAiAgent.save();
        console.log("New Agent Created:", savedAgent);

        // Create new Campaign
        const newCampaign = new AICampagins_Model({
            organizationId,
            userEmail,
            campaignUid,
            aiAgentUid,
            name: campaignName,
            listName,
            status: 'pause'
        });
        const savedCampaign = await newCampaign.save();
        console.log("New Campaign Created:", savedCampaign);

        // Update AI Agent with campaign ObjectId - Added explicit error handling
        try {
            const updatedAgent = await AIAgents_Model.findOneAndUpdate(
                { aiAgentUid },
                { 
                    $set: { 
                        campaignObjid: savedCampaign._id 
                    } 
                },
                { 
                    new: true, 
                    runValidators: true 
                }
            );

            if (!updatedAgent) {
                console.error("Failed to update AI Agent with campaign ID");
                throw new Error("Failed to update AI Agent with campaign ID");
            }

            console.log("Agent Updated with Campaign ObjectId:", updatedAgent);
        } catch (updateError) {
            console.error("Error updating AI Agent:", updateError);
            throw updateError;
        }

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
                campaign: savedCampaign,
                aiAgent: savedAgent,
                leadsCount: campaignLeadsMappings.length
            }
        });
    } catch (error) {
        console.error("Error in createNewAiAgentWorkFlow:", error);
        return res.status(500).json({ 
            success: false, 
            data: "Something went wrong",
            error: error.message 
        });
    }
};

// Delete AI Agent by ID
const deleteAiAgent = async (req, res) => {
    const { aiAgentUid } = req.params;
 
    try {
        const aiAgentCampaignCheck = await AICampagins_Model.findOne({ aiAgentUid, status: "active" });
 
        if (aiAgentCampaignCheck) {
            return res.status(409).json({ success: false, data: "AI Agent is in use" });
        }
        
        const deletedAgent = await AIAgents_Model.deleteOne({ aiAgentUid });
 
        if (deletedAgent.deletedCount === 0) {
            return res.status(404).json({ success: false, data: "AI Agent not found" });
        }
 
        return res.status(200).json({ success: true, data: "AI Agent deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
 };


// Update AI Agent
const updateAiAgent = async (req, res) => {
    const { _id } = req.params;
    const updateData = req.body;

    try {
        const updatedAgent = await AIAgents_Model.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedAgent) {
            return res.status(404).json({ success: false, data: "AI Agent not found" });
        }

        return res.status(200).json({ success: true, data: updatedAgent });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
};

// Find One AI Agent by ID
const findOneAiAgent = async (req, res) => {
    const { aiAgentUid } = req.params;

    try {
        const agent = await AIAgents_Model.findOne({ aiAgentUid });

        if (!agent) {
            return res.status(404).json({ success: false, data: "AI Agent not found" });
        }

        return res.status(200).json({ success: true, data: agent });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
};

// Find All AI Agents by OrganizationID
const findAllAiAgentsByOrg = async (req, res) => {
    const { organizationId } = req.params;

    try {
        const agents = await AIAgents_Model.find({ organizationId })
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        return res.status(200).json({ 
            success: true, 
            data: agents,
            count: agents.length 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
};

// Create new AI Agent
const liveAudioAiAgentSpeaking = async (req, res) => {
    try {
        const { ssml } = req.body;

        if (!ssml) {
            return res.status(400).json({ 
                error: 'SSML is required' 
            });
        }

        // Create speech config
        const speechConfig = sdk.SpeechConfig.fromSubscription(
            process.env.AZURE_SPEECH_KEY,
            process.env.AZURE_SPEECH_REGION
        );

        // Create a synthesizer
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

        // Synthesize the SSML
        const result = await new Promise((resolve, reject) => {
            synthesizer.speakSsmlAsync(
                ssml,
                (result) => {
                    if (result.errorDetails) {
                        reject(new Error(result.errorDetails));
                    }

                    synthesizer.close();
                    resolve(result);
                },
                (error) => {
                    synthesizer.close();
                    reject(error);
                });
        });

        // Check if synthesis was successful
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            // Get the audio data
            const audioData = result.audioData;

            // Set response headers
            res.set({
                'Content-Type': 'audio/wav',
                'Content-Length': audioData.length
            });

            // Send the audio data
            return res.send(Buffer.from(audioData));
        } else {
            throw new Error('Speech synthesis failed');
        }
    } catch (error) {
        console.error('TTS Error:', error);
        return res.status(500).json({ 
            error: 'Speech synthesis failed',
            details: error.message 
        });
    }
}


module.exports = {
    createNewAiAgent,
    deleteAiAgent,
    updateAiAgent,
    findOneAiAgent,
    findAllAiAgentsByOrg,
    liveAudioAiAgentSpeaking,
    createNewAiAgentWorkFlow
};