const { azureSearchGetDetails, azureSearchGetDetailsNameLookup, azureSearchGetPhoneDetails } = require('../../lib/azure_openai')
const { serpLeads, serpLeadsNameLookup, serpPhoneLeads } = require('../../lib/leads_serper');
const { findPersonByFullName } = require('../../lib/other_services');
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
        console.log("Input must be an array", data);
        return "Input must be an array"
        // throw new Error("Input must be an array");
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
        console.log("Input must be an array", data);
        return "Input must be an array"
        // throw new Error("Input must be an array");
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
        selectInstagram,
        searchPage
    } = req.body;

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

    const searchResponse = await serpLeads(siteArr, niche, location, organizationId, searchPage);

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

    if (stats === "Input must be an array") {
        return res.status(201).json({ status: true, data: [] });
    }

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
        selectInstagram,
        searchPage
    } = req.body;

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

    const searchResponse = await serpPhoneLeads(siteArr, niche, location, organizationId, phoneExtention, searchPage);

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

    if (stats === "Input must be an array") {
        return res.status(201).json({ status: true, data: [] });
    }

    await updateLeadsCredit(organizationId, stats?.validPhones);

    res.status(200).json({ status: true, data: jsonObject });
}


// Search Name Lookup
const searchLeadsNameLookup = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const { niche, location, organizationId } = req.body;

    // This array appears valid. Just make sure `serpLeadsNameLookup` expects this format.
    var siteArr = ["site:contactout.com"];

    // Make sure `serpLeadsNameLookup` returns a well-defined object
    const searchResponse = await serpLeadsNameLookup(siteArr, niche, location, organizationId);

    // `findPersonByFullName` should return either an object or null/undefined if not found.
    const peopleDbResponse = await findPersonByFullName(niche, location);

    // Check if searchResponse?.organic is empty
    // If `searchResponse` is null or undefined, the `?.` operator prevents an error.
    if (!searchResponse?.organic || searchResponse.organic.length === 0) {
        // Returns an empty data array if no leads are found
        return res.status(201).json({ status: true, data: [] });
    }

    // Make sure `azureSearchGetDetailsNameLookup` returns data that `extractJsonObject` can handle
    const getUserDeatilsResponse = await azureSearchGetDetailsNameLookup(searchResponse);

    // If `extractJsonObject` is well-defined, it should return an object or null/undefined if no JSON is found.
    const jsonObject = extractJsonObject(getUserDeatilsResponse) || { data: [] };

    // Logging is fine for debugging
    console.log(peopleDbResponse, jsonObject);

    var peopleData;
    var peopleDataArr = [];

    // Safely handle the case when `peopleDbResponse` is empty or null
    if (peopleDbResponse) {
        peopleData = {
            Name: `${peopleDbResponse?.First_Name || ''} ${peopleDbResponse?.Last_Name || ''}`.trim(),
            Phone_Number: peopleDbResponse?.Primary_Phone || null,
            Email: peopleDbResponse?.Email || null,
            Link: peopleDbResponse?.Person_Linkedin_Url || null
        };
        peopleDataArr.push(peopleData);
    } else {
        peopleData = {};
    }

    // The following lines are commented out, but if you use them, ensure `jsonObject.data` is always defined.
    // const stats = calculateEmailStats(jsonObject?.data);
    // await updateLeadsCredit(organizationId, stats?.validEmails);

    // Return the results
    // `jsonObject` and `peopleDataArr` are guaranteed defined. `jsonObject` was set to at least `{ data: [] }` if null.
    return res.status(200).json({
        status: true,
        data: jsonObject,
        peopleDataArr
    });
};



module.exports = {
    searchLeads,
    searchLeadsNameLookup,
    searchLeadsPhone
}