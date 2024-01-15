import express from 'express';
import {registerUser, loginUser, getRefreshToken, logout} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getRefresh', getRefreshToken);
router.post('/logout', logout);
    
export default router;

