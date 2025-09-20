
import * as authenticationController from '../controllers/authController.js'
import express from 'express';
const router = express.Router();


router.post('/create-account', authenticationController.createAccount);

router.post('/login', authenticationController.login);

export default router;