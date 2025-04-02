import {
  addCat,
  findCatById,
  findCatsByUserId,
  listAllCats,
  modifyCat,
  removeCat,
} from "../models/cat-model.js";
import {validationResult} from "express-validator";

const getCat = async (req, res, next) => {
  const cats = await listAllCats();
  if (cats.length === 0) {
    const error = new Error("No cats found.");
    error.status = 404;
    return next(error);
  }
  res.status(200);
  res.json(cats);
};

const getCatById = async (req, res, next) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    const error = new Error("The specified cat was not found.");
    error.status = 404;
    return next(error);
  }
};

const getCatsByUserId = async (req, res, next) => {
  const cats = await findCatsByUserId(req.params.id);
  if (cats) {
    res.json(cats);
  } else {
    const error = new Error("The specified user has no cats.");
    error.status = 404;
    return next(error);
  }
};

const postCat = async (req, res, next) => {
  const user = res.locals?.user;

  if (!user) {
    const error = new Error("User not authenticated");
    error.status = 401;
    return next(error);
  }

  req.body.owner = user.user_id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // pass the error to the error handler middleware
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    return next(error);
  }
  const result = await addCat(req.body, req.file);
  if (result.cat_id) {
    res.status(201);
    res.json({message: "New cat added.", result});
  } else {
    const error = new Error("Invalid request");
    error.status = 400;
    return next(error);
  }
};

const putCat = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // pass the error to the error handler middleware
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    return next(error);
  }
  const user = res.locals?.user;

  const cat = await findCatById(req.params.id);
  if (!cat) {
    const error = new Error("Cat not found");
    error.status = 404;
    return next(error);
  }
  if (user?.user_id !== cat.owner && user?.role !== "admin") {
    const error = new Error("You do not have permission to modify this cat.");
    error.status = 403;
    return next(error);
  }
  const result = await modifyCat(req.body, req.params.id, user);
  if (!result) {
    const error = new Error("Invalid request/server error");
    error.status = 400;
    return next(error);
  }
  res.sendStatus(200);
};

const deleteCat = async (req, res, next) => {
  const user = res.locals?.user;

  if (user?.user_id !== parseInt(req.params.id) && user?.role !== "admin") {
    const error = new Error("You do not have permission to delete this cat.");
    error.status = 403;
    return next(error);
  }
  const result = await removeCat(req.params.id, user);
  if (!result) {
    const error = new Error("Invalid request/server error");
    error.status = 400;
    return next(error);
  }
  res.sendStatus(200);
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
