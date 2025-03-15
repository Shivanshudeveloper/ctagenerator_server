const {Resend} = require('resend');
const { v4: uuidv4 } = require("uuid");
const Imap = require('imap');

const nodemailer = require('nodemailer');


const EmailSendingDomain_Model = require("../../models/EmailSendingDomain");
const EmailSendingMailbox_Model = require("../../models/EmailSendingMailbox");


const resendKey = process.env.EMAIL_SENDING_RESEND_KEY;

const addEmailSendingDomain = async (req, res) => {
    let { userEmail, organizationId, domainName } = req.body;
    
    // Check if API key is available
    if (!resendKey) {
        console.error('Missing Resend API key');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Initialize Resend client inside the function
    const resend = new Resend(resendKey);
    
    domainName = domainName.toLowerCase().trim();

    try {
        // Validate domain name format
        const domainRegex = /^([a-zA-Z0-9]-?)+(\.[a-zA-Z0-9-]+)+$/;
        if (!domainRegex.test(domainName)) {
            return res.status(400).json({ error: 'Invalid domain name format' });
        }

        const existingDomain = await EmailSendingDomain_Model.findOne({
            organizationId,
            domainName
        });

        if (existingDomain) {
            return res.status(400).json({
                error: 'Domain already exists for this organization',
                data: 'Please use a different domain name'
            });
        }

        // Create domain in Resend first to ensure it works
        console.log(`Attempting to add domain to Resend: ${domainName}`);
        const resendResponse = await resend.domains.create({ name: domainName });
        
        console.log('Resend API response:', resendResponse);
        
        // Check if the response indicates an error
        if (resendResponse.error) {
            console.error('Resend API error:', resendResponse.error);
            return res.status(400).json({ 
                error: 'Failed to add domain to email service',
                details: resendResponse.error.message || 'Unknown error'
            });
        }

        // If successful, create database entry with Resend data
        const newDomain = new EmailSendingDomain_Model({
            organizationId,
            domainName,
            userEmail,
            // Store data from Resend response
            resendDomainId: resendResponse.data.id,
            status: resendResponse.data.status,
            records: resendResponse.data.records,
            region: resendResponse.data.region
        });

        await newDomain.save();

        return res.status(200).json({
            data: 'Domain added successfully',
            domainDetails: {
                id: newDomain._id,
                domainName: newDomain.domainName,
                status: newDomain.status,
                records: newDomain.records
            }
        });

    } catch (error) {
        console.error('Error adding custom domain:', error);
        res.status(500).json({ 
            error: 'Failed to add custom domain',
            details: error.message 
        });
    }
}

// Get all the domains for the organization id
const getAllUserDomainsEmailSending = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { organizationId } = req.params;
      
    try {
      // Find the document and select only the tags field
      const result = await EmailSendingDomain_Model.find(
        { organizationId },
      ).sort({ createdAt: -1 });
  
      if (!result) {
        return res.status(200).json({ status: true, data: [] });
      }
  
      return res.status(200).json({ status: true, data: result || [] });
    } catch (error) {
      return res.status(500).json({ status: false, data: "Something went wrong" });
    }
};

const verifyDomainEmailSending = async (req, res) => {
    let { userEmail, organizationId, resendDomainId } = req.body;

    if (!resendKey) {
        console.error('Missing Resend API key');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Initialize Resend client inside the function
    const resend = new Resend(resendKey);

    try {
        // Start verification
        await resend.domains.verify(resendDomainId);

        // Retrieve the updated domain details from Resend
        const resendDomainRetrive = await resend.domains.get(resendDomainId);
        console.log('Resend Verify response:', resendDomainRetrive);

        // Update the MongoDB document with the latest data from Resend
        const updatedDomain = await EmailSendingDomain_Model.findOneAndUpdate(
            { resendDomainId: resendDomainId },
            {
                status: resendDomainRetrive.data.status,
                records: resendDomainRetrive.data.records,
                region: resendDomainRetrive.data.region,
                domainName: resendDomainRetrive.data.name,
            },
            { new: true }
        );

        return res.status(200).json({
            data: resendDomainRetrive,
            updatedRecord: updatedDomain,
        });
    } catch (error) {
        console.error('Error verifying custom domain:', error);
        res.status(500).json({
        error: 'Failed to verify custom domain',
        details: error.message,
        });
    }
};


// Add Mailbox
const addEmailSendingMailbox = async (req, res) => {
    let { userEmail, organizationId, mailBox, listName } = req.body;
    
    try {
        const existingDomain = await EmailSendingMailbox_Model.findOne({
            organizationId,
            mailBox,
            listName
        });

        if (existingDomain) {
            return res.status(400).json({
                error: 'Emails already exists for this organization',
                data: 'Please use a different email name'
            });
        }

        // If successful, create database entry with Resend data
        const newMailbox = new EmailSendingMailbox_Model({
            organizationId,
            userEmail,
            mailBox,
            listName
        });

        await newMailbox.save();

        return res.status(200).json({
            data: newMailbox,
        });

    } catch (error) {
        console.error('Error adding custom domain:', error);
        res.status(500).json({ 
            error: 'Failed to add custom domain',
            details: error.message 
        });
    }
}


// Test IMAP Mailbox
const imapMailboxTestingConnection = async (req, res) => {
    const { formData, organizationId, agentUid, userEmail, listName } = req.body;
    const { imap, smtp, name } = formData;
    const testEmailId = uuidv4();

    try {

        const expistingMailbox = await EmailSendingMailbox_Model.findOne({
            organizationId,
            mailBox: name,
            listName
        });

        if (expistingMailbox) {
            return res.status(400).json({
                success: false,
                message: 'Mailbox already exist',
                details: {}
            });
        }

        // Validate required fields
        if (!smtp?.server || !smtp?.port) {
            throw new Error('Missing SMTP server configuration');
        }

        // Validate credentials
        if (!smtp.username || !smtp.password) {
            throw new Error('SMTP credentials are required');
        }

        // Create SMTP transporter
        const transporter = nodemailer.createTransport({
            host: smtp.server,
            port: smtp.port,
            secure: smtp.security === 'SSL/TLS',
            auth: {
                user: smtp.username,
                pass: smtp.password
            },
            tls: { rejectUnauthorized: false },
            requireTLS: smtp.security === 'STARTTLS'
        });

        // Send test email
        const info = await transporter.sendMail({
            from: smtp.username,
            to: smtp.username, // Sending to self
            subject: `Test Email - ${testEmailId}`,
            text: `SMTP Connection Test - ${testEmailId}`,
            html: `<p>SMTP Connection Test - <strong>${testEmailId}</strong></p>`
        });

        // If successful, create database entry with Resend data
        const newMailbox = new EmailSendingMailbox_Model({
            organizationId,
            userEmail,
            mailBox: name,
            listName,
            mailBoxConfig: formData,
            mailBoxType: "IMAP_SMTP"
        });
        await newMailbox.save();

        res.json({
            success: true,
            message: 'Email sending test succeeded',
            testId: testEmailId,
            messageId: info.messageId,
            mailboxName: name,
            organizationId,
            agentUid
        });

    } catch (error) {
        console.error('SMTP Test Error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Email sending failed',
            details: {
                testId: testEmailId,
                smtpServer: smtp?.server,
                smtpPort: smtp?.port,
                errorCode: error.code || 'ESMTP',
                response: error.response || undefined
            }
        });
    }
};




// Get all the mailboxes for the organization id
const getAllUserMailboxEmailSending = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { organizationId, listName } = req.params;
      
    try {
      // Find the document and select only the tags field
      const result = await EmailSendingMailbox_Model.find(
        { organizationId, listName },
      ).sort({ createdAt: -1 });
  
      if (!result) {
        return res.status(200).json({ status: true, data: [] });
      }
  
      return res.status(200).json({ status: true, data: result || [] });
    } catch (error) {
      return res.status(500).json({ status: false, data: "Something went wrong" });
    }
};

// Delete the Mailbox
const deleteMailBoxEmailSending = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { organizationId, mailbox } = req.params;
      
    try {
      // Delete the document matching organizationId and mailbox
      const result = await EmailSendingMailbox_Model.deleteOne({ organizationId, mailBox: mailbox });
      return res.status(200).json({ status: true, data: result || [] });
    } catch (error) {
      return res.status(500).json({ status: false, data: "Something went wrong" });
    }
};


module.exports = {
    addEmailSendingDomain,
    getAllUserDomainsEmailSending,
    verifyDomainEmailSending,
    addEmailSendingMailbox,
    getAllUserMailboxEmailSending,
    deleteMailBoxEmailSending,
    imapMailboxTestingConnection
};