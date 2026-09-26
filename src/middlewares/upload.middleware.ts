import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { ApiError } from '../utils/apiError.js';

// Ensure upload directories exist
const uploadDirs = [
  path.join(process.cwd(), 'uploads', 'resumes'),
  path.join(process.cwd(), 'uploads', 'gallery'),
  path.join(process.cwd(), 'uploads', 'events'),
  path.join(process.cwd(), 'uploads', 'videos'),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper for generating sanitized unique filename
const createStorage = (folderName: string) => {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dest = path.join(process.cwd(), 'uploads', folderName);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const sanitizedBase = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 50);
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
    },
  });
};

// 1. Resume upload (PDF, DOC, DOCX - max 10MB)
const resumeFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        'Invalid resume file type. Allowed formats: PDF, DOC, DOCX.'
      )
    );
  }
};

export const uploadResume = multer({
  storage: createStorage('resumes'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: resumeFileFilter,
});

// 2. Image filter (JPG, JPEG, PNG, WEBP - max 5MB)
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        'Invalid image file type. Allowed formats: JPG, JPEG, PNG, WebP.'
      )
    );
  }
};

export const uploadGalleryImage = multer({
  storage: createStorage('gallery'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: imageFileFilter,
});

export const uploadEventBanner = multer({
  storage: createStorage('events'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: imageFileFilter,
});

export const uploadVideoThumbnail = multer({
  storage: createStorage('videos'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: imageFileFilter,
});

// 3. Multi-field upload for Academy Videos (Thumbnail image + optional Video file upload)
const mediaFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedImageExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedVideoExts = ['.mp4', '.webm', '.mov', '.mkv'];

  if (file.fieldname === 'thumbnail') {
    if (allowedImageExts.includes(ext)) {
      return cb(null, true);
    }
    return cb(ApiError.badRequest('Invalid thumbnail format. Allowed: JPG, JPEG, PNG, WebP.'));
  }

  if (file.fieldname === 'videoFile' || file.fieldname === 'video') {
    if (allowedVideoExts.includes(ext)) {
      return cb(null, true);
    }
    return cb(ApiError.badRequest('Invalid video format. Allowed: MP4, WebM, MOV, MKV.'));
  }

  cb(null, true);
};

export const uploadAcademyMedia = multer({
  storage: createStorage('videos'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max for video files, 5MB thumbnail
  },
  fileFilter: mediaFileFilter,
});
