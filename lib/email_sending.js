const nodemailer = require('nodemailer');
const EmailSendingMailbox_Model = require("../models/EmailSendingMailbox");

const sendEmailSendingImap = async (mailBox, prospectEmail, emailBody, subjectName) => {
    try {
        console.log(`Starting email sending process to ${prospectEmail} using mailbox ${mailBox}`);
        
        // Find mailbox configuration
        const existingMailbox = await EmailSendingMailbox_Model.findOne({
            mailBoxType: "IMAP_SMTP",
            mailBox
        });

        if (!existingMailbox) {
            console.error(`Mailbox configuration not found for ${mailBox}`);
            return { 
                success: false, 
                error: "Mailbox configuration not found",
                details: `No configuration found for ${mailBox}`
            };
        }

        console.log(`Found mailbox configuration for ${mailBox}`);

        // Extract SMTP configuration
        const smtpConfig = existingMailbox.mailBoxConfig.smtp;
        if (!smtpConfig) {
            console.error('SMTP configuration missing in mailbox settings');
            return { 
                success: false, 
                error: "SMTP configuration missing",
                details: `No SMTP config found for ${mailBox}`
            };
        }

        // Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: smtpConfig.server,
            port: smtpConfig.port,
            secure: smtpConfig.security === 'SSL/TLS', // true for 465, false for other ports
            requireTLS: smtpConfig.security === 'STARTTLS',
            auth: {
                user: smtpConfig.username,
                pass: smtpConfig.password
            },
            tls: {
                // Allow self-signed certificates
                rejectUnauthorized: false
            }
        });

        console.log('SMTP transporter created successfully');

        // Verify connection configuration
        try {
            await transporter.verify();
            console.log('SMTP connection verified successfully');
        } catch (verifyError) {
            console.error('SMTP connection verification failed:', verifyError);
            return {
                success: false,
                error: "SMTP connection failed",
                details: verifyError.message
            };
        }

        // Configure email options
        const mailOptions = {
            from: `"${existingMailbox.mailBoxConfig.name}" <${mailBox}>`,
            to: prospectEmail,
            subject: subjectName,
            html: emailBody,
            headers: {
                'X-Mailer': 'NodeMailer',
                'X-Organization-ID': existingMailbox.organizationId
            }
        };

        console.log(`Sending email to ${prospectEmail} with subject "${subjectName}"`);

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`Email successfully sent to ${prospectEmail}, Message ID: ${info.messageId}`);
        
        return {
            success: true,
            data: {
                messageId: info.messageId,
                response: info.response,
                envelope: info.envelope
            }
        };

    } catch (error) {
        console.error(`Error sending email to ${prospectEmail}:`, error);
        return {
            success: false,
            error: "Email sending failed",
            details: error.message,
            stack: error.stack
        };
    }
};

module.exports = {
    default: { sendEmailSendingImap }
};