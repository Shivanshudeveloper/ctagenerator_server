const axios = require("axios");
const { OTHER_SERVICE_URL } = require("../../config/config");


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

        res.status(200).json({ message: "Email generated successfully", data: response?.data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    generateEmail
}

