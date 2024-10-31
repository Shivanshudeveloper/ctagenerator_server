const {Resend} = require('resend');
const resendKey = process.env.RESEND_API_KEY
const {APP_MAIN_URL} = require('../config/config')


const sendEmail = async (fullName, emailSendTo,ctaPublicId,ctaType) => {
    const resend = new Resend(resendKey);
    console.log(emailSendTo);
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_SENDER_EMAIL,
        to: [emailSendTo],
        subject: 'Testing Email',
        html: `
        <html dir="ltr" lang="en">

            <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                <meta name="x-apple-disable-message-reformatting" />
            </head>
            <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Dropbox reset your password<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
            </div>

            <body style="background-color:#f6f9fc;padding:10px 0">
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
                <tbody>
                    <tr style="width:100%">
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                            <tr>
                            <td>
                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Hi <!-- -->${fullName}<!-- -->,</p>
                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">The CTA you were looking for has been Resumed. Click <a href="${APP_URL}/${ctaType}/${ctaPublicId}" style="color:#067df7;text-decoration:underline" target="_blank">here</a> to visit CTA:</p><a href="${APP_URL}/${ctaType}/${ctaPublicId}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#007ee6;border-radius:4px;color:#fff;font-family:&#x27;Open Sans&#x27;, &#x27;Helvetica Neue&#x27;, Arial;font-size:15px;text-align:center;width:210px;padding:14px 7px 14px 7px" target="_blank"><span></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:10.5px">View CTA</span></a>
                                </p>
                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Thank You!</p>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
            </body>

            </html>
        `,
    });

    if (error) {
        return console.error({ error });
    }

    console.log(data);
    return {success:true, data};
}


const sendEmailPlanSubscription = async (email, packagePlan) => {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_SENDER_EMAIL,
        to: email,
        subject: 'Subscription Confirmation - Seenfunnel',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px 0;
                        color: #333333;
                        line-height: 1.6;
                    }
                    .content p {
                        margin: 10px 0;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #e0e0e0;
                        color: #777777;
                        font-size: 12px;
                    }
                    .button {
                        display: inline-block;
                        margin: 20px 0;
                        font-weight: bold;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://res.cloudinary.com/daboha8rt/image/upload/v1729882072/cta/kfk9znfznyoa53t8olxr.png" alt="Seenfunnel Logo">
                    </div>
                    <div class="content">
                        <h2>Hello,</h2>
                        <p>We are pleased to inform you that your subscription plan <strong>${packagePlan}</strong> has been successfully subscribed.</p>
                        <p>Thank you for continuing to trust Seenfunnel with your business needs. We're committed to providing you with the best service possible.</p>
                        <a href="${APP_MAIN_URL}/dashboard" class="button">Go to Dashboard</a>
                        <p>If you have any questions or need further assistance, feel free to <a href="${APP_MAIN_URL}/support">contact our support team</a>.</p>
                        <p>Best regards,<br/>The Seenfunnel Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Seenfunnel. All rights reserved.</p>
                        <p>If you no longer wish to receive these emails, you can <a href="https://seenfunnel.com/unsubscribe" style="color: #007BFF;">unsubscribe here</a>.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });

    if (error) {
        return console.error({ error });
    }

    console.log(data);
    return {success:true, data};
}

const sendEmailPlanSubscriptionRenewal = async (email, packagePlan) => {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_SENDER_EMAIL,
        to: email,
        subject: 'Subscription Renewal Confirmation - Seenfunnel',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px 0;
                        color: #333333;
                        line-height: 1.6;
                    }
                    .content p {
                        margin: 10px 0;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #e0e0e0;
                        color: #777777;
                        font-size: 12px;
                    }
                    .button {
                        display: inline-block;
                        margin: 20px 0;
                        font-weight: bold;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://res.cloudinary.com/daboha8rt/image/upload/v1729882072/cta/kfk9znfznyoa53t8olxr.png" alt="Seenfunnel Logo">
                    </div>
                    <div class="content">
                        <h2>Hello,</h2>
                        <p>We are pleased to inform you that your subscription plan <strong>${packagePlan}</strong> has been successfully renewed.</p>
                        <p>Thank you for continuing to trust Seenfunnel with your business needs. We're committed to providing you with the best service possible.</p>
                        <a href="${APP_MAIN_URL}/dashboard" class="button">Go to Dashboard</a>
                        <p>If you have any questions or need further assistance, feel free to <a href="${APP_MAIN_URL}/support">contact our support team</a>.</p>
                        <p>Best regards,<br/>The Seenfunnel Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Seenfunnel. All rights reserved.</p>
                        <p>If you no longer wish to receive these emails, you can <a href="https://seenfunnel.com/unsubscribe" style="color: #007BFF;">unsubscribe here</a>.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });

    if (error) {
        return console.error({ error });
    }

    console.log(data);
    return {success:true, data};
}


const sendOnboardingEmailResend = async (fullName, email) => {
    const resend = new Resend(resendKey);

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_SENDER_EMAIL,
        to: email,
        subject: 'Welcome to Seenfunnel! Here’s How to Get Started',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px 0;
                        color: #333333;
                        line-height: 1.6;
                    }
                    .content h2 {
                        color: #007ee6;
                    }
                    .feature-list {
                        list-style-type: disc;
                        padding-left: 20px;
                        margin-top: 20px;
                        margin-bottom: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #e0e0e0;
                        color: #777777;
                        font-size: 12px;
                    }
                    .button {
                        display: inline-block;
                        margin: 20px 0;
                        font-weight: bold;
                        text-decoration: none;
                    }
                    a {
                        color: #007BFF;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://res.cloudinary.com/daboha8rt/image/upload/v1729882072/cta/kfk9znfznyoa53t8olxr.png" alt="Seenfunnel Logo">
                    </div>
                    <div class="content">
                        <h2>Welcome, ${fullName}!</h2>
                        <p>We're thrilled to have you onboard with Seenfunnel. To help you get the most out of our platform, here are some key features you can start using today:</p>
                        <ol class="feature-list">
                            <li><strong>1. Create B2B Sales Pages:</strong> Utilize videos, AI Representatives, pictures, testimonials, and custom messages to build compelling sales pages and integrate them into your marketing campaigns.</li>
                            <li><strong>2. Add a Custom Domain:</strong> Personalize your B2B Sales Pages with your own custom domain for a professional appearance.</li>
                            <li><strong>3. Scrape Emails & Phone Numbers:</strong> Leverage our Lead Scraper to efficiently gather valuable contact information.</li>
                            <li><strong>4. Track Campaign Performance:</strong> Monitor how users interact with your content and assess the effectiveness of your marketing campaigns.</li>
                            <li><strong>5. Use AI Summaries:</strong> Gain insights into your marketing campaigns by understanding areas for improvement through AI-generated summaries.</li>
                        </ol>
                        <a href="${APP_MAIN_URL}/dashboard" class="button">Get Started Now</a>
                        <p>If you have any questions or need assistance, feel free to <a href="https://www.seefunnel.com/contact-us.html">contact our support team</a>. We're here to help!</p>
                        <p>Best regards,<br/>The Seenfunnel Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Seenfunnel. All rights reserved.</p>
                        <p>If you no longer wish to receive these emails, you can <a href="https://seenfunnel.com/unsubscribe" style="color: #007BFF;">unsubscribe here</a>.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });

    if (error) {
        return console.error({ error });
    }

    console.log(data);
    return { success: true, data };
}


module.exports = {
    default : {sendEmail, sendEmailPlanSubscription, sendEmailPlanSubscriptionRenewal, sendOnboardingEmailResend}
}