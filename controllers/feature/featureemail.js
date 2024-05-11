const fs = require('fs');
const path = require('path');

const sendEmailAzure = require("../../lib/azure_email").sendEmail;

const templatePath1 = path.join(__dirname, '../../templates/feature/feature_template1.html');
const templatePath2 = path.join(__dirname, '../../templates/feature/feature_template2.html');
const templatePath3 = path.join(__dirname, '../../templates/feature/feature_template3.html');
const templatePath4 = path.join(__dirname, '../../templates/feature/feature_template4.html');
const templatePath5 = path.join(__dirname, '../../templates/feature/feature_template5.html');
const templatePath6 = path.join(__dirname, '../../templates/feature/feature_template6.html');
const templatePath7 = path.join(__dirname, '../../templates/feature/feature_template7.html');
const templatePath8 = path.join(__dirname, '../../templates/feature/feature_template8.html');
const templatePath9 = path.join(__dirname, '../../templates/feature/feature_template9.html');
const templatePath10 = path.join(__dirname, '../../templates/feature/feature_template10.html');
const templatePath11 = path.join(__dirname, '../../templates/feature/feature_template11.html');
const templatePath12 = path.join(__dirname, '../../templates/feature/feature_template12.html');
const templatePath13 = path.join(__dirname, '../../templates/feature/feature_template13.html');
const templatePath14 = path.join(__dirname, '../../templates/feature/feature_template14.html');
const templatePath15 = path.join(__dirname, '../../templates/feature/feature_template15.html');
const templatePath16 = path.join(__dirname, '../../templates/feature/feature_template16.html');
const templatePath17 = path.join(__dirname, '../../templates/feature/feature_template17.html');
const templatePath18 = path.join(__dirname, '../../templates/feature/feature_template18.html');
const templatePath19 = path.join(__dirname, '../../templates/feature/feature_template19.html');
const templatePath20 = path.join(__dirname, '../../templates/feature/feature_template20.html');
const templatePath21 = path.join(__dirname, '../../templates/feature/feature_template21.html');
const templatePath22 = path.join(__dirname, '../../templates/feature/feature_template22.html');
const templatePath23 = path.join(__dirname, '../../templates/feature/feature_template23.html');
const templatePath24 = path.join(__dirname, '../../templates/feature/feature_template24.html');
const templatePath25 = path.join(__dirname, '../../templates/feature/feature_template25.html');
const templatePath26 = path.join(__dirname, '../../templates/feature/feature_template26.html');
const templatePath27 = path.join(__dirname, '../../templates/feature/feature_template27.html');
const templatePath28 = path.join(__dirname, '../../templates/feature/feature_template28.html');
const templatePath29 = path.join(__dirname, '../../templates/feature/feature_template29.html');
const templatePath30 = path.join(__dirname, '../../templates/feature/feature_template30.html');
const templatePath31 = path.join(__dirname, '../../templates/feature/feature_template31.html');
const templatePath32 = path.join(__dirname, '../../templates/feature/feature_template32.html');
const templatePath33 = path.join(__dirname, '../../templates/feature/feature_template33.html');
const templatePath34 = path.join(__dirname, '../../templates/feature/feature_template34.html');
const templatePath35 = path.join(__dirname, '../../templates/feature/feature_template35.html');
const templatePath36 = path.join(__dirname, '../../templates/feature/feature_template36.html');
const templatePath37 = path.join(__dirname, '../../templates/feature/feature_template37.html');
const templatePath38 = path.join(__dirname, '../../templates/feature/feature_template38.html');
const templatePath39 = path.join(__dirname, '../../templates/feature/feature_template39.html');
const templatePath40 = path.join(__dirname, '../../templates/feature/feature_template40.html');
const templatePath41 = path.join(__dirname, '../../templates/feature/feature_template41.html');
const templatePath42 = path.join(__dirname, '../../templates/feature/feature_template42.html');
const templatePath43 = path.join(__dirname, '../../templates/feature/feature_template43.html');
const templatePath44 = path.join(__dirname, '../../templates/feature/feature_template44.html');
const templatePath45 = path.join(__dirname, '../../templates/feature/feature_template45.html');
const templatePath46 = path.join(__dirname, '../../templates/feature/feature_template46.html');
const templatePath47 = path.join(__dirname, '../../templates/feature/feature_template47.html');
const templatePath48 = path.join(__dirname, '../../templates/feature/feature_template48.html');
const templatePath49 = path.join(__dirname, '../../templates/feature/feature_template49.html');
const templatePath50 = path.join(__dirname, '../../templates/feature/feature_template50.html');
const templatePath51 = path.join(__dirname, '../../templates/feature/feature_template51.html');
const feature_template1 = fs.readFileSync(templatePath1, 'utf8');
const feature_template2 = fs.readFileSync(templatePath2, 'utf8');
const feature_template3 = fs.readFileSync(templatePath3, 'utf8');
const feature_template4 = fs.readFileSync(templatePath4, 'utf8');
const feature_template5 = fs.readFileSync(templatePath5, 'utf8');
const feature_template6 = fs.readFileSync(templatePath6, 'utf8');
const feature_template7 = fs.readFileSync(templatePath7, 'utf8');
const feature_template8 = fs.readFileSync(templatePath8, 'utf8');
const feature_template9 = fs.readFileSync(templatePath9, 'utf8');
const feature_template10 = fs.readFileSync(templatePath10, 'utf8');
const feature_template11 = fs.readFileSync(templatePath11, 'utf8');
const feature_template12 = fs.readFileSync(templatePath12, 'utf8');
const feature_template13 = fs.readFileSync(templatePath13, 'utf8');
const feature_template14 = fs.readFileSync(templatePath14, 'utf8');
const feature_template15 = fs.readFileSync(templatePath15, 'utf8');
const feature_template16 = fs.readFileSync(templatePath16, 'utf8');
const feature_template17 = fs.readFileSync(templatePath17, 'utf8');
const feature_template18 = fs.readFileSync(templatePath18, 'utf8');
const feature_template19 = fs.readFileSync(templatePath19, 'utf8');
const feature_template20 = fs.readFileSync(templatePath20, 'utf8');
const feature_template21 = fs.readFileSync(templatePath21, 'utf8');
const feature_template22 = fs.readFileSync(templatePath22, 'utf8');
const feature_template23 = fs.readFileSync(templatePath23, 'utf8');
const feature_template24 = fs.readFileSync(templatePath24, 'utf8');
const feature_template25 = fs.readFileSync(templatePath25, 'utf8');
const feature_template26 = fs.readFileSync(templatePath26, 'utf8');
const feature_template27 = fs.readFileSync(templatePath27, 'utf8');
const feature_template28 = fs.readFileSync(templatePath28, 'utf8');
const feature_template29 = fs.readFileSync(templatePath29, 'utf8');
const feature_template30 = fs.readFileSync(templatePath30, 'utf8');
const feature_template31 = fs.readFileSync(templatePath31, 'utf8');
const feature_template32 = fs.readFileSync(templatePath32, 'utf8');
const feature_template33 = fs.readFileSync(templatePath33, 'utf8');
const feature_template34 = fs.readFileSync(templatePath34, 'utf8');
const feature_template35 = fs.readFileSync(templatePath35, 'utf8');
const feature_template36 = fs.readFileSync(templatePath36, 'utf8');
const feature_template37 = fs.readFileSync(templatePath37, 'utf8');
const feature_template38 = fs.readFileSync(templatePath38, 'utf8');
const feature_template39 = fs.readFileSync(templatePath39, 'utf8');
const feature_template40 = fs.readFileSync(templatePath40, 'utf8');
const feature_template41 = fs.readFileSync(templatePath41, 'utf8');
const feature_template42 = fs.readFileSync(templatePath42, 'utf8');
const feature_template43 = fs.readFileSync(templatePath43, 'utf8');
const feature_template44 = fs.readFileSync(templatePath44, 'utf8');
const feature_template45 = fs.readFileSync(templatePath45, 'utf8');
const feature_template46 = fs.readFileSync(templatePath46, 'utf8');
const feature_template47 = fs.readFileSync(templatePath47, 'utf8');
const feature_template48 = fs.readFileSync(templatePath48, 'utf8');
const feature_template49 = fs.readFileSync(templatePath49, 'utf8');
const feature_template50 = fs.readFileSync(templatePath50, 'utf8');
const feature_template51 = fs.readFileSync(templatePath51, 'utf8');

// Add organization users
const sendFeatureEmail1 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template1, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail2 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template2, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail3 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template3, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail4 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template4, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail5 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template5, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail6 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template6, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail7 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template7, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail8 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template8, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail9 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template9, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail10 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template10, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail11 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template11, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail12 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template12, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail13 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template13, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail14 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template14, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail15 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template15, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail16 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template16, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail17 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template17, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail18 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template18, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail19 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template19, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail20 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template20, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail21 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template21, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail22 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template22, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail23 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template23, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail24 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template24, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail25 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template25, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail26 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template26, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail27 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template27, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail28 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template28, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail29 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template29, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail30 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template30, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail31 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template31, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail32 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template32, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail33 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template33, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail34 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template34, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail35 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template35, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail36 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template36, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail37 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template37, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail38 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template38, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail39 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template39, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail40 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template40, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail41 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template41, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail42 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template42, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail43 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template43, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail44 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template44, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail45 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template45, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail46 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template46, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail47 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template47, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail48 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template48, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail49 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template49, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail50 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template50, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}
const sendFeatureEmail51 = async (req, res) => {
    var error = false;
    res.setHeader("Content-Type", "application/json");
    
    const submitrequest = req.body;

    const config = {
        verification_link: submitrequest?.verification_link,
        email_to: submitrequest?.email_to,
        username: submitrequest?.username,
        appname: submitrequest?.appname,
        appurl: submitrequest?.appurl,
        agentname: submitrequest?.agentname,
        agenttitle: submitrequest?.agenttitle,
        email_to: submitrequest?.email_to
        
    }

    const response = await sendEmailAzure("Verification Email", feature_template51, config);
    if (response.status === "Succeeded") {
        res.status(200).json({ status: true, data: response });
    } else {
        res.status(400).json({ status: true, data: response });
    }

}

module.exports = {
    sendFeatureEmail1,
    sendFeatureEmail2,
    sendFeatureEmail3,
    sendFeatureEmail4,
    sendFeatureEmail5,
    sendFeatureEmail6,
    sendFeatureEmail7,
    sendFeatureEmail8,
    sendFeatureEmail9,
    sendFeatureEmail10,
    sendFeatureEmail11,
    sendFeatureEmail12,
    sendFeatureEmail13,
    sendFeatureEmail14,
    sendFeatureEmail15,
    sendFeatureEmail16,
    sendFeatureEmail17,
    sendFeatureEmail18,
    sendFeatureEmail19,
    sendFeatureEmail20,
    sendFeatureEmail21,
    sendFeatureEmail22,
    sendFeatureEmail23,
    sendFeatureEmail24,
    sendFeatureEmail25,
    sendFeatureEmail26,
    sendFeatureEmail27,
    sendFeatureEmail28,
    sendFeatureEmail29,
    sendFeatureEmail30,
    sendFeatureEmail31,
    sendFeatureEmail32,
    sendFeatureEmail33,
    sendFeatureEmail34,
    sendFeatureEmail35,
    sendFeatureEmail36,
    sendFeatureEmail37,
    sendFeatureEmail38,
    sendFeatureEmail39,
    sendFeatureEmail40,
    sendFeatureEmail41,
    sendFeatureEmail42,
    sendFeatureEmail43,
    sendFeatureEmail44,
    sendFeatureEmail45,
    sendFeatureEmail46,
    sendFeatureEmail47,
    sendFeatureEmail48,
    sendFeatureEmail49,
    sendFeatureEmail50,
    sendFeatureEmail51,
}