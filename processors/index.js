const Queue = require('bull');
const { sendEmail } = require('../lib/resend_email').default

const emailQueue = new Queue('emailQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
});

emailQueue.process(async (job,done) => {
    console.log(job.data)
    const emailResponse = await sendEmail(job.data.contact.firstName, job.data.contact.email);
    console.log(emailResponse)
    done();
    return { success:true,
         emailResponse 
    };
})