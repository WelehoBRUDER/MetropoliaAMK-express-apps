import sharp from "sharp";

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  // TODO: use file path to create 160x160 png thumbnail with sharp
  const resizedImaged = await sharp(req.file.path)
    .resize(160, 160)
    .toFile(addSuffix(req.file.path));
  if (resizedImaged) {
    console.log("Thumbnail created:", resizedImaged);
  }
  next();
};

function addSuffix(filename) {
  return `${filename}_thumb`;
}

export {createThumbnail};
