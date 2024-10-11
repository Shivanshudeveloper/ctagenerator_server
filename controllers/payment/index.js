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


// Calculate one month ahead date
function getOneMonthAhead(date) {
    // Create a new Date object from the passed date
    const currentDate = new Date(date);
    
    // Get the current month
    let month = currentDate.getMonth();
    
    // Get the current year
    let year = currentDate.getFullYear();
    
    // Add one month
    month++;
    
    // If the month is now 12 (December), reset to 0 (January) and increment the year
    if (month > 11) {
      month = 0;
      year++;
    }
    
    // Create a new date with the same day, but next month and potentially next year
    const futureDate = new Date(year, month, currentDate.getDate());
    
    // Check if the day is different (happens when current date is, for example, March 31 and next month only has 30 days)
    if (futureDate.getDate() !== currentDate.getDate()) {
      // Set to the last day of the previous month
      futureDate.setDate(0);
    }
    
    return futureDate;
}

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
        mainAmount = 19.99;
    } else if (plan === "premium"){
        mainAmount = 49.99;
    } else {
        mainAmount = 49.99;
    }

    try {
        const instance = new Razorpay({
            key_id: `${keyId.toString()}`,
            key_secret: `${keySecret.toString()}`,
        });

        const options = {
            amount: parseInt(mainAmount * 100), // amount in smallest currency unit
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

        var  currentDate = Date.now();
        const oneMonthAhead = getOneMonthAhead(currentDate);

        console.log('Current date:', currentDate);
        console.log('One month ahead:', oneMonthAhead.toDateString());


        const planCredits = {
            starter: 800,
            premium: 5000,
            default: 400
        };
        const leadsCredits = planCredits[plan] || planCredits.default;

        try {
            User_Model.updateOne({ organizationId }, { $set: { plan: plan, leadsCredit: leadsCredits, planPurchaseDate: currentDate, lastPaymentMadeDate: currentDate, nextPaymentDate: oneMonthAhead, 
                accountStatus: 1 }})
                .then(async (data) => {
                    const newUserTransaction = new UserTransactions_Model({
                        email,
                        organizationId,
                        plan,
                        channel: "PayPal",
                        paymentType: "Plan Subscribed",
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

const successRazorPay2 = async (req, res) => {
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

        var  currentDate = Date.now();
        const oneMonthAhead = getOneMonthAhead(currentDate);

        console.log('Current date:', currentDate);
        console.log('One month ahead:', oneMonthAhead.toDateString());
        console.log('Plan Renew', email, plan);

        const planCredits = {
            starter: 800,
            premium: 5000,
            default: 400
        };
        const leadsCredits = planCredits[plan] || planCredits.default;

        try {
            User_Model.updateOne({ organizationId }, { $set: { lastPaymentMadeDate: currentDate, leadsCredit: leadsCredits, nextPaymentDate: oneMonthAhead, 
                accountStatus: 1 }})
                .then(async (data) => {
                    const newUserTransaction = new UserTransactions_Model({
                        email,
                        organizationId,
                        plan,
                        channel: "PayPal",
                        paymentType: "Plan Renew",
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
        const { organizationId, reason } = req.params;

        // Validate organizationId
        if (!organizationId) {
            return res.status(400).json({ status: false, error: "No OrgId" });
        }

        // Find the user document
        const result = await User_Model.findOne({ organizationId: organizationId });

        if (!result) {
            return res.status(404).json({ status: false, error: "User not found" });
        }

        if (reason === "1") {
            return res.json({ status: true, data: result.accountStatus });
        } else {
            return res.json({ 
                status: true, 
                data: {
                    accountStatus: result.accountStatus,
                    plan: result.premium,
                }
            });
        }

    } catch (error) {
        console.error('Error in getUserAccountStatus:', error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};

const getUserHistoryTransaction = async (req, res) => {
    try {
        const { organizationId } = req.params; // Assuming organizationId is passed as a route parameter
        // Validate organizationId
        if (!organizationId) {
            res.status(400).send({ error: "No OrgId" });
        }

        // Find the user document and select only the accountStatus field
        const result = await UserTransactions_Model.find(
            { organizationId: organizationId },
            // { accountStatus: 1, _id: 0 } // 1 means include, 0 means exclude
        ).sort({ createdAt: -1 });

        if (!result) {
            res.status(400).send({ error: "User not found" });
        }

        res.json({ status: true, data: result });
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
    getUserAccountStatus,
    successRazorPay2,
    getUserHistoryTransaction
}