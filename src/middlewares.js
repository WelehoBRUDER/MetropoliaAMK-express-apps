import sharp from "sharp";

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file.path);
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
  const parts = filename.split(".");
  const ext = parts.pop();
  return `${parts.join(".")}_thumb.${ext}`;
}

export {createThumbnail};
