import express from "express";
import multer from "multer";
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from "../controllers/cat-controller.js";
const upload = multer({dest: "uploads/"});

const catRouter = express.Router();

catRouter.route("/").get(getCat).post(upload.single("thumb"), postCat);

catRouter.route("/:id").get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
