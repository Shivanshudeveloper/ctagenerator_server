const { EmailClient } = require("@azure/communication-email");
const connectionString = `endpoint=https://testmailcs.unitedstates.communication.azure.com/;accesskey=kP+v3TcMwQseNRIhcLEZzW65wFGhK1tBZptUy+pXUqkGy5BE3FNbOsirXfOIprTqtcC7b34pyfHm5RGWxGlaPA==`;
const emailClient = new EmailClient(connectionString);
const handlebars = require('handlebars');


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

module.exports = {
    sendEmail,
    welcomeSendEmail
}