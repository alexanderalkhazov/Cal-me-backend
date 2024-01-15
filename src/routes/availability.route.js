import express from 'express';
const router = express.Router();
import {getAvailabilityUserSettings,setAvailabilityUserSettings} from '../controllers/availability.controller.js';


router
.get('/', getAvailabilityUserSettings)
.put('/', setAvailabilityUserSettings)

export default router;