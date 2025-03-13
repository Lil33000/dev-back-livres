import sharp from "sharp";
import fs from "fs";
import path from "path";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function optimizeImage(file) {
  const absolutePath = path.resolve(file.path);

  const extension = MIME_TYPES[file.mimetype];

  const destinationPath = absolutePath.replace(`.${extension}`, ".webp");

  await sharp(absolutePath)
    .resize({ width: 800, fit: "contain" })
    .webp()
    .toFile(destinationPath);

  fs.unlink(absolutePath, (err) => {
    if (err) console.log(err);
  });

  return file.path.replace(`.${extension}`, ".webp");
}

export default optimizeImage;
