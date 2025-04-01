import sharp from "sharp";

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

export {createThumbnail};
