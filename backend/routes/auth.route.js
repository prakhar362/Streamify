import express from 'express';
import { Login,Logout,Signup,Onboard } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router=express.Router()

router.post('/signup',Signup);

router.post('/login',Login);

router.post('/logout',Logout);

router.post('/Onboarding',protectRoute,Onboard);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router