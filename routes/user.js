import express from 'express';
import userCtrl from '../controllers/user.js';
const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

export default router;
