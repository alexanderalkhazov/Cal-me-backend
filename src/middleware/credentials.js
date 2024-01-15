import { allowedList } from '../config/cors.config.js';

export const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedList.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}


