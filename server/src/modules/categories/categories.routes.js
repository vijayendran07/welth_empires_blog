const express = require('express');
const { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory 
} = require('./categories.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', getCategories);

router.use(protect);
router.use(authorize('ADMIN')); // Only Admins can manage categories
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
