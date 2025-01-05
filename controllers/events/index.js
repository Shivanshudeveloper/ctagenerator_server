const Events_Model = require('../../models/Events');
const { v4: uuidv4 } = require('uuid'); // For generating unique eventUid

// Create Event
const createEvent = async (req, res) => {
    try {
        const { eventType, campaignUid, content, organizationId } = req.body;
        
        // Check if required fields are present
        if (!eventType || !campaignUid) {
            return res.status(400).json({ 
                success: false, 
                error: 'Event type and campaign ID are required' 
            });
        }

        // Check if event with same type exists for this campaign
        const existingEvent = await Events_Model.findOne({
            campaignUid,
            eventType,
        });

        if (existingEvent) {
            return res.status(409).json({
                success: false,
                error: `An event of type "${eventType}" already exists for this campaign`
            });
        }

        // Create new event if no duplicate exists
        const eventUid = `EVENT_${Date.now()}_${uuidv4()}`;
        const newEvent = new Events_Model({
            eventUid,
            eventType,
            campaignUid,
            content,
            organizationId
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({ success: true, data: savedEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Get All User Events
const getAllUserEvents = async (req, res) => {
    const { organizationId } = req.params;

    try {
        const events = await Events_Model.find({ organizationId }).sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Get Single Event by eventUid
const getEventById = async (req, res) => {
    try {
        const { eventUid } = req.params;
        const event = await Events_Model.findOne({ eventUid });
        
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Get Events by Campaign
const getEventsByCampaign = async (req, res) => {
    try {
        const { campaignUid } = req.params;
        const events = await Events_Model.find({ campaignUid }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Update Event
const updateEvent = async (req, res) => {
    try {
        const { eventUid } = req.params;
        const updateData = req.body;
        
        const event = await Events_Model.findOne({ eventUid });
        
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Prevent updating eventUid
        delete updateData.eventUid;
        
        const updatedEvent = await Events_Model.findOneAndUpdate(
            { eventUid },
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Delete Event
const deleteEvent = async (req, res) => {
    try {
        const { eventUid } = req.params;
        const event = await Events_Model.findOne({ eventUid });
        
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        await Events_Model.findOneAndDelete({ eventUid });
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Delete Events by Campaign
const deleteEventsByCampaign = async (req, res) => {
    try {
        const { campaignUid } = req.params;
        await Events_Model.deleteMany({ campaignUid });
        res.status(200).json({ success: true, message: 'Events deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    createEvent,
    getAllUserEvents,
    getEventById,
    getEventsByCampaign,
    updateEvent,
    deleteEvent,
    deleteEventsByCampaign
};