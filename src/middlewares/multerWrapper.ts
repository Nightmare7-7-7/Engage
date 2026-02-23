import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const multerWrapper = 
  (uploadMiddleware: (req: Request, res: Response, next: NextFunction) => void, 
   type: "image" | "video" | "media") =>
  (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: err.message,
          code: err.code,           // helpful: LIMIT_UNEXPECTED_FILE, LIMIT_FILE_SIZE, etc.
        });
      }

      if (err) {
        return res.status(500).json({
          success: false,
          message: "Upload processing failed",
        });
      }

      // Optional: stricter check (especially useful if you use .single / .array)
      if (type !== "media" && !req.file && !req.files) {
        return res.status(400).json({
          success: false,
          message: type === "image" ? "No valid image uploaded" 
                   : type === "video" ? "No valid video uploaded" 
                   : "No file uploaded",
        });
      }

      next();
    });
  };