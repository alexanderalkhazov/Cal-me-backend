import User from '../models/User.js';

export const getAvailabilityUserSettings = async (req, res) => {
    try {
        const email = req.user;
        if (!email) return res.sendStatus(403);

        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.sendStatus(404);

        const settings = foundUser.availabilitySettings;
        res.json({ settings });

    } catch (err) {
        res.sendStatus(500);
    }

}

export const setAvailabilityUserSettings = async (req, res) => {
    try {
        const email = req.user;

        const newSettings = req.body;

        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(404).json({ error: 'User not found' });

        foundUser.availabilitySettings = newSettings;

        await foundUser.save();

        res.status(200).json({ message: 'User settings updated successfully', settings: newSettings });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}