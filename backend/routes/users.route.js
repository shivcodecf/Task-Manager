import express from 'express'
import { Login, Signup } from '../controllers/users.controllers.js';

const router = express.Router();


router.route("/signup").post(Signup);

router.route("/login").post(Login);


export default router




