import multer from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import { AppError } from './error';

// Types
interface MulterFile extends Express.Multer.File {
  url?: string;
}

interface MulterRequest extends Request {
  file?: MulterFile;
  files?: MulterFile[];
}

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const UPLOAD_PATH = 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Generate secure filename
const generateSecureFilename = (originalname: string): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const extension = path.extname(originalname).toLowerCase();
  return `${timestamp}-${randomString}${extension}`;
};

// Validate file type using magic numbers
const validateFileType = async (file: MulterFile): Promise<boolean> => {
  const readFile = promisify(fs.readFile);
  const buffer = await readFile(file.path);
  
  const fileSignatures: { [key: string]: number[] } = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46, 0x38]
  };

  for (const [mimeType, signature] of Object.entries(fileSignatures)) {
    if (signature.every((byte, index) => buffer[index] === byte)) {
      return ALLOWED_FILE_TYPES.includes(mimeType);
    }
  }
  return false;
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, generateSecureFilename(file.originalname));
  }
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new AppError('Invalid file type. Only JPEG, PNG and GIF images are allowed.', 400));
  }
  cb(null, true);
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files per request
  }
});

// Middleware for handling single image upload
export const uploadSingleImage = (fieldName: string): RequestHandler => {
  return upload.single(fieldName);
};

// Middleware for handling multiple image uploads
export const uploadMultipleImages = (fieldName: string, maxCount: number = 5) => {
  return [
    upload.array(fieldName, maxCount),
    async (req: MulterRequest, _res: Response, next: NextFunction) => {
      try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
          throw new AppError('No files uploaded', 400);
        }

        // Validate each file
        for (const file of req.files) {
          const isValidType = await validateFileType(file);
          if (!isValidType) {
            // Remove all uploaded files if any is invalid
            await Promise.all(req.files.map(f => fs.promises.unlink(f.path)));
            throw new AppError('Invalid file type detected', 400);
          }
          // Add file URL
          file.url = `${req.protocol}://${req.get('host')}/${UPLOAD_PATH}/${file.filename}`;
        }

        next();
      } catch (error) {
        next(error);
      }
    }
  ];
};

// Cleanup middleware for removing uploaded files on error
export const cleanupOnError = async (err: any, req: MulterRequest, _res: Response, next: NextFunction) => {
  if (err) {
    // Remove uploaded files if they exist
    if (req.file) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }
    if (req.files && Array.isArray(req.files)) {
      await Promise.all(req.files.map(file => fs.promises.unlink(file.path).catch(() => {})));
    }
  }
  next(err);
}; 