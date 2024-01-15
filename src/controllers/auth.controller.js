import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setDefaultUserSettings } from '../config/setDefaultUserSettings.config.js';

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Email and password required.' });

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'This user doesnt exist' });

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const accessToken = jwt.sign(
                { email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            const refreshToken = jwt.sign(
                { email: user.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            user.refreshToken = refreshToken;
            await user.save();
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({
                message: 'User logged in successfully!',
                accessToken: accessToken,
                userInfo: {
                    email: user.email,
                    username: user.username,
                    _id: user._id,
                    imageUrl: user.imageUrl
                }
            });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

export const registerUser = async (req, res) => {
    try {
        const { email, password, confirmPassword, username } = req.body;

        if (!email || !password || !username || !confirmPassword) return res.status(400).json({ message: 'No fields provided.' });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match each other." });

        const foundUser = await User.findOne({ email });
        if (foundUser) return res.status(409).json({ error: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            username,
            password: hashedPassword,
            availabilitySettings: setDefaultUserSettings()
        });

        const accessToken = jwt.sign(
            { email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

        res.status(201).json({
            message: `User ${email} registered successfully`,
            token: accessToken,
            userInfo: {
                email: user.email,
                username: user.username,
                _id: user._id,
                imageUrl: user.imageUrl
            }
        });

    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

export const getRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized, no cookie provided.' });

        const refreshToken = cookies.jwt;
        const user = await User.findOne({ refreshToken }).exec();

        if (!user) return res.status(403).json({ message: 'No user was found with those credentials.' });

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || user.email !== decoded.email) return res.sendStatus(403);

                const accessToken = jwt.sign(
                    { email: decoded.email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                )
                res.json({
                    message: 'Successfully got a new token',
                    accessToken,
                    userInfo: {
                        email: user.email,
                        username: user.username,
                        _id: user._id,
                        imageUrl: user.imageUrl
                    }
                });
            }
        )

    } catch (err) {
        res.sendStatus(500);
    }
}

export const logout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);

        const refreshToken = cookies.jwt;

        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        user.refreshToken = '';
        await user.save();

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);

    } catch (err) {
        res.sendStatus(500);
    }
}