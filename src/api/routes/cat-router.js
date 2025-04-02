import express from "express";
import multer from "multer";
import {createThumbnail} from "../../middlewares.js";
import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from "../controllers/cat-controller.js";
import {authenticateToken} from "../../middlewares.js";
import {body} from "express-validator";
import {upload} from "../../middlewares.js";

const catRouter = express.Router();

catRouter
  .route("/")
  .get(getCat)
  .post(
    authenticateToken,
    upload.single("file"),
    body("cat_name").trim().isLength({min: 3, max: 50}),
    body("weight").isNumeric(),
    body("birthdate").isDate(),
    createThumbnail,
    postCat
  );

catRouter.route("/u/:id").get(getCatsByUserId);

catRouter
  .route("/:id")
  .get(getCatById)
  .put(authenticateToken, putCat)
  .delete(authenticateToken, deleteCat);

export default catRouter;
