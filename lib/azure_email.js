const { EmailClient } = require("@azure/communication-email");
const handlebars = require('handlebars');

const {Resend} = require('resend');
const resendKey = process.env.RESEND_API_KEY

// const connectionString = process.env.AZURE_EMAIL_CONNECTION_STRING;
// const emailClient = new EmailClient(connectionString);

const sendEmail = async (emailSubject, body, config) => {
  // Compile the template
  const template = handlebars.compile(body);

  // Define your variables
  const variables = {
    username: config?.username,
    verification_link: config?.verification_link,
    appname: config?.appname
  };

  // Render the template with the variables
  const populatedTemplate = template(variables);

  const message = {
      senderAddress: "test@065c67a6-95e8-4948-8c11-73dcf43927a0.azurecomm.net",
      content: {
        subject: emailSubject,
        html: populatedTemplate,
      },
      recipients: {
        to: [
          {
            address: config?.email_to,
            displayName: config?.username,
          },
        ],
      },
  };
    
  const poller = await emailClient.beginSend(message);
  const response = await poller.pollUntilDone();

  return response;
}


const welcomeSendEmail = async (emailSubject, body, config) => {
  // Compile the template
  const template = handlebars.compile(body);

  // Define your variables
  const variables = {
    username: config?.username,
    appname: config?.appname,
    appurl: config?.appurl,
    agentname: config?.agentname,
    agenttitle: config?.agenttitle
  };

  // Render the template with the variables
  const populatedTemplate = template(variables);

  const message = {
      senderAddress: "test@065c67a6-95e8-4948-8c11-73dcf43927a0.azurecomm.net",
      content: {
        subject: emailSubject,
        html: populatedTemplate,
      },
      recipients: {
        to: [
          {
            address: config?.email_to,
            displayName: config?.username,
          },
        ],
      },
  };
    
  const poller = await emailClient.beginSend(message);
  const response = await poller.pollUntilDone();

  return response;
}

// const sendEmailNotification = async (campaignEvents, targetAddress, displayName) => {
//   // Validate inputs
//   if (!Array.isArray(campaignEvents) || campaignEvents.length === 0) {
//       console.log('No events to process');
//       return false;
//   }

//   if (!targetAddress) {
//       console.log('No target email address provided');
//       return false;
//   }

//   // Process each event asynchronously without waiting
//   campaignEvents.forEach(event => {
//       const emailMessage = {
//           senderAddress: "DoNotReply@ctagenerator.com",
//           content: {
//               subject: event.subject || `${event.eventType} Notification`,
//               html: event.content || `
//                   <html>
//                       <body>
//                           <h2>${event.eventType}</h2>
//                           <div>${event.content || 'No content available'}</div>
//                       </body>
//                   </html>
//               `,
//           },
//           recipients: {
//               to: [{
//                   address: targetAddress,
//                   displayName: displayName || 'User'
//               }],
//           },
//       };

//       // Send email in background
//       emailClient.beginSend(emailMessage)
//           .then(poller => {
//               poller.pollUntilDone()
//                   .then(result => {
//                       console.log(`Email sent successfully for event: ${event.eventUid}`);
//                   })
//                   .catch(error => {
//                       console.error(`Failed to send email for event: ${event.eventUid}`, error);
//                   });
//           })
//           .catch(error => {
//               console.error(`Failed to initiate email for event: ${event.eventUid}`, error);
//           });
//   });

//   return true;
// };

const sendEmailNotification = async (campaignEvents, targetAddress, displayName) => {
  // Validate inputs
  if (!Array.isArray(campaignEvents) || campaignEvents.length === 0) {
      console.log('No events to process');
      return false;
  }

  if (!targetAddress) {
      console.log('No target email address provided'); 
      return false;
  }

  const resend = new Resend(resendKey);

  // Process each event asynchronously without waiting
  campaignEvents.forEach(async (event) => {
      try {
          const { data, error } = await resend.emails.send({
              from: process.env.RESEND_SENDER_EMAIL,
              to: [targetAddress],
              subject: event.subject || `${event.eventType} Notification`,
              html: event.content || `
                  <html>
                      <body>
                          <h2>${event.eventType}</h2>
                          <div>${event.content || 'No content available'}</div>
                      </body>
                  </html>
              `
          });

          if (error) {
              console.error(`Failed to send email for event ${event.eventUid}:`, error);
              return;
          }

          console.log(`Email sent successfully for event: ${event.eventUid}`, data);

      } catch (err) {
          console.error(`Error sending email for event ${event.eventUid}:`, err);
      }
  });

  return true;
};

module.exports = {
    sendEmail,
    welcomeSendEmail,
    sendEmailNotification
}