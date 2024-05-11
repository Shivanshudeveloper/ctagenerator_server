const { Resend } = require('resend');

const resendKey = process.env.RESEND_API_KEY

const sendEmail = async (fullName, emailSendTo, courseName, userId) => {
    const resend = new Resend(resendKey);
    console.log(emailSendTo);
    const { data, error } = await resend.emails.send({
        from: 'support@sortwind.com',
        to: [emailSendTo],
        subject: 'Successfully Registered for Course',
        html: `
<p>Hi, ${fullName}</p>
<p>You have successfully registered for the course ${courseName}. 
<br /><br />
Please keep this ID with your secured <strong>${userId}</strong></p>
Thank You
        `,
    });

    if (error) {
        return console.error({ error });
    }

    console.log(data);
    return { msg: 'success' }
}

module.exports = {
    sendEmail
}