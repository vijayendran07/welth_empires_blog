const express = require('express');
const { getUsers, updateProfile, updateUserRole, deleteUser } = require('./users.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);

router.get('/', authorize('ADMIN'), getUsers);
router.put('/:id/role', authorize('ADMIN'), updateUserRole);
router.delete('/:id', authorize('ADMIN'), deleteUser);

module.exports = router;
