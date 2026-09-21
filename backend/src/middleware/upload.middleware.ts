import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB maximum file size limit
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid image MIME type "${file.mimetype}". Allowed types: jpg, jpeg, png, webp`));
    }
  }
});

export const uploadMiddleware = upload;

// Middleware wrapper with custom error response
export const handleUploadSingle = (fieldName: string) => {
  const singleUpload = upload.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    singleUpload(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, error: 'File size exceeds maximum 5MB limit.' });
        }
        return res.status(400).json({ success: false, error: err.message || 'File upload error.' });
      }
      next();
    });
  };
};

