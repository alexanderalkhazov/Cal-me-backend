import express from 'express';
const router = express.Router();
import {getCanceledBookings, getPastBookings, getUpcomingBookings} from '../controllers/bookings.controller.js';

router
.get('/upcoming', getUpcomingBookings)
.get('/canceled',getCanceledBookings)
.get('/past',getPastBookings)


export default router;
