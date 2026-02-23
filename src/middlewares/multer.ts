import multer from "multer";

const storage = multer.memoryStorage();

// 📸 Image upload
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

// 🎥 Video upload
export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});


export const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("video/") && !file.mimetype.startsWith("image/")) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});
