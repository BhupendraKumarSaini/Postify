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
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
};

/* File Filter (Images Only) */
const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Images only! (jpg, jpeg, png)"));
  }
};

/* Upload Handlers */
export const uploadBlog = multer({
  storage: storage("blogs"),
  fileFilter,
});

export const uploadUser = multer({
  storage: storage("users"),
  fileFilter,
});
