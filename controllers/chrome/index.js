const Chrome_Extention_Token_Model = require("../../models/ChromeToken");

const { v4: uuidv4 } = require("uuid");

// Get Chrome Token
const createChromeToken = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { title, organizationId, userEmail  } = req.body;
  
    try {
      // Find an existing token by title
      let existingToken = await Chrome_Extention_Token_Model.findOne({ title });

      if (existingToken) {
        return res.status(200).json({ status: true, data: "Title already exist" });
      } else {
        const chromeToken = `TOKEN_${Date.now()}_${uuidv4()}`;

        const newToek = new Chrome_Extention_Token_Model({
            chromeToken,
            title,
            organizationId,
            userEmail
        });
        const resdata = await newToek.save();
        console.log("New Token Created:" ,resdata);
        return res.status(200).json({ status: true, data: resdata });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, data: "Error while creating new token" });
    }
};

// Get User Token
const getUserToken = async (req, res) => {
    try {
      const { organizationId } = req.params;

      const allToken = await Chrome_Extention_Token_Model.find({ organizationId }).sort({
        createdAt: -1,
      });
      return res.status(200).json({ success: true, data: allToken });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, data: "Something went wrong" });
    }
};

// Update blog
const updateChromeToken = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { chromeId } = req.params;

    const { title, status  } = req.body;

    try {
        const data = await Chrome_Extention_Token_Model.updateOne(
            { _id: chromeId },
            { $set: { title, status }}
        )

        return res.status(200).json({ status: true, data });
    } catch (error) {
        return res.status(500).json({ status: false, data: "Something went wrong" });
    }
};


module.exports = {
    createChromeToken,
    getUserToken,
    updateChromeToken
}