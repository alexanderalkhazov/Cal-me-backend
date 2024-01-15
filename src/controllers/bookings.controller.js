import User from '../models/User.js';
import Booking from '../models/Booking.js';


export const getUpcomingBookings = async (req, res) => {
    try {
        const email = req.user;
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(403).json({ message: "You are not allowed to access this resource" });

        const upcomingBookings = await Booking.find({
            user: foundUser._id,
            date: { $gte: new Date() },
            isCanceled: false,
        }).populate('attendee');

        if (!upcomingBookings) return res.status(404).json({ message: "No upcoming bookings exist yet.", bookings: [] });

        res.json({
            message: "Successfully got user's bookings.",
            bookings: upcomingBookings
        });
        
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export const getPastBookings = async (req, res) => {
    try {

        const email = req.user;
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(403).json({ message: "You are not allowed to access this resource" });

        const pastBookings = await Booking.find({
            user: foundUser._id,
            date: { $lt: new Date() },
            isCanceled: false,
        }).populate('attendees');

        if (!pastBookings) return res.status(404).json({ message: "No past bookings exist yet.", bookings: [] });

        res.json({
            bookings: pastBookings
        });

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export const getCanceledBookings = async (req, res) => {
    try {

        const email = req.user;
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(403).json({ message: "You are not allowed to access this resource" });

        const canceledBookings = await Booking.find({
            user: foundUser._id,
            isCanceled: true,
        }).populate('eventType attendee');


        if (!canceledBookings) return res.status(404).json({ message: "No canceled bookings exist.", bookings: [] });

        res.json({
            bookings: canceledBookings
        });

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
