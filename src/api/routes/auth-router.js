import express from "express";
import {authenticateToken} from "../../middlewares.js";
import {postLogin, getMe} from "../controllers/auth-controller.js";
import {postUser} from "../controllers/user-controller.js";
import {body} from "express-validator";
import {validationErrors} from "../../middlewares.js";

const authRouter = express.Router();

authRouter.post("/login", postLogin);

authRouter.post(
  "/register",
  (body("email").trim().isEmail(),
  body("username").trim().isLength({min: 3, max: 20}).isAlphanumeric(),
  body("password").trim().isLength({min: 8}),
  validationErrors,
  postUser)
);

authRouter.route("/me").get(authenticateToken, getMe);

export default authRouter;
