const Events_Model = require('../models/Events');

const { sendEmailNotification } = require('./azure_email');
const { getStatusfromAIMeeting } = require('../controllers/ai');


async function handleCampaignEvents(status, type, campaignUid, leadObjectId, conversation = [], callDuration = 0) {

    
    // Early return if it's not call_disconnected and duration is 0
    if (status !== "call_disconnected" && callDuration === 0) {
        console.log(status, type, campaignUid, leadObjectId, conversation = [], callDuration = 0);
        return;
    }

    const campaignEvents = await Events_Model.find({ campaignUid });
    console.log("Events,", campaignEvents);

    if (!Array.isArray(campaignEvents) || campaignEvents.length === 0) {
        console.log("No Campaign Notifications Found");
        return;
    }

    const leadInfo = await AICampaginLeads_Model.findOne({ _id: leadObjectId }).populate('leadId');
    let allEvents;

    // Event type mapping object
    const eventTypeMap = {
        yesorno: {
            confirmed: "If Confirm",
            cancelled: "If Cancel"
        },
        conversational: {
            MEETING_INTERESTED: "Prospect ask for meeting",
            hot_lead: "Prospect Interested",
            completed: "Call Completed"
        },
        directmessage: {
            completed: "Call Completed Direct Message",
            call_disconnected: "Call Disconnected Direct Message"
        }
    };

    switch (type) {
        case "yesorno":
            allEvents = filterEventsByType(campaignEvents, eventTypeMap.yesorno[status]);
            break;

        case "conversational":
            if (conversation.length > 3) {
                const meetingStatus = await getStatusfromAIMeeting(conversation);
                console.log("Meeting Status", meetingStatus);

                if (meetingStatus === "MEETING_INTERESTED") {
                    allEvents = filterEventsByType(campaignEvents, eventTypeMap.conversational[meetingStatus]);
                } else {
                    allEvents = filterEventsByType(campaignEvents, eventTypeMap.conversational[status]);
                }
            }
            break;

        case "directmessage":
            allEvents = filterEventsByType(campaignEvents, eventTypeMap.directmessage[status]);
            break;
    }

    if (Array.isArray(allEvents) && allEvents.length > 0) {
        await sendEmailNotification(allEvents, leadInfo?.leadId.Email, "Do Not Reply");
    }
}

module.exports = {
    handleCampaignEvents
};