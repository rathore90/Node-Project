const express = require('express');
const blogController = require('../controller/blogController');
const { requiresAuth } = require('express-openid-connect');

const router = express.Router();

router.get('/create', requiresAuth() ,blogController.blog_create_get);
router.get('/', blogController.blog_index);
router.post('/', blogController.blog_create_post);
router.get('/:id', blogController.blog_details);
router.delete('/:id', blogController.blog_delete);
router.post('/payment', blogController.blog_payment)

module.exports = router;