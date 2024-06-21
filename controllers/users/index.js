const User_Model = require('../../models/User');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


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
    User_Model.findOne({ email }).sort({ createdAt: -1 })
        .then((data) => {
            console.log("user Found : ",data);
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
}

module.exports = {
    checkUser,
    addRegisteredUser,
    getUserDetials
}
