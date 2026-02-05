import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const multerWrapper =
  (upload: any, type: "image" | "video") =>
  (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
      // Multer internal errors
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Unknown upload error
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Upload failed",
        });
      }

      // File rejected by fileFilter
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            type === "image"
              ? "Only image files allowed"
              : "Only video files allowed",
        });
      }

      next();
    });
  };
