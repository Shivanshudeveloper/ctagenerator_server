const Cta_Model = require('../../models/Cta');
const CtaCounter_Model = require('../../models/CtaCounter');
const { v4: uuidv4 } = require('uuid');


const createCta = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const submitrequest = req.body;
    const ctaUid = `${Date.now()}_${uuidv4()}`;

    const counter = await CtaCounter_Model.findByIdAndUpdate(
        'ctaId',
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    try {
        const newCta = new Cta_Model({
            organizationId: submitrequest.organizationId,
            userEmail: submitrequest.userEmail,
            typecta: submitrequest.typecta,
            title: submitrequest.title,
            ctaPublicId: counter.sequence_value,
            ctaUid,
            status: 1
        });

        const resdata = await newCta.save();
        console.log(resdata);
        return res.status(200).json({ status: true, data: resdata });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, data: 'Error while creating Project' });
    }
};

// Get CTA by Public ID
const getCtabyPublicId = async (req, res) => {
    const { ctaPublicId } = req.params;
    try {
        Cta_Model.findOne({ ctaPublicId })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete CTA by MongoDB UID
const deleteCta = async (req, res) => {
    const { ctaid } = req.params;

    try {
        Cta_Model.findOneAndDelete({ _id: ctaid })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ status: false, data: 'Something went wrong' });
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, data: 'Something went wrong' });
    }
}

// Get User CTA
const getCtaforUser = async (req, res) => {
    const { organizationId } = req.params;
    try {
        Cta_Model.find({ organizationId }).sort({ date: -1 })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get All CTA
const getAllCtaInSystem = async (req, res) => {
    try {
        Cta_Model.find({}).sort({ date: -1 })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update CTA Details
const updateCtaDetails = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const submitrequest = req.body;
    console.log("hi updateCtaDetails");
    Cta_Model.updateOne({ ctaPublicId: submitrequest?.ctaPublicId }, { $set: submitrequest.data})
        .then((data) => {
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
};


module.exports = {
    createCta,
    getCtabyPublicId,
    deleteCta,
    getCtaforUser,
    getAllCtaInSystem,
    updateCtaDetails
}