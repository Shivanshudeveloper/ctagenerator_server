const User_Model = require('../../models/User');
const RegisteredUsers_Model = require('../../models/RegisteredUsers');
const UserTransactions_Model = require('../../models/UserTransactions');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { APP_URL } = require("../../config/config");
const sendEmailResend = require("../../lib/resend_email").default.sendEmail;

const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');



const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_SECRET;


// Create User Checkout Session
const createCheckoutSession = async (req, res) => {
    try {
        const { customerId, priceId } = req.body;

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${APP_URL}/dashboard/app`,
            cancel_url: `${APP_URL}/plan`,
        });
        
        res.status(200).send({ sessionId: session.id });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


// Create User Checkout Session
const checkSubscriptionStatus = async (req, res) => {
    try {
        const { customerId } = req.params;

        User_Model.findOne({ customerId })
            .then(async (data) => {
                const subscriptionId = data?.subscriptionId;
                const alertSeen = data?.alertSeen;
                // Check Subsription Status
                const subscriptionUser = await stripe.subscriptions.retrieve(subscriptionId);
                var data = {
                    status: subscriptionUser.status,
                    current_period_end: subscriptionUser.current_period_end,
                    alertSeen
                }
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
        
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

// Create User Checkout Session
const alertSeen = async (req, res) => {
    try {
        const { customerId } = req.params;

        User_Model.updateOne({ customerId }, { $set: {alertSeen: true } })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
        
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

// Create User Checkout Session
const createRazorpayOrder = async (req, res) => {
    const { amount, plan, userEmail } = req.body;

    let receipt = `RECIPT_${Date.now()}_${uuidv4()}`;

    receipt = receipt.slice(0, 40);

    console.log(`Payment Order for User ${userEmail} of Plan ${plan}. RECIPT: ${receipt}`);

    let mainAmount = 0;

    if (plan === "basic") {
        mainAmount = 4.99;
    } else if (plan === "starter"){
        mainAmount = 9.99;
    } else if (plan === "premium"){
        mainAmount = 11.99;
    } else {
        mainAmount = 11.99;
    }

    try {
        const instance = new Razorpay({
            key_id: `${keyId.toString()}`,
            key_secret: `${keySecret.toString()}`,
        });

        const options = {
            amount: mainAmount * 100, // amount in smallest currency unit
            currency: "USD",
            receipt: receipt,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

const successRazorPay = async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            plan,
            email,
            organizationId,
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        } = req.body;

        try {
            User_Model.updateOne({ organizationId }, { $set: {plan: plan } })
                .then(async (data) => {
                    const newUserTransaction = new UserTransactions_Model({
                        email,
                        organizationId,
                        plan,
                        channel: "PayPal",
                        paymentInformation: {
                            orderCreationId,
                            razorpayPaymentId,
                            razorpayOrderId,
                            razorpaySignature
                        }
                    });
                    const userres = await newUserTransaction.save();
                    // sendEmailResend(fullName, email, packagePlan, userres?._id);
                    return res.status(200).json({ status: true, msg: 'success', orderId: razorpayOrderId, paymentId: razorpayPaymentId, userId: userres?._id });
                })
                .catch((err) => console.log(err));
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

const getUserAccountStatus = async (req, res) => {
    try {
        const { organizationId } = req.params; // Assuming organizationId is passed as a route parameter
        // Validate organizationId
        if (!organizationId) {
            res.status(400).send({ error: "No OrgId" });
        }

        // Find the user document and select only the accountStatus field
        const result = await User_Model.findOne(
            { organizationId: organizationId },
            { accountStatus: 1, _id: 0 } // 1 means include, 0 means exclude
        );

        if (!result) {
            res.status(400).send({ error: "User not found" });
        }

        res.json({ status: true, data: result?.accountStatus });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
}

module.exports = {
    createCheckoutSession,
    checkSubscriptionStatus,
    alertSeen,
    createRazorpayOrder,
    successRazorPay,
    getUserAccountStatus
}