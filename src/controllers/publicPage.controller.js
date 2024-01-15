import User from '../models/User.js';
import EventType from '../models/EventType.js';
import Booking from '../models/Booking.js';
import Attendee from '../models/Attendee.js';
import { main } from '../utils/datetime.js';

export const getPublicUserPage = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) return res.status(404).json({ message: `No username with the name: ${username} was found` });

        const user = await User.findOne({ username }).populate('eventTypes');
        if (!user) return res.sendStatus(403);

        const link = `${req.protocol}://${req.header('host')}/public-page${req.url}`;

        res.json({
            link,
            events: user.eventTypes,
            email: user.email
        });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export const getEventCalendar = async (req, res) => {
    try {
        const { username, eventId } = req.params;
        const { date, offset } = req.query;

        const user = await User.findOne({ username });
        const eventType = await EventType.findById(eventId);
        const bookings = await Booking.find({ user: user._id });

        const millisecond = new Date(date).setMinutes( new Date(date).getMinutes() - Number(offset) );
        const offsetedDate = new Date(millisecond);

        const slots = main(
            offsetedDate,
            user.availabilitySettings,
            eventType.duration,
            bookings
        );

        res.json({
            slots
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const createBooking = async (req, res) => {
    try {
        const { attendee, bookingData, user } = req.body;
        const { username, eventId } = user;
        const { firstName, lastName, attendeeTimeZone, notes, email, contactPhone } = attendee;
        const { currentSlot, currentDate , offset} = bookingData;

        const isDataPresent = Boolean(
            firstName &&
            lastName &&
            attendeeTimeZone &&
            email &&
            contactPhone &&
            currentSlot &&
            currentDate &&
            username &&
            eventId
        );

        if (!isDataPresent) return res.status(400).json({ message: "Something went wrong. you didn't provide data for a booking" });

        const millisecond = new Date(currentDate).setMinutes( new Date(currentDate).getMinutes() - Number(offset));
        const partOfDate = new Date(millisecond).toISOString().split('T')[0];
        const modifiedOffsetedDate = new Date(`${partOfDate}T${currentSlot}`);

        const foundBooking = await Booking.find({ date: modifiedOffsetedDate });
        if (foundBooking.some(element => !!element)) return res.status(404).json({ message: "There is a booking in this date." });

        const foundUser = await User.findOne({ username });
        if (!foundUser) return res.status(404).json({ message: "Something went wrong, we counldn't find the owner of this booking." });

        const foundEvent = await EventType.findById(eventId);

        const foundAttendee = await Attendee.findOne({ email });

        if (!foundAttendee) {
            const foundAttendee = new Attendee({
                firstName,
                lastName,
                notes,
                email,
                contactPhone,
                timeZone: attendeeTimeZone
            });
            await foundAttendee.save();
        }
        const newBooking = new Booking({
            user: foundUser,
            attendee: foundAttendee,
            eventType: foundEvent,
            date: modifiedOffsetedDate,
            isCanceled: false
        })
        await newBooking.save();

        foundUser.bookings = [...foundUser.bookings, newBooking];
        await foundUser.save();

        res.json({ message: `Successfully created a booking with ${username}` });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}