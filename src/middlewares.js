import sharp from "sharp";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {validationResult} from "express-validator";
import multer from "multer";

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  let extension = "jpg";
  if (req.file.mimetype === "image/png") {
    // if (req.file.mimetype.includes('/png')) {
    extension = "png";
  }
  const resizedImaged = await sharp(req.file.path)
    .resize(160, 160)
    .toFile(`${req.file.path}_thumb.${extension}`);
  if (resizedImaged) {
    console.log("Thumbnail created:", resizedImaged);
  }
  next();
};

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10 MB
  },
  fileFilter: (req, file, cb) => {
    // allow only images and videos
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      // accept file
      cb(null, true);
    } else {
      // reject file
      cb(null, false);
    }
  },
});

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: "invalid token"});
  }
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); // forward error to error handler
};
/**
 * Custom default middleware for handling errors
 */
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500); // default is 500 if err.status is not defined
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};

const validationErrors = async (req, res, next) => {
  // validation errors can be retrieved from the request object (added by express-validator middleware)
  const errors = validationResult(req);
  // check if any validation errors
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(", ");
    const error = new Error(messages);
    error.status = 400;
    next(error);
    return;
  }
  next();
};

export {
  createThumbnail,
  authenticateToken,
  notFoundHandler,
  errorHandler,
  validationErrors,
  upload,
};
