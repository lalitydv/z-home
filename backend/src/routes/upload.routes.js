import express from 'express';
import { uploadFile, deleteFile, getFileUrl } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', upload.single('file'), uploadFile);
router.delete('/:fileKey', deleteFile);
router.get('/:fileKey', getFileUrl);

export default router;

