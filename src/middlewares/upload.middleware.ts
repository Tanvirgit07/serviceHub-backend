import multer from "multer";
import AppError from "../errors/AppError.js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
    fields: 20,
    fieldSize: 64 * 1024,
    parts: 25,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new AppError("Only JPEG, PNG and WebP images are allowed", 400),
      );
    }

    callback(null, true);
  },
});

export default upload;