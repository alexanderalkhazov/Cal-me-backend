import express from 'express';
const router = express.Router();
import { getPublicUserPage, getEventCalendar, createBooking } from '../controllers/publicPage.controller.js';

router.get('/:username', getPublicUserPage);
router.get('/:username/:eventId', getEventCalendar);
router.post('/', createBooking);

export default router;
