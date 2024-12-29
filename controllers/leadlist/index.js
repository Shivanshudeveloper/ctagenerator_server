const LeadLists_Model = require('../../models/LeadLists');
const LeadFilters_Model = require('../../models/LeadFilters');
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
    let { page = 1, limit = 10 } = req.query; // Default to page 1 with 10 items
    
    try {
        // Convert to numbers
        page = parseInt(page);
        limit = parseInt(limit);
        
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        
        // Get total count for pagination
        const totalCount = await LeadListsData_Model.countDocuments({ 
            listName, 
            organizationId 
        });
        
        // Find documents with pagination
        const results = await LeadListsData_Model.find(
            { listName, organizationId }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
        return res.status(200).json({ 
            status: true, 
            data: results || [], 
            pagination: {
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            data: "Something went wrong" 
        });
    }
}

// Save Leads Filters
const saveLeadsFilters = async (req, res) => {
    let { organizationId, listName, query, skip, leadsQty } = req.body;

    try {
        // Create new domain record
        const newListFilters = new LeadFilters_Model({
            organizationId,
            listName,
            query,
            skip,
            leadsQty,
        });

        await newListFilters.save();

        return res.status(200).json({
            data: 'List Filters added successfully',
        });

    } catch (error) {
        console.error('Error adding List:', error);
        res.status(500).json({ 
            error: 'Failed to add List',
            details: error.message 
        });
    }
}


// Get Single Lead in List
const getLeadsInListSingle = async (req, res) => {
    let { id } = req.params;
    
    try {
        // Find the document and select only the tags field
        const result = await LeadListsData_Model.findOne(
          { _id: id },
        ).sort({ createdAt: -1 });
    
        if (!result) {
          return res.status(200).json({ status: true, data: {} });
        }
    
        return res.status(200).json({ status: true, data: result || {} });
    } catch (error) {
        return res.status(500).json({ status: false, data: "Something went wrong" });
    }
}

// For downloading leads
const downloadLeads = async (req, res) => {
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
};

// Add User data from CSV
const uploadUserDataCsv = async (req, res) => {
    const { leads } = req.body;

    try {
        if (!Array.isArray(leads)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid data format' 
            });
        }

        // Use bulkWrite for better performance with many records
        const operations = leads.map(lead => ({
            insertOne: {
                document: lead
            }
        }));

        // Process in batches of 1000 to prevent memory issues
        const batchSize = 1000;
        const results = [];

        for (let i = 0; i < operations.length; i += batchSize) {
            const batch = operations.slice(i, i + batchSize);
            const result = await LeadListsData_Model.bulkWrite(batch, {
                ordered: false // Continues processing even if some documents fail
            });
            results.push(result);
        }

        // Calculate total inserted documents
        const totalInserted = results.reduce((acc, result) => 
            acc + result.insertedCount, 0
        );

        res.json({
            success: true,
            message: `Successfully inserted ${totalInserted} leads`,
            totalInserted
        });


    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process CSV data',
            error: error.message
        });
    }
}

// Delete User List and Data
const deleteUserListLeadData = async (req, res) => {
    let { listName, organizationId } = req.params;
    
    try {
        await Promise.all([
            LeadLists_Model.deleteOne({ listName, organizationId }),
            LeadListsData_Model.deleteMany({ listName, organizationId })
        ]);

        return res.status(200).json({ success: true, data: "Lead Lists and Leads deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, data: "Something went wrong" });
    }
};

module.exports = {
    addNewUserList,
    getAllUserListsLeads,
    addLeadsToList,
    getLeadsInList,
    saveLeadsFilters,
    getLeadsInListSingle,
    uploadUserDataCsv,
    downloadLeads,
    deleteUserListLeadData
}