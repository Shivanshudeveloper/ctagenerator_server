const {Resend} = require('resend');

const createSupportTicket = async (req, res) => {
    const { contactEmail, subject, message, mainEmail } = req.body;
    const resendKey = process.env.RESEND_API_KEY
    const resendFromEmail = process.env.RESEND_SENDER_EMAIL
    const resend = new Resend(resendKey);

    try {
        console.log(contactEmail, subject, message, mainEmail);

        const { data, error } = await resend.emails.send({
            from: resendFromEmail,
            to: "seefunnelofficials@gmail.com",
            subject: `Support Ticket from ${contactEmail}`,
            html: `
                <h5>Support Ticket</h5>
                <p>Contact Email: ${contactEmail}</p>
                <p>Subject: ${subject}</p>
                <p>Message: ${message}</p>
                <p>Main Email: ${mainEmail}</p>
            `,
        });

        if (error) {
            console.log(error);
            return res.status(500).json({ 
                message: 'Failed to create support ticket',
            });
        } else {
            console.log(data);

            return res.status(200).json({ 
                success: true,
                message: 'Support ticket created successfully',
            });
        }
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create support ticket',
            details: error.message 
        });
    }
}

module.exports = {
    createSupportTicket,
}
