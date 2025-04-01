import express from "express";
import {authenticateToken} from "../../middlewares.js";
import {postLogin, getMe} from "../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/login", postLogin);

authRouter.route("/me").get(authenticateToken, getMe);

export default authRouter;
