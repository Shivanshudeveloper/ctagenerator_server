const mongoose = require('mongoose');

const ctaTestimonialSchema = new mongoose.Schema({
    ctaPublicId: {
        type: String,
        required: true
    },
    testimonials:{
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const ctaTestimonial = mongoose.model('CtaTestimonials', ctaTestimonialSchema);
module.exports = ctaTestimonial;
