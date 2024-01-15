import envConfig from 'dotenv';
envConfig.config();
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { verifyJwt } from './src/middleware/verifyJwt.js';
import { credentials } from './src/middleware/credentials.js';
import auth from './src/routes/auth.route.js';
import availability from './src/routes/availability.route.js';
import bookings from './src/routes/bookings.route.js';
import eventTypes from './src/routes/eventTypes.route.js';
import publicPage from './src/routes/publicPage.route.js';
import { corsOptions } from './src/config/cors.config.js';
import account from './src/routes/account.route.js';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(credentials);
app.use(cors(corsOptions));

app.use('/auth', auth);
app.use('/public-page', publicPage);
app.use(verifyJwt);

app.use('/event-types', eventTypes);
app.use('/account', account);
app.use('/bookings', bookings);
app.use('/availability', availability);


app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
})

app.all('*', (req, res) => {
    res.status(404).json({
        message: '404 Not Found'
    });
})


mongoose.connect(process.env.DATABASE)
    .then(() => {
        app.listen(port, () => console.log(`Cal-me is listening on port ${port} for requests!`));
    })
    .catch(err => console.log(err))