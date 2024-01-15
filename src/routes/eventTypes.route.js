import express from 'express';
const router = express.Router();
import {getUserEventTypes , createEvent, updateEvent, getEventTypeById} from '../controllers/eventTypes.controller.js';


router.route('/')
    .get(getUserEventTypes)
    .post(createEvent)

    router.put('/:id', updateEvent)
    router.get('/:id', getEventTypeById)


    export default router;
