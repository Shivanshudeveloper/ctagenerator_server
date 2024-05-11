const fs = require('fs');
const path = require('path');

const sendEmailAzure = require("../../lib/azure_email").welcomeSendEmail;

const templatePath = path.join(__dirname, '../../templates/welcome/welcome_template1.html');
const templatePath2 = path.join(__dirname, '../../templates/welcome/welcome_template2.html');
const templatePath3 = path.join(__dirname, '../../templates/welcome/welcome_template3.html');
const templatePath4 = path.join(__dirname, '../../templates/welcome/welcome_template4.html');
const templatePath5 = path.join(__dirname, '../../templates/welcome/welcome_template5.html');
const templatePath6 = path.join(__dirname, '../../templates/welcome/welcome_template6.html');
const templatePath7 = path.join(__dirname, '../../templates/welcome/welcome_template7.html');
const templatePath8 = path.join(__dirname, '../../templates/welcome/welcome_template8.html');
const templatePath9 = path.join(__dirname, '../../templates/welcome/welcome_template9.html');
const templatePath10 = path.join(__dirname, '../../templates/welcome/welcome_template10.html');
const templatePath11 = path.join(__dirname, '../../templates/welcome/welcome_template11.html');
const templatePath12 = path.join(__dirname, '../../templates/welcome/welcome_template12.html');
const templatePath13 = path.join(__dirname, '../../templates/welcome/welcome_template13.html');
const templatePath14 = path.join(__dirname, '../../templates/welcome/welcome_template14.html');
const templatePath15 = path.join(__dirname, '../../templates/welcome/welcome_template15.html');
const templatePath16 = path.join(__dirname, '../../templates/welcome/welcome_template16.html');
const templatePath17 = path.join(__dirname, '../../templates/welcome/welcome_template17.html');
const templatePath18 = path.join(__dirname, '../../templates/welcome/welcome_template18.html');
const templatePath19 = path.join(__dirname, '../../templates/welcome/welcome_template19.html');
const templatePath20 = path.join(__dirname, '../../templates/welcome/welcome_template20.html');
const templatePath21 = path.join(__dirname, '../../templates/welcome/welcome_template21.html');
const templatePath22 = path.join(__dirname, '../../templates/welcome/welcome_template22.html');
const templatePath23 = path.join(__dirname, '../../templates/welcome/welcome_template23.html');
const templatePath24 = path.join(__dirname, '../../templates/welcome/welcome_template24.html');
const templatePath25 = path.join(__dirname, '../../templates/welcome/welcome_template25.html');
const templatePath26 = path.join(__dirname, '../../templates/welcome/welcome_template26.html');
const templatePath27 = path.join(__dirname, '../../templates/welcome/welcome_template27.html');
const templatePath28 = path.join(__dirname, '../../templates/welcome/welcome_template28.html');
const templatePath29 = path.join(__dirname, '../../templates/welcome/welcome_template29.html');
const welcome_template1 = fs.readFileSync(templatePath, 'utf8');
const welcome_template2 = fs.readFileSync(templatePath2, 'utf8');
const welcome_template3 = fs.readFileSync(templatePath3, 'utf8');
const welcome_template4 = fs.readFileSync(templatePath4, 'utf8');
const welcome_template5 = fs.readFileSync(templatePath5, 'utf8');
const welcome_template6 = fs.readFileSync(templatePath6, 'utf8');
const welcome_template7 = fs.readFileSync(templatePath7, 'utf8');
const welcome_template8 = fs.readFileSync(templatePath8, 'utf8');
const welcome_template9 = fs.readFileSync(templatePath9, 'utf8');
const welcome_template10 = fs.readFileSync(templatePath10, 'utf8');
const welcome_template11 = fs.readFileSync(templatePath11, 'utf8');
const welcome_template12 = fs.readFileSync(templatePath12, 'utf8');
const welcome_template13 = fs.readFileSync(templatePath13, 'utf8');
const welcome_template14 = fs.readFileSync(templatePath14, 'utf8');
const welcome_template15 = fs.readFileSync(templatePath15, 'utf8');
const welcome_template16 = fs.readFileSync(templatePath16, 'utf8');
const welcome_template17 = fs.readFileSync(templatePath17, 'utf8');
const welcome_template18 = fs.readFileSync(templatePath18, 'utf8');
const welcome_template19 = fs.readFileSync(templatePath19, 'utf8');
const welcome_template20 = fs.readFileSync(templatePath20, 'utf8');
const welcome_template21 = fs.readFileSync(templatePath21, 'utf8');
const welcome_template22 = fs.readFileSync(templatePath22, 'utf8');
const welcome_template23 = fs.readFileSync(templatePath23, 'utf8');
const welcome_template24 = fs.readFileSync(templatePath24, 'utf8');
const welcome_template25 = fs.readFileSync(templatePath25, 'utf8');
const welcome_template26 = fs.readFileSync(templatePath26, 'utf8');
const welcome_template27 = fs.readFileSync(templatePath27, 'utf8');
const welcome_template28 = fs.readFileSync(templatePath28, 'utf8');
const welcome_template29 = fs.readFileSync(templatePath29, 'utf8');



// Add organization users
const sendWelcomeEmail_template1 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template1, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template2 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template2, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template3 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template3, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template4 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template4, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template5 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template5, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template6 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template6, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template7 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template7, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template8 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template8, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template9 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template9, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template10 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template10, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template11 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template11, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template12 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template12, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template13 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template13, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template14 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template14, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template15 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template15, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendWelcomeEmail_template16 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template16, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template17 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template17, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template18 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template18, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template19 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template19, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template20 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template20, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template21 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template21, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template22 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template22, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template23 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template23, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template24 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template24, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template25 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template25, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template26 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template26, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template27 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template27, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template28 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template28, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

const sendWelcomeEmail_template29 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to,
        email_from: submitrequest?.email_from
    }

    const response = await sendEmailAzure("Welcome Email", welcome_template29, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

module.exports = {
    sendWelcomeEmail_template1,
    sendWelcomeEmail_template2,
    sendWelcomeEmail_template3,
    sendWelcomeEmail_template4,
    sendWelcomeEmail_template5,
    sendWelcomeEmail_template6,
    sendWelcomeEmail_template7,
    sendWelcomeEmail_template8,
    sendWelcomeEmail_template9,
    sendWelcomeEmail_template10,
    sendWelcomeEmail_template11,
    sendWelcomeEmail_template12,
    sendWelcomeEmail_template13,
    sendWelcomeEmail_template14,
    sendWelcomeEmail_template15,
    sendWelcomeEmail_template16,
    sendWelcomeEmail_template17,
    sendWelcomeEmail_template18,
    sendWelcomeEmail_template19,
    sendWelcomeEmail_template20,
    sendWelcomeEmail_template21,
    sendWelcomeEmail_template22,
    sendWelcomeEmail_template23,
    sendWelcomeEmail_template24,
    sendWelcomeEmail_template25,
    sendWelcomeEmail_template26,
    sendWelcomeEmail_template27,
    sendWelcomeEmail_template28,
    sendWelcomeEmail_template29,
}