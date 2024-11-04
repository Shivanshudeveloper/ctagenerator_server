const User_Model = require('../../models/User');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const sendOnboardingEmailResend = require("../../lib/resend_email").default.sendOnboardingEmailResend;

const checkUser = async (req, res) => {
    res.status(200).json({ status: true, data: true });
}

const addRegisteredUser = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const submitrequest = req.body;

    try {
        const organizationId = `${Date.now()}_${uuidv4()}`;
        const existingUser = await User_Model.findOne({ email: submitrequest.email });

        if (existingUser) {
            return res.status(400).json({ status: false, data: 'User already registered' });
        }

        try {
            const newUser = new User_Model({
                fullName: submitrequest?.fullName,
                organizationId,
                email: submitrequest?.email,
                companyName: submitrequest?.email
            });
    
            const userres = await newUser.save();

            return res.status(200).json({ status: true, user_data: userres });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, data: 'Registration failed' });
    }
};



// Get User Details
const getUserDetials = async (req, res) => {
    const { email } = req.params;
    console.log("Email : ",email);
    User_Model.findOne({ email }).sort({ createdAt: -1 })
        .then((data) => {
            console.log("user Found : ",data);
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
}

// Get User Details
const getUserLeadsCredits = async (req, res) => {
    const { organizationId } = req.params;
    console.log("Leads Credits", organizationId);
    const result = await User_Model.findOne({ organizationId });

    if (!result) {
        return res.status(404).json({ status: false, error: "User not found" });
    }

    return res.json({ 
        status: true, 
        data: {
            leadsCredit: result.leadsCredit || 0,
        }
    });
}

// Get User Engage Credit
const getUserEngageCredits = async (req, res) => {
    const { organizationId } = req.params;
    console.log("Leads Credits", organizationId);
    const result = await User_Model.findOne({ organizationId });

    if (!result) {
        return res.status(404).json({ status: false, error: "User not found" });
    }

    return res.json({ 
        status: true, 
        data: {
            engageCredit: result.engageCredit || 0,
        }
    });
}

// Get User Details
const getUserPlanDetails = async (req, res) => {
    const { organizationId } = req.params;
    console.log("organizationId : ", organizationId);
    User_Model.findOne({ organizationId }).sort({ createdAt: -1 })
        .then((data) => {
            console.log("user Found : ", data);
            res.status(200).json({ status: true, planSubscribed: data?.plan, priceType: data?.priceType || "No Plan" });
        })
        .catch((err) => console.log(err));
}


const sendOnboardingEmail = async (req, res) => {
    const { fullName, email } = req.body;
    console.log("Sending Onboarding Email : ", fullName, email);

    const result = await sendOnboardingEmailResend(fullName, email);
    return res.status(200).json({ status: true, data: result });
}

module.exports = {
    checkUser,
    addRegisteredUser,
    getUserDetials,
    getUserPlanDetails,
    getUserLeadsCredits,
    sendOnboardingEmail,
    getUserEngageCredits
}
