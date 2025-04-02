import express from "express";
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from "../controllers/user-controller.js";
import {authenticateToken} from "../../middlewares.js";
import {body} from "express-validator";
import {validationErrors} from "../../middlewares.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getUser)
  .post(
    body("email").trim().isEmail(),
    body("username").trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body("password").trim().isLength({min: 8}),
    validationErrors,
    postUser
  );

userRouter
  .route("/:id")
  .get(getUserById)
  .put(authenticateToken, putUser)
  .delete(authenticateToken, deleteUser);

export default userRouter;
