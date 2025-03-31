const mongoose = require('mongoose');

const LinkedInProfilesSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: false,
    },
    profileResults: {
        object: String,
        provider: String,
        provider_id: String,
        entity_urn: String,
        object_urn: String,
        first_name: String,
        last_name: String,
        profile_picture_url: String,
        public_identifier: String,
        occupation: String,
        premium: Boolean,
        open_profile: Boolean,
        location: String,
        email: String,
        organizations: [{
            id: String,
            mailbox_id: String,
            name: String
        }],
        recruiter: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        sales_navigator: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const linkedinProfiles = mongoose.model('linkedinProfiles', LinkedInProfilesSchema);
module.exports = linkedinProfiles;