const TotalLeadsUserStats_Model = require('../../models/TotalLeadsUserStats');

// Get User Leads
const increaseLinksCount = async (req, res) => {
    const { organizationId } = req.params;
  
    try {
        // Check if data exists by organizationId
        const existingData = await TotalLeadsUserStats_Model.findOne({ organizationId });
        if (existingData) {
            // If data exists, increment total_links_clicked by 1
            await TotalLeadsUserStats_Model.updateOne(
                { organizationId },
                { $inc: { total_links_clicked: 1 } }
            );

            const meeting_link = existingData?.meeting_link;
            res.redirect(meeting_link);
            console.log('Total links clicked incremented.');
        } else {
            console.log('Data dose not exist');
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }


}

module.exports = {
    increaseLinksCount
}