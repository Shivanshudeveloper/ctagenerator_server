
const fs = require('fs');
const path = require('path');

const sendEmailAzure = require("../../lib/azure_email").sendEmail;

const templatePath = path.join(__dirname, '../../templates/signup/verification_template1.html');
const verification_template1 = fs.readFileSync(templatePath, 'utf8');



// Add organization users
const sendVerificationEmail = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        verification_link: submitrequest?.verification_link,
        appname: submitrequest?.appname,
        email_to: submitrequest?.email_to
    }

    const response = await sendEmailAzure("Verification Email", verification_template1, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

module.exports = {
    sendVerificationEmail
}