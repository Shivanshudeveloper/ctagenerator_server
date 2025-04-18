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


// Helper function outside of the main controller
function getErrorSource(error) {
    if (error.code) {
      if (error.code.startsWith('EAUTH')) return 'SMTP Authentication';
      if (error.code === 'ECONNECTION') return 'SMTP Connection';
      if (error.code === 'ETIMEDOUT') return 'IMAP Connection Timeout';
    }
    if (error.source === 'timeout') return 'IMAP Connection Timeout';
    if (error.message.includes('IMAP')) return 'IMAP Configuration';
    if (error.message.includes('SMTP')) return 'SMTP Configuration';
    return 'Unknown';
}
  
// const imapMailboxTestingConnection = async (req, res) => {
//       const { formData, organizationId, agentUid, userEmail, listName } = req.body;
//       const { imap, smtp, name } = formData;
//       const testEmailId = uuidv4();
  
//       try {
//           // Existing mailbox check
//           const existingMailbox = await EmailSendingMailbox_Model.findOne({
//               organizationId,
//               mailBox: name,
//               listName
//           });
  
//           if (existingMailbox) {
//               return res.status(400).json({
//                   success: false,
//                   message: 'Mailbox already exists',
//                   details: {}
//               });
//           }
  
//           // Validation checks
//           if (!smtp?.server || !smtp?.port || !imap?.server || !imap?.port) {
//               throw new Error('Both SMTP and IMAP server configurations are required');
//           }
  
//           if (!smtp.username || !smtp.password || !imap.username || !imap.password) {
//               throw new Error('Both SMTP and IMAP credentials are required');
//           }
  
//           // SMTP Verification
//           const transporter = nodemailer.createTransport({
//               host: smtp.server,
//               port: smtp.port,
//               secure: smtp.security === 'SSL/TLS',
//               auth: { user: smtp.username, pass: smtp.password },
//               tls: { rejectUnauthorized: false },
//               requireTLS: smtp.security === 'STARTTLS'
//           });
  
//           const info = await transporter.sendMail({
//               from: "james.smith@idatavox.com",
//               to: "consultwithshiv@gmail.com",
//               subject: `Test Email - ${testEmailId}`,
//               text: `Connection Test - ${testEmailId}`,
//               html: `<p>Connection Test - <strong>${testEmailId}</strong></p>`
//           });
  
//           // IMAP Verification with timeout handling
//           const imapConnection = new Imap({
//               user: imap.username,
//               password: imap.password,
//               host: imap.server,
//               port: imap.port,
//               tls: { rejectUnauthorized: false },
//               secure: imap.security === 'SSL/TLS',
//               autotls: imap.security === 'STARTTLS' ? 'always' : 'never',
//               connTimeout: 15000 // 15 seconds timeout
//           });
  
//           await new Promise((resolve, reject) => {
//               const timer = setTimeout(() => {
//                   imapConnection.end();
//                   reject(new Error('IMAP connection timed out'));
//               }, 15000);
  
//               imapConnection.once('ready', () => {
//                   clearTimeout(timer);
//                   imapConnection.end();
//                   resolve();
//               });
  
//               imapConnection.once('error', (err) => {
//                   clearTimeout(timer);
//                   imapConnection.end();
//                   reject(err);
//               });
  
//               imapConnection.connect();
//           });
  
//           // Save configuration
//           const newMailbox = new EmailSendingMailbox_Model({
//               organizationId,
//               userEmail,
//               mailBox: name,
//               listName,
//               mailBoxConfig: formData,
//               mailBoxType: "IMAP_SMTP"
//           });
//           await newMailbox.save();
  
//           res.json({
//               success: true,
//               message: 'Both SMTP and IMAP configurations verified successfully',
//               testId: testEmailId,
//               messageId: info.messageId,
//               mailboxName: name,
//               organizationId,
//               agentUid
//           });
  
//       } catch (error) {
//           console.error('Configuration Test Error:', error);
//           res.status(400).json({
//               success: false,
//               message: error.message,
//               details: {
//                   testId: testEmailId,
//                   smtpServer: smtp?.server,
//                   smtpPort: smtp?.port,
//                   imapServer: imap?.server,
//                   imapPort: imap?.port,
//                   errorCode: error.code || 'ECONN',
//                   errorSource: getErrorSource(error),
//                   suggestedFix: getSuggestedFix(error)
//               }
//           });
//       }
// };
  


const imapMailboxTestingConnection = async (req, res) => {
    const { formData, organizationId, agentUid, userEmail, listName } = req.body;
    const { imap, smtp, name } = formData;
    const testEmailId = uuidv4();
  
    try {
      // Existing mailbox check
      const existingMailbox = await EmailSendingMailbox_Model.findOne({
        organizationId,
        mailBox: name,
        listName
      });
  
      if (existingMailbox) {
        return res.status(400).json({
          success: false,
          message: 'Mailbox already exists',
          details: {}
        });
      }
  
      // Validation checks
      if (!smtp?.server || !smtp?.port || !imap?.server || !imap?.port) {
        throw new Error('Both SMTP and IMAP server configurations are required');
      }
  
      if (!smtp.username || !smtp.password || !imap.username || !imap.password) {
        throw new Error('Both SMTP and IMAP credentials are required');
      }
  
      // SMTP Verification
      // For SMTP (Out) details: mail.tophost.it on port 587.
      const transporter = nodemailer.createTransport({
        host: smtp.server,
        port: smtp.port,
        secure: false, // Use STARTTLS if available
        auth: { user: smtp.username, pass: smtp.password },
        tls: { rejectUnauthorized: false } // Disable certificate validation
      });
  
      const info = await transporter.sendMail({
        from: name,
        to: "consultwithshiv@gmail.com",
        subject: `Test Email - ${testEmailId}`,
        text: `Connection Test - ${testEmailId}`,
        html: `<p>Connection Test - <strong>${testEmailId}</strong></p>`
      });
  
      // IMAP Verification with timeout handling
      // For plain IMAP, ensure you're using port 143 and disable TLS.
      
      // const imapConnection = new Imap({
      //   user: imap.username,
      //   password: imap.password,
      //   host: imap.server,
      //   port: Number(imap.port), // Should be 143 for non-SSL connections
      //   tls: false, // Disable TLS
      //   connTimeout: 15000 // 15 seconds timeout
      // });
  
      // await new Promise((resolve, reject) => {
      //   const timer = setTimeout(() => {
      //     imapConnection.end();
      //     reject(new Error('IMAP connection timed out'));
      //   }, 15000);
  
      //   imapConnection.once('ready', () => {
      //     clearTimeout(timer);
      //     imapConnection.end();
      //     resolve();
      //   });
  
      //   imapConnection.once('error', (err) => {
      //     clearTimeout(timer);
      //     imapConnection.end();
      //     reject(err);
      //   });
  
      //   imapConnection.connect();
      // });
  
      // Save configuration
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
        message: 'Both SMTP and IMAP configurations verified successfully',
        testId: testEmailId,
        messageId: info.messageId,
        mailboxName: name,
        organizationId,
        agentUid
      });
  
    } catch (error) {
      console.error('Configuration Test Error:', error);
      res.status(400).json({
        success: false,
        message: error.message,
        details: {
          testId: testEmailId,
          smtpServer: smtp?.server,
          smtpPort: smtp?.port,
          imapServer: imap?.server,
          imapPort: imap?.port,
          errorCode: error.code || 'ECONN',
          errorSource: getErrorSource(error),
          suggestedFix: getSuggestedFix(error)
        }
      });
    }
};


function getSuggestedFix(error) {
    if (error.message.includes('IMAP connection timed out')) {
      return [
        'Check IMAP server address and port',
        'Verify network connectivity',
        'Ensure IMAP service is enabled on the server'
      ].join(', ');
    }
    
    if (error.code === 'EAUTH') {
      return 'Verify SMTP username/password and ensure "Less Secure Apps" is enabled if required';
    }
  
    return 'Check server configurations and credentials';
}




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