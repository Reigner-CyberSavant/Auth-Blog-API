const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

router.get('/all-posts', postController.getPosts);

// router.get('/single-post', postController);

// router.post('/create-post', postController);

// router.put('/update-post',  postController);

// router.delete('/delete-post', postController);



module.exports = router;