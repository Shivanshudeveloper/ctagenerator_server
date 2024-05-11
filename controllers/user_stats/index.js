const UserStats_Model = require('../../models/UserStats');
const TotalLeadsUserStats_Model = require('../../models/TotalLeadsUserStats');
const Leads = require('../../models/Leads'); 
require('dotenv').config();

// Create User Checkout Session
const checkUserStats = async (req, res) => {
    const { organizationId } = req.params;

    UserStats_Model.findOne({ organizationId }).sort({ date: -1 })
        .then((data) => {
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));

}

// Create User Checkout Session
const checkUserStatsTotalLinks = async (req, res) => {
    const { organizationId } = req.params;

    TotalLeadsUserStats_Model.findOne({ organizationId }).sort({ date: -1 })
        .then((data) => {
            console.log(data);
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));

}

const countPeopleByJobTitle = async (req, res) => {
    try {
        const organizationId = req.params.organizationId; // Assuming the organizationId is passed as a route parameter

        const pipeline = [
            {
                $match: {
                    organizationId: organizationId,
                },
            },
            {
                $group: {
                    _id: '$title',
                    count: { $sum: 1 },
                },
            },
        ];

        const results = await Leads.aggregate(pipeline);

        const countByJobTitle = {};
        results.forEach((result) => {
            countByJobTitle[result._id] = result.count;
        });

        res.status(200).json({ status: true, data: countByJobTitle });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
}


const countByCountry = async (req, res) => {
  try {
      const organizationId = req.params.organizationId; // Assuming the organizationId is passed as a route parameter

      const pipeline = [
          {
              $match: {
                  organizationId: organizationId,
              },
          },
          {
              $group: {
                  _id: '$country',
                  count: { $sum: 1 },
              },
          },
      ];

      const results = await Leads.aggregate(pipeline);

      const countByCountry = {};
      results.forEach((result) => {
          countByCountry[result._id] = result.count;
      });

      res.status(200).json({ status: true, data: countByCountry });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: false, error: 'Internal server error' });
  }
}



const countLeadByDate = async (req, res) => {
    try {
      const organizationId = req.params.organizationId;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the day
      const tenDaysAgo = new Date(currentDate);
      tenDaysAgo.setDate(currentDate.getDate() - 10);
  
      const pipeline = [
        {
          $match: {
            organizationId: organizationId,
            date: { $gte: tenDaysAgo, $lte: currentDate }, // Filter for leads within the last 10 days
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              day: { $dayOfMonth: '$date' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
              },
            },
            count: 1,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ];
  
      const results = await Leads.aggregate(pipeline);
  
      res.status(200).json({ status: true, data: results });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: false, error: 'Internal server error' });
    }
};
  
 

module.exports = {
    checkUserStats,
    checkUserStatsTotalLinks,
    countPeopleByJobTitle,
    countLeadByDate,
    countByCountry
};
