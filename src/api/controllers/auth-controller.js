import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {getUserByUsername} from "../models/user-model.js";
import "dotenv/config";

const postLogin = async (req, res) => {
  const user = await getUserByUsername(req.body.username);
  if (!bcrypt.compareSync(req.body.password, user?.password) || !user) {
    const error = new Error("Password/username is incorrect");
    error.status = 401;
    return next(error);
  }

  const userWithNoPassword = {
    user_id: user.user_id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.json({user: userWithNoPassword, token});
};

const getMe = async (req, res) => {
  if (res.locals.user) {
    res.json({message: "token ok", user: res.locals.user});
  } else {
    const error = new Error("User not authenticated");
    error.status = 401;
    return next(error);
  }
};

export {postLogin, getMe};
