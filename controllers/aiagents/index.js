const AIAgents_Model = require('../../models/AIAgents');
const AICampagins_Model = require('../../models/AICampagins');

const { v4: uuidv4 } = require("uuid");

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

module.exports = {
    createNewAiAgent,
    deleteAiAgent,
    updateAiAgent,
    findOneAiAgent,
    findAllAiAgentsByOrg
};