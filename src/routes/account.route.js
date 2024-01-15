import express from 'express';
import { uploadProfilePicture } from '../controllers/account.controller.js';

const router = express.Router();

router.post('/uploadImage', uploadProfilePicture);



export default router;