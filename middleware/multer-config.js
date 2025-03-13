import multer from "multer";
import sanitize from "sanitize-filename";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const originalName = sanitize(file.originalname.split(" ").join("_"));
    const extension = MIME_TYPES[file.mimetype];
    callback(null, originalName + Date.now() + "." + extension);
  },
});

export default multer({ storage }).single("image");
