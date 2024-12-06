const User_Model = require('../../models/User');
const Chrome_Extention_Token_Model = require("../../models/ChromeToken");
const LeadLists_Model = require('../../models/LeadLists');
const UserTransactions_Model = require('../../models/UserTransactions');

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


// Validate Chrome Token
const validateChromeToken = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { chromeToken  } = req.params;

  try {
    // Find an existing token by title
    let existingToken = await Chrome_Extention_Token_Model.findOne({ chromeToken });

    if (existingToken) {
      return res.status(200).json({ status: true, data: "Token exist" });
    } else {
      return res.status(201).json({ status: true, data: "Token do not exist" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while finding token" });
  }
};


// Get Lead List and Token details
const getDetailsChromeToken = async (req, res) => {
  try {
    const { chromeToken } = req.params;

    const tokenDetails = await Chrome_Extention_Token_Model.findOne({ chromeToken });
    const { organizationId, userEmail } = tokenDetails;

    const result = await LeadLists_Model.find(
      { organizationId },
    ).sort({ createdAt: -1 });

    if (!result) {
      var sendData = {
        leadLists: [],
        organizationId,
        userEmail
      }
      return res.status(200).json({ status: true, data: sendData });
    }

    var sendData = {
      leadLists: result,
      organizationId,
      userEmail
    }

    return res.status(200).json({ status: true, data: sendData || [] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}


// Purchase Chrome Credits
const purchaseChromeCredits = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
      plan,
      email,
      organizationId,
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      priceType
  } = req.body;

  try {
    var creditsPlan = 500;

    if (plan === "pro") {
      creditsPlan = 1200;
    }

    const chromeCredits = await User_Model.findOne({ organizationId }).sort({
      createdAt: -1,
    });

    if (chromeCredits) {
      creditsPlan = creditsPlan + chromeCredits?.chromeExtentionCredit;
    }
    
    await User_Model.updateOne(
        { organizationId },
        { $set: { chromeExtentionCredit: creditsPlan }}
    )

    const newUserTransaction = new UserTransactions_Model({
        email,
        organizationId,
        plan,
        channel: "PayPal",
        paymentType: "Extention Credits",
        priceType,
        paymentInformation: {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        }
    });

    const userres = await newUserTransaction.save();

    return res.status(200).json({ status: true, data: userres });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while creating new token" });
  }
};

// Get User Chrome Credits
const getUserChromeCredits = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const chromeCredits = await User_Model.findOne({ organizationId }).sort({
      createdAt: -1,
    });

    if (!chromeCredits) {
      return res.status(200).json({ success: true, data: 0 });
    }

    return res.status(200).json({ success: true, data: chromeCredits?.chromeExtentionCredit });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};



module.exports = {
    createChromeToken,
    getUserToken,
    updateChromeToken,
    validateChromeToken,
    getDetailsChromeToken,
    purchaseChromeCredits,
    getUserChromeCredits
}