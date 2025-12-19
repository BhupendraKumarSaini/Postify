import multer from "multer";
import path from "path";
import fs from "fs";

/* Ensure upload directory exists */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* Storage Factory */
const storage = (folder) => {
  const uploadPath = `uploads/${folder}`;
  ensureDir(uploadPath);

  return multer.diskStorage({
    destination: uploadPath,
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
};

/* File Filter (Images Only) */
const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

/* Upload Handlers */
export const uploadUser = multer({
  storage: storage("users"),
  fileFilter,
});

export const uploadBlog = multer({
  storage: storage("blogs"),
  fileFilter,
});
