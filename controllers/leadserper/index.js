const { azureSearchGetDetails, azureSearchGetDetailsNameLookup, azureSearchGetPhoneDetails } = require('../../lib/azure_openai')
const { serpLeads, serpLeadsNameLookup, serpPhoneLeads } = require('../../lib/leads_serper')
const User_Model = require('../../models/User');

function extractJsonObject(text) {
    try {
        // Try to parse the entire text as JSON first
        return JSON.parse(text);
    } catch (firstError) {
        console.log('Failed to parse entire text as JSON:', firstError.message);
        
        try {
            // Try to find and extract the JSON object
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            } else {
                console.log('No JSON-like structure found in text');
                return {};
            }
        } catch (secondError) {
            console.log('Failed to parse extracted JSON:', secondError.message);
            return {};
        }
    }
}

// Utility function to check if object is empty
function isEmptyObject(obj) {
    // Check if obj is null or undefined
    if (obj == null) {
        console.log('Object is null or undefined');
        return true;
    }

    // Check if obj is not an object
    if (typeof obj !== 'object') {
        console.log('Not an object type:', typeof obj);
        return true;
    }

    // Check if it's an array
    if (Array.isArray(obj)) {
        console.log('Object is an array');
        return obj.length === 0;
    }

    // For regular objects, check if it has any own properties
    return Object.keys(obj).length === 0;
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

function calculatePhoneStats(data) {
    // Check if data is an array
    if (!Array.isArray(data)) {
        throw new Error("Input must be an array");
    }
  
    const totalObjects = data.length;
    let validPhones = 0;
  
    // Regular expression for phone number validation with extension support
    const phoneRegex = /^(\+|00)?[\d\s\(\)-]{7,}((\s*(ext|x|ex)\s*\.?\s*|\s*#\s*)(\d{1,}))?\s*$/i;
  
    data.forEach(obj => {
        if (obj.Phone_Number && typeof obj.Phone_Number === 'string') {
            // Remove all non-alphanumeric characters except +
            let cleanedNumber = obj.Phone_Number.replace(/[^0-9a-z+]/gi, '');
            
            // Extract digits only
            let digitsOnly = cleanedNumber.replace(/\D/g, '');
  
            // Check if the number of digits is at least 10
            if (digitsOnly.length >= 10 && phoneRegex.test(cleanedNumber)) {
                validPhones++;
            }
        }
    });
  
    return {
        totalObjects,
        validPhones
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

    // Check if searchResponse?.organic is empty
    if (!searchResponse?.organic || searchResponse.organic.length === 0) {
        return res.status(201).json({ status: true, data: [] });
    }

    console.log("Azure Classification Inprogress...");
    const getUserDeatilsResponse = await azureSearchGetDetails(searchResponse);

    const jsonObject = extractJsonObject(getUserDeatilsResponse);

    if (isEmptyObject(jsonObject)) {
        console.log("No data was found!");
        return res.status(201).json({ status: true, data: [] });
    }

    console.log(jsonObject);
    const stats = calculateEmailStats(jsonObject?.data);

    await updateLeadsCredit(organizationId, stats?.validEmails);

    res.status(200).json({ status: true, data: jsonObject });
}


// Phone Number Leads Search
const searchLeadsPhone = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const { niche, location, phoneExtention, organizationId, selectLinkedIn,
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

    const searchResponse = await serpPhoneLeads(siteArr, niche, location, organizationId, phoneExtention);

    // Check if searchResponse?.organic is empty
    if (!searchResponse?.organic || searchResponse.organic.length === 0) {
        return res.status(201).json({ status: true, data: [] });
    }

    console.log("Azure Classification Inprogress...");
    const getUserDeatilsResponse = await azureSearchGetPhoneDetails(searchResponse);

    const jsonObject = extractJsonObject(getUserDeatilsResponse);

    if (isEmptyObject(jsonObject)) {
        console.log("No data was found!");
        return res.status(201).json({ status: true, data: [] });
    }

    console.log(jsonObject);
    const stats = calculatePhoneStats(jsonObject?.data);
    console.log(stats);

    await updateLeadsCredit(organizationId, stats?.validPhones);

    res.status(200).json({ status: true, data: jsonObject });
}


// Search Name Lookup
const searchLeadsNameLookup = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const { niche, location, organizationId } = req.body;

    var siteArr = ["site:contactout.com"];

    const searchResponse = await serpLeadsNameLookup(siteArr, niche, location, organizationId);

    // Check if searchResponse?.organic is empty
    if (!searchResponse?.organic || searchResponse.organic.length === 0) {
        return res.status(201).json({ status: true, data: [] });
    }

    const getUserDeatilsResponse = await azureSearchGetDetailsNameLookup(searchResponse);

    const jsonObject = extractJsonObject(getUserDeatilsResponse);

    console.log(jsonObject);

    const stats = calculateEmailStats(jsonObject?.data);

    console.log(stats);

    // await updateLeadsCredit(organizationId, stats?.validEmails);

    res.status(200).json({ status: true, data: jsonObject });
}


module.exports = {
    searchLeads,
    searchLeadsNameLookup,
    searchLeadsPhone
}