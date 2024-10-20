const Domains_Model = require("../../models/Domains");


const addCustomDomain = async (req, res) => {
    let { userEmail, organizationId, domainName } = req.body;

    domainName = domainName.toLowerCase().trim();

    try {
        // Validate domain name format
        const domainRegex = /^([a-zA-Z0-9]-?)+(\.[a-zA-Z0-9-]+)+$/;
        if (!domainRegex.test(domainName)) {
            return res.status(400).json({ error: 'Invalid domain name format' });
        }

        const existingDomain = await Domains_Model.findOne({
            organizationId,
            domainName // No need for case-insensitive regex since we normalized it
        });

        if (existingDomain) {
            return res.status(400).json({
                error: 'Domain already exists for this organization',
                data: 'Please use a different domain name'
            });
        }

        // Create new domain record
        const newDomain = new Domains_Model({
            organizationId,
            domainName, // Will be stored in lowercase
            userEmail
        });

        await newDomain.save();

        return res.status(200).json({
            data: 'Domain added successfully',
        });

    } catch (error) {
        console.error('Error adding custom domain:', error);
        res.status(500).json({ 
            error: 'Failed to add custom domain',
            details: error.message 
        });
    }
}

// Get All User Domains
const getAllUserDomains = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { organizationId } = req.params;
      
    try {
      // Find the document and select only the tags field
      const result = await Domains_Model.find(
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

module.exports = {
    addCustomDomain,
    getAllUserDomains
}
