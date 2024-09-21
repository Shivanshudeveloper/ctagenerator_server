const { azureSearchGetDetails } = require('../../lib/azure_openai')
const { serpLeads } = require('../../lib/leads_serper')
const User_Model = require('../../models/User');

function extractJsonObject(text) {
    try {
        // Try to parse the entire text as JSON first
        return JSON.parse(text);
    } catch (e) {
        // If that fails, try to find and extract the JSON object
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e) {
                console.error("Found a match, but it's not valid JSON:", e);
            }
        }
        
        // If no valid JSON object is found, throw an error
        throw new Error("No valid JSON object found in the text");
    }
}

function calculateEmailStats(data) {
    // Check if data is an array
    if (!Array.isArray(data)) {
        throw new Error("Input must be an array");
    }
  
    const totalObjects = data.length;
    let validEmails = 0;
  
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    data.forEach(obj => {
        if (obj.Email && typeof obj.Email === 'string' && emailRegex.test(obj.Email)) {
            validEmails++;
        }
    });
  
    return {
        totalObjects,
        validEmails
    };
}

async function updateLeadsCredit(organizationId, creditToSubtract) {
    try {
      const result = await User_Model.findOneAndUpdate(
        { organizationId: organizationId },
        [
          {
            $set: {
              leadsCredit: {
                $max: [
                  { $subtract: [{ $ifNull: ['$leadsCredit', 0] }, creditToSubtract] },
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

// Add organization users
const searchLeads = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const { niche, location, organizationId, selectLinkedIn,
        selectTwitter,
        selectFacebook,
        selectInstagram } = req.body;

    var siteArr = [];

    if (selectLinkedIn) {
        siteArr.push("site:linkedin.com");
    }

    if (selectTwitter) {
        siteArr.push("site:x.com");
    }

    if (selectFacebook) {
        siteArr.push("site:facebook.com");
    }

    if (selectInstagram) {
        siteArr.push("site:instagram.com");
    }

    const searchResponse = await serpLeads(siteArr, niche, location, organizationId);

    const getUserDeatilsResponse = await azureSearchGetDetails(searchResponse);

    const jsonObject = extractJsonObject(getUserDeatilsResponse);

    console.log(jsonObject);
    const stats = calculateEmailStats(jsonObject?.data);

    await updateLeadsCredit(organizationId, stats?.validEmails);

    res.status(200).json({ status: true, data: jsonObject });
}

module.exports = {
    searchLeads
}