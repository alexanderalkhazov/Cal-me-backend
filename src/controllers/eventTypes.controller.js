import User from '../models/User.js';
import EventType from '../models/EventType.js';
import { slugifyUrl } from '../utils/slugifyUrl.js';

export const getUserEventTypes = async (req, res) => {
    try {
        const email = req.user;

        if (!email) return res.sendStatus(403);
        const user = await User.findOne({ email }).populate('eventTypes').exec();

        if (!user) return res.sendStatus(403).json({ message: 'User events were not found.' });
        const { eventTypes } = user;

        res.json({ eventTypes });

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export const getEventTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const eventType = await EventType.findById(id).exec();
        res.json({ eventType });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export const updateEvent = async (req, res) => {
    try {
        const email = req.user;
        if (!email) return res.sendStatus(403);

        const user = await User.findOne({ email });
        if (!user) return res.sendStatus(404);

        const { id } = req.params;

        const eventType = await EventType.findById(id);
        if (!eventType) return res.sendStatus(404);

        const { name, description, duration, link } = req.body;
        if (!name || !description || !duration || !link) return res.sendStatus(400);

        const oldUrlSegments = eventType.link.split('/');
        oldUrlSegments[oldUrlSegments.length - 1] = slugifyUrl(link);
        const newLink = oldUrlSegments.join('/');

        const updatedEventType = await EventType.findByIdAndUpdate(
            id,
            {
                name,
                description,
                duration,
                link: newLink,
            },
            { new: true }
        );

        res.status(200).json({ updatedEventType });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export const createEvent = async (req, res) => {
    try {
        const email = req.user;
        if (!email) return res.sendStatus(403);

        const user = await User.findOne({ email });
        if (!user) return res.sendStatus(404);

        const { name, description, duration, link } = req.body;

        if (!name || !description || !duration || !link) return res.sendStatus(400);

        const newEvent = new EventType({
            name,
            description,
            duration,
            link
        })

        await newEvent.save();

        await User.findOneAndUpdate(
            { email: user.email },
            { $push: { eventTypes: newEvent } },
            { new: true }
        );

        res.status(201).json({ message: 'New event created!' });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}



