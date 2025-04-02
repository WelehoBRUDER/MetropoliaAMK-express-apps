import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from "../models/user-model.js";
import bcrypt from "bcrypt";
import {validationResult} from "express-validator";

const getUser = async (req, res, next) => {
  const users = await listAllUsers();
  console.log(users);
  if (users.length === 0) {
    const error = new Error("No users found.");
    error.status = 404;
    return next(error);
  }
  res.status(200);
  res.json(users);
};

const getUserById = (req, res, next) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    const error = new Error("The specified user was not found.");
    error.status = 404;
    return next(error);
  }
};

const postUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // pass the error to the error handler middleware
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    return next(error);
  }
  req.body.password = bcrypt.hashSync(req.body.passwd, 10);
  req.body.role = "user"; // default role
  const result = await addUser(req.body);

  if (result.user_id) {
    res.status(201);
    res.json({message: "New user added.", result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // pass the error to the error handler middleware
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    return next(error);
  }
  const user = res.locals.user;
  if (user.user_id !== parseInt(req.params.id) && user.role !== "admin") {
    const error = new Error("You do not have permission to modify this user.");
    error.status = 403;
    return next(error);
  }
  const result = modifyUser(req.body, req.params.id);
  if (!result) {
    const error = new Error("Invalid request");
    error.status = 400;
    return next(error);
  }
  res.status(200);
  res.json({message: "User item updated."});
};

const deleteUser = (req, res, next) => {
  const user = res.locals?.user;
  if (user?.user_id !== parseInt(req.params.id) && user?.role !== "admin") {
    const error = new Error("You do not have permission to delete this user.");
    error.status = 403;
    return next(error);
  }
  const result = removeUser(req.params.id);
  if (!result) {
    const error = new Error("Invalid request");
    error.status = 400;
    return next(error);
  }
  res.status(200);
  res.json({message: "User item deleted."});
};

export {getUser, getUserById, postUser, putUser, deleteUser};
