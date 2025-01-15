const { azureDetectEmailScraperInstruction, azureDetectPhoneScraperInstruction, azureDetectLeadFinderFiltersInstruction } = require("../../lib/aiagent_instruction");


const findScraperInstructions = async (req, res) => {
    let { instruction, agentType } = req.body;
    var getUserInstructionsScraper;

    try {
        if (agentType === "Email_Scraper") {
            getUserInstructionsScraper = await azureDetectEmailScraperInstruction(instruction);
        } else {
            getUserInstructionsScraper = await azureDetectPhoneScraperInstruction(instruction);
        }

        const jsonObject = getUserInstructionsScraper;

        return res.status(200).json({
            status: true,
            data: jsonObject,
        });

    } catch (error) {
        console.error('Error adding custom domain:', error);
        res.status(500).json({ 
            error: 'Failed to add custom domain',
            details: error.message 
        });
    }
}


const findLeadFinderInstructions = async (req, res) => {
    let { instruction, agentType } = req.body;
    var getUserInstructionsScraper;

    try {
        getUserInstructionsScraper = await azureDetectLeadFinderFiltersInstruction(instruction);

        const jsonObject = getUserInstructionsScraper;

        return res.status(200).json({
            status: true,
            data: jsonObject,
        });

    } catch (error) {
        console.error('Error adding custom domain:', error);
        res.status(500).json({ 
            error: 'Failed to add custom domain',
            details: error.message 
        });
    }
}


module.exports = {
    findScraperInstructions,
    findLeadFinderInstructions
}
