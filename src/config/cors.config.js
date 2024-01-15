export const allowedList = [
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://localhost:5173'
]

export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by cors policy.'));
        }
    },
    optionSuccessStatus: 200
}
