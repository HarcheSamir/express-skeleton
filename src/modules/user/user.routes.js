const express = require('express');
const { getUserById } = require('./user.controller');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

// Protected route: get current user profile
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
