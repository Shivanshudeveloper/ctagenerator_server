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
        return res.status(200).json({ status: true, data: resdata });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, data: 'Error while creating Project' });
    }
};

module.exports = {
    createCta,
}