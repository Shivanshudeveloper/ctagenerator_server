const jwt = require('jsonwebtoken');

const User_Model = require('../models/User');
const Cta_Model = require("../models/Cta");
const { USER_PLANS } = require('../config/config');

const SECRET_KEY = process.env.SECRET_KEY;

function findPlan(planName) {
  const lowercasePlanName = planName.toLowerCase();
  return USER_PLANS.find(plan => plan.plan.toLowerCase() === lowercasePlanName) || null;
}

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid' });
        }

        req.user = user;
        next();
    });
};

// Middleware to validate API key
const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.headers['api-key'];
    console.log(`Checking API Key: ${apiKey}`);
  
    if (!apiKey) {
      return res.status(403).json({ error: 'No API Key Found' });
    }
  
    try {
      const user = await User_Model.findOne({ apiKey });
      if (!user) {
        return res.status(403).json({ error: 'Invalid API Key' });
      }
  
      // Attach user information to the request for later use
      req.user = user;
      next();
    } catch (error) {
      res.status(500).send('Internal server error');
    }
};

// Middleware for total CTA limit
const authenticateUserLimit = async (req, res, next) => {
  const submitrequest = req.body;

  try {

    User_Model.findOne({ organizationId: submitrequest?.organizationId })
        .then(async (data) => {
            console.log(data, findPlan(data?.plan));
            const userLimit = findPlan(data?.plan);

            const activeCtaCount = await Cta_Model.countDocuments({
              organizationId: submitrequest?.organizationId,
              status: 1
            });

            console.log(userLimit?.limit, activeCtaCount);

            if ( userLimit?.limit >  activeCtaCount ) {
              next();
            } else {
              return res.status(403).json({ error: 'Please upgrade your plan or contact customer support' });
            }

        })
        .catch((err) => console.log(err));



  } catch (error) {
    res.status(500).send('Internal server error');
  }
};


// Middleware for total Leads Credit limit
const authenticateUserLeadsCreditLimit = async (req, res, next) => {
  const submitrequest = req.body;

  try {
    User_Model.findOne({ organizationId: submitrequest?.organizationId })
        .then(async (data) => {

            if ( data?.leadsCredit >  0 ) {
              next();
            } else {
              return res.status(403).json({ error: 'Please upgrade your plan or contact customer support' });
            }
        })
        .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};


// Middleware for total Leads Credit limit
const authenticateUserEngagementCreditLimit = async (req, res, next) => {
  const submitrequest = req.body;

  try {
    User_Model.findOne({ organizationId: submitrequest?.organizationId })
        .then(async (data) => {

            if ( data?.leadsCredit >  0 ) {
              next();
            } else {
              return res.status(403).json({ error: 'Please upgrade your plan or contact customer support' });
            }
        })
        .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = {
    validateToken,
    authenticateApiKey,
    authenticateUserLimit,
    authenticateUserLeadsCreditLimit,
    authenticateUserEngagementCreditLimit
}