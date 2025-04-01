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
const upload = multer({dest: "uploads/"});

const catRouter = express.Router();

catRouter
  .route("/")
  .get(getCat)
  .post(upload.single("thumb"), createThumbnail, postCat);

catRouter.route("/u/:id").get(getCatsByUserId);

catRouter.route("/:id").get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
