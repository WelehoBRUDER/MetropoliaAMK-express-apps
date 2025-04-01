import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from "../models/user-model.js";
import bcrypt from "bcrypt";

const getUser = async (req, res) => {
  try {
    res.json(await listAllUsers());
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getUserById = (req, res) => {
  try {
    const user = findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const postUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await addUser(req.body);
    if (result.user_id) {
      res.status(201);
      res.json({message: "New user added.", result});
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const putUser = (req, res) => {
  const user = res.locals.user;
  try {
    if (user.user_id !== parseInt(req.params.id) && user.role !== "admin") {
      res.sendStatus(403);
      return;
    }
    const result = modifyUser(req.body, req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.status(200);
    res.json({message: "User item updated."});
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const deleteUser = (req, res) => {
  const user = res.locals.user;
  try {
    if (user.user_id !== parseInt(req.params.id) && user.role !== "admin") {
      res.sendStatus(403);
      return;
    }
    const result = removeUser(req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.status(200);
    res.json({message: "User item deleted."});
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
