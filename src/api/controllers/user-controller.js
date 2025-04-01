import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from "../models/user-model.js";

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
  } catch {
    res.sendStatus(500);
  }
};

const postUser = (req, res) => {
  try {
    const result = addUser(req.body);
    if (result.user_id) {
      res.status(201);
      res.json({message: "New user added.", result});
    } else {
      res.sendStatus(400);
    }
  } catch {}
};

const putUser = (req, res) => {
  try {
    const result = modifyUser(req.body, req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.status(200);
    res.json({message: "User item updated."});
  } catch {
    res.sendStatus(500);
  }
};

const deleteUser = (req, res) => {
  try {
    const result = removeUser(req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.status(200);
    res.json({message: "User item deleted."});
  } catch {
    res.sendStatus(500);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
