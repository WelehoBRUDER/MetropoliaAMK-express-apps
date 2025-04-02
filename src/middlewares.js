import sharp from "sharp";
import jwt from "jsonwebtoken";
import "dotenv/config";

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

export {createThumbnail, authenticateToken, notFoundHandler, errorHandler};
