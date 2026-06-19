const express = require('express');
const { 
  createArticle, 
  getArticles, 
  getArticleBySlug, 
  getArticleById,
  updateArticle, 
  deleteArticle,
  createComment,
  likeComment
} = require('./articles.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.get('/id/:id', getArticleById);
router.get('/:slug', getArticleBySlug);
router.post('/:id/comments', createComment);
router.put('/comments/:commentId/like', likeComment);

// Protected routes (Author or Admin)
router.use(protect);
router.post('/', authorize('AUTHOR', 'ADMIN'), createArticle);
router.put('/:id', authorize('AUTHOR', 'ADMIN'), updateArticle);
router.delete('/:id', authorize('AUTHOR', 'ADMIN'), deleteArticle);

module.exports = router;
