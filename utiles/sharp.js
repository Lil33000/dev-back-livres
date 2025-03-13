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
  const regex = new RegExp(`\\.${extension}$`);
  const destinationPath = absolutePath.replace(regex, ".webp");

  await sharp(absolutePath)
    .resize({ width: 800, fit: "contain" })
    .webp()
    .toFile(destinationPath);

  fs.unlink(absolutePath, (err) => {
    if (err) console.log(err);
  });

  const fixedFilePath = file.path.replace(/\\/g, "/");
  console.log("file.path", fixedFilePath);
  return fixedFilePath.replace(regex, ".webp");
}

export default optimizeImage;
