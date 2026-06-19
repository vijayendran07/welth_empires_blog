const express = require('express');
const { getTags, createTag, deleteTag } = require('./tags.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', getTags);

router.use(protect);
router.use(authorize('ADMIN', 'AUTHOR')); 
router.post('/', createTag);
router.delete('/:id', authorize('ADMIN'), deleteTag);

module.exports = router;
