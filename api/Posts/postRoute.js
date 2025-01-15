const express = require('express');
const postController = require('./postContoller');
const router = express.Router();

router.get('/',postController.getAllPost);
router.get('/:id',postController.getPostById);
router.post('/createpost',postController.createPost);
router.put("/:id" , postController.updatePost);
router.delete("/:id" , postController.deletePost);

module.exports = router;