const axios = require("axios");
const { OTHER_SERVICE_URL } = require("../../config/config");
const User_Model = require('../../models/User');


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

      console.log(response?.data);

      await updateEngageCredit(organizationId, 1);

      res.status(200).json({ message: "Email generated successfully", data: response?.data });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
    generateEmail,
    generateColdDm
}

