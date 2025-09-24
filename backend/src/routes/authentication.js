
import * as authenticationController from '../controllers/authenticationController.js'
import express from 'express';
const router = express.Router();


router.post('/create-account', authenticationController.signup);

router.post('/login', authenticationController.login);

export default router;