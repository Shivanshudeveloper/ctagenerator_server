const Leads_Model = require('../../models/Leads');
const FileDownload_Model = require('../../models/FileDownload');
const UserStats_Model = require('../../models/UserStats');

require('dotenv').config();

// Create User Checkout Session
const checkLeads = async (req, res) => {
    const { organizationId } = req.params;

    try {
        const resultLeads = await Leads_Model.aggregate([
          {
            $match: { organizationId: organizationId }
          },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: '%m/%d/%Y', date: '$date' } },
                organizationId: organizationId
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.date': 1 } }, 
          { $limit: 11 }
        ]);
        
        const resultEmailCount = await UserStats_Model.find({ organizationId: organizationId }).sort({ date: 1 }).limit(11).select('email_opened');
        const emailOpenedValues = resultEmailCount.map(item => item.email_opened);

        const resultEmailDelivered = await UserStats_Model.find({ organizationId: organizationId }).sort({ date: 1 }).limit(11).select('email_delivered');
        const emailDeliveredValues = resultEmailDelivered.map(item => item.email_delivered);

        const dates = resultLeads.map(({ _id }) => _id.date);
        const leadsCount = resultLeads.map(({ count }) => count);

        const data = {
          emailOpenedValues,
          emailDeliveredValues,
          leadsCount,
          dates
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Get User Leads
const getAllLeadsUser = async (req, res) => {
  const { organizationId } = req.params;

  try {
    Leads_Model.find({ organizationId }).sort({ date: -1 })
      .then((data) => {
          res.status(200).json({ status: true, data });
      })
      .catch((err) => console.log(err));
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
}

// Download Leads
const getUserLeadsDownload = async (req, res) => {
  const { organizationId } = req.params;

  try {
    FileDownload_Model.findOne({ organizationId }).sort({ date: -1 })
      .then((data) => {
          res.status(200).json({ status: true, data });
      })
      .catch((err) => console.log(err));
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
}

const countLeadByDate = async (req, res) => {
  try {
    // Assuming you have a database or data source
    // where your leads are stored

    // Get the date for which you want to count leads
    const { date } = req.params;

    // Get the organization ID for which you want to count leads
    const { organizationId } = req.params;

    // Query your database to count leads for the given date
    const leadsByDate = await LeadModel.countDocuments({
      date: new Date(date),
      organizationId: organizationId,
    });

    // Query your database to count total leads for the given organization on that date
    const totalLeadsForOrganization = await LeadModel.countDocuments({
      organizationId: organizationId,
    });

    // Prepare the response
    const response = {
      leadsByDate: leadsByDate,
      totalLeadsForOrganization: totalLeadsForOrganization,
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports = {
    checkLeads,
    getAllLeadsUser,
    getUserLeadsDownload
}