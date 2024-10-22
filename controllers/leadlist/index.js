const LeadLists_Model = require('../../models/LeadLists');
const LeadListsData_Model = require('../../models/LeadListsData');



const addNewUserList = async (req, res) => {
    let { organizationId, listName } = req.body;

    try {
        const existingList = await LeadLists_Model.findOne({
            organizationId,
            listName // No need for case-insensitive regex since we normalized it
        });

        if (existingList) {
            return res.status(400).json({
                error: 'List Name already exists for this organization',
                data: 'List Name already exists for this organization'
            });
        }

        // Create new domain record
        const newList = new LeadLists_Model({
            organizationId,
            listName
        });

        await newList.save();

        return res.status(200).json({
            data: 'List added successfully',
        });

    } catch (error) {
        console.error('Error adding List:', error);
        res.status(500).json({ 
            error: 'Failed to add List',
            details: error.message 
        });
    }
}

// Get All User Leads Lists
const getAllUserListsLeads = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { organizationId } = req.params;
      
    try {
      // Find the document and select only the tags field
      const result = await LeadLists_Model.find(
        { organizationId },
      ).sort({ createdAt: -1 });
  
      if (!result) {
        return res.status(200).json({ status: true, data: [] });
      }
  
      return res.status(200).json({ status: true, data: result || [] });
    } catch (error) {
      return res.status(500).json({ status: false, data: "Something went wrong" });
    }
};


// Add Leads to List
const addLeadsToList = async (req, res) => {
    let { organizationId, leadsData, listName } = req.body;

    try {
        // Prepare the data for bulk insertion
        const bulkData = leadsData.map(lead => ({
            organizationId,
            listName,
            Email: lead?.Email,
            Phone_Number: lead?.Phone_Number,
            Location: lead?.Location,
            Niche: lead?.Niche,
            Link: lead?.Link,
            Company_Name: lead?.Company_Name,
            Company_Website: lead?.Company_Website
        }));

        // Perform bulk insertion
        const result = await LeadListsData_Model.insertMany(bulkData);

        if (result) {
            return res.status(200).json({
                message: 'Leads added to list successfully',
                count: result.length
            });
        } else {
            return res.status(400).json({
                error: 'Failed to add leads to list'
            });
        }

    } catch (error) {
        console.error('Error adding List:', error);
        res.status(500).json({ 
            error: 'Failed to add List',
            details: error.message 
        });
    }
}

// Get Leads in List
const getLeadsInList = async (req, res) => {
    let { listName, organizationId } = req.params;
    
    try {
        // Find the document and select only the tags field
        const result = await LeadListsData_Model.find(
          { listName, organizationId },
        ).sort({ createdAt: -1 });
    
        if (!result) {
          return res.status(200).json({ status: true, data: [] });
        }
    
        return res.status(200).json({ status: true, data: result || [] });
    } catch (error) {
        return res.status(500).json({ status: false, data: "Something went wrong" });
    }
}

module.exports = {
    addNewUserList,
    getAllUserListsLeads,
    addLeadsToList,
    getLeadsInList
}