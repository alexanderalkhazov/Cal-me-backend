import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'You are unauthorized to continue.'});
            req.user = decoded.email;
            next();
        }
    )
}

