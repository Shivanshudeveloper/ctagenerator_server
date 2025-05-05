const { MongoClient } = require('mongodb');

const DraftAgentLeads_Model = require('../models/DraftAgentLeads');
const AIAgents_Model = require('../models/AIAgents');


const SECONDARY_DB_URI = process.env.SECONDARY_DB_URI; // Your secondary database URI

let secondaryDb;

// Connect to the secondary database
const connectToSecondaryDb = async () => {
  if (!secondaryDb) {
    const client = new MongoClient(SECONDARY_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    secondaryDb = client.db('maindata'); // Access the database object
  }
  return secondaryDb;
};


const findPersonByFullName = async (firstName, lastName) => {
  try {
    const db = await connectToSecondaryDb();
    const collection = db.collection('peopleData2');

    console.log(firstName, lastName);

    // Create a promise that rejects after 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Query timeout: Operation took longer than 10 seconds'));
      }, 10000);
    });

    // Create the query promise
    const queryPromise = collection.findOne({
      First_Name: { $regex: new RegExp(`^${firstName}$`, 'i') },
      Last_Name: { $regex: new RegExp(`^${lastName}$`, 'i') }
    });

    // Race between the query and timeout
    const person = await Promise.race([queryPromise, timeoutPromise])
      .catch(error => {
        console.error('Query failed or timed out:', error.message);
        return {};  // Return empty object on timeout or error
      });

    return person || {};  // Return empty object if person is null/undefined

  } catch (error) {
    console.error('Error querying secondary database:', error);
    return {};  // Return empty object on any other error
  }
};


// Add Leads
const addLeadsToListAgent = async (dataSend) => {
    let { organizationId, leadsData, listName } = dataSend;

    // Get all agents associated with this listName
    const allAgents = await AIAgents_Model.find({ 
        organizationId, 
        listName 
    }).lean();

    if (!allAgents || allAgents.length === 0) {
        console.log('No agents found for this list');
        return 'No agents associated with this list';
    }

    // Process agents sequentially to avoid race conditions
    for (const agent of allAgents) {
        const aiAgentUid = agent?.aiAgentUid;
        const campaignUid = agent?.campaignUid;
        const agentType = agent?.trainingData?.agentType;

        if (!aiAgentUid) {
            console.log('Skipping agent without UID');
            continue;
        }

        // Common lead processing logic
        const processLeads = async (model, extraFields = {}) => {
            const mappings = leadsData.map(lead => ({
                organizationId,
                leadId: lead._id,
                ...extraFields,
                status: 'pending'
            }));

            if (mappings.length > 0) {
                await model.insertMany(mappings);
                console.log(`Added ${mappings.length} leads to ${model.modelName}`);
            }
        };

        try {
            if (agentType === "Draft_Emails" || agentType === "Draft_DMs") {
                console.log('Processing draft agent:', aiAgentUid);
                await processLeads(DraftAgentLeads_Model, {
                    aiAgentUid,
                    listName
                });
            } 
        } catch (agentError) {
            console.error(`Error processing agent ${aiAgentUid}:`, agentError);
            throw agentError; // Bubble up to retry mechanism
        }
    }

    console.log('Successfully processed all agents');
    return 'Leads added to list successfully';
}


const convertToHtml = (text) => {
  // Replace line breaks with <br> tags
  return text.replace(/\n/g, '<br>');
};

const formatEmailBody = (emailBody) => {
  // Remove "Email body:" prefix if it exists
  let cleanedBody = emailBody.replace(/^Email body:/i, '').trim();
  
  // Convert remaining text to HTML with proper paragraph breaks
  // Split by line breaks or periods followed by capital letters (for cases without line breaks)
  let paragraphs = cleanedBody.split(/\n+|(?<=[.!?])\s+(?=[A-Z])/g)
    .filter(p => p.trim().length > 0)
    .map(p => `<p>${p.trim()}</p>`)
    .join('');
  
  return paragraphs;
};

module.exports = {
    findPersonByFullName,
    addLeadsToListAgent,
    convertToHtml,
    
};