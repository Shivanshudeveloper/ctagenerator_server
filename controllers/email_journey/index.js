const EmailJourney_Model = require('../../models/EmailJourney');
const EmailSend_Model = require('../../models/EmailSend');
const { v4: uuidv4 } = require('uuid');


const createEmailJourney = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const submitrequest = req.body;
    const emailJoruneyId = `${Date.now()}_${uuidv4()}`;

    try {
        const newEmailJourney = new EmailJourney_Model({
            title: submitrequest?.title,
            userEmail: submitrequest?.userEmail,
            organizationId: submitrequest?.organizationId,
            emailJoruneyId: emailJoruneyId,
            emailTemplateId: submitrequest?.emailTemplateId,
            status: 1
        });

        const resdata = await newEmailJourney.save();
        return res.status(200).json({ status: true, data: emailJoruneyId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, data: 'Error while creating Project' });
    }
};

const updateEmailJourney = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const submitrequest = req.body;

    EmailJourney_Model.updateOne({ emailJoruneyId: submitrequest?.emailJoruneyId }, { $set: {title: submitrequest?.title } })
        .then((data) => {
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
};

// Only get the users of the organization not admin
const deleteEmailJourney = async (req, res) => {
    const { emailJoruneyId } = req.params;
    EmailJourney_Model.findOneAndDelete({ emailJoruneyId })
        .then((data) => {
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
}

// Get User Email Send
const getUserEmailSend = async (req, res) => {
    const { organizationId } = req.params;
    try {
        EmailSend_Model.find({ organizationId }).sort({ date: -1 })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createEmailJourney,
    updateEmailJourney,
    deleteEmailJourney,
    getUserEmailSend
}