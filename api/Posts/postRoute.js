const express = require('express');
const postController = require('./postContoller');
const router = express.Router();
const upload = require("../../services/multerConfig");

router.get('/', postController.getAllPost);
router.get('/:id', postController.getPostById);

router.post('/createpost', upload.array('media'), async (req, res, next) => {
    try {
        console.log('Parsed Body:', req.body);
        console.log('Files:', req.files);

        if (req.files && req.files.length > 0) {
            await postController.createPost(req, res, next);
        } else {
            return res.status(400).json({ error: "No files uploaded or invalid file type." });
        }
    } catch (error) {
        next(error); // Pass errors to your error handling middleware
    }
});

router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

router.post('/like/:id', postController.likePost);
router.post('/comment', postController.commentPost);

module.exports = router;