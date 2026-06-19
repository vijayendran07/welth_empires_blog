const express = require('express');
const { uploadMedia, uploadFileMedia, getMedia, deleteMedia } = require('./media.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'AUTHOR'));

router.get('/', getMedia);
router.post('/upload', uploadMedia);
router.post('/upload-file', upload.single('file'), uploadFileMedia);
router.delete('/:id', authorize('ADMIN'), deleteMedia);

module.exports = router;
