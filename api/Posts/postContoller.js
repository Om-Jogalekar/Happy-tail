const { Sequelize } = require('sequelize');
const Post = require('./postServices');
const User = require('../users/userServices');
const Comment = require('./commentModel');
const Like = require('./likeModel');

exports.getAllPost = async (req, res) => {
    try {
        const userId = req.appUser.id;

        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['firstName', 'lastName']
                }
            ],
            attributes: [
                'id',
                'userId',
                'content',
                'media',
                'createdOn',
                [Sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM like_master AS Likes 
                    WHERE Likes.postId = post_master.id
                )`), 'likeCount'],
                [Sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM comment_master AS Comments
                    WHERE Comments.postId = post_master.id
                )`), 'commentCount'],
                [Sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM like_master AS Likes 
                    WHERE Likes.postId = post_master.id 
                    AND Likes.userId = ${userId}
                ) > 0`), 'liked']
            ],
            order: [['createdOn', 'DESC']]
        });

        const postIds = posts.map(post => post.id);

        const comments = await Comment.findAll({
            where: { postId: postIds },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['firstName', 'lastName']
                }
            ],
            attributes: ['id', 'postId', 'userId', 'content', 'createdOn']
        });

        const formattedPosts = posts.map(post => {
            const fullName = post.User
                ? post.User.firstName + " " + post.User.lastName
                : "Unknown";

            return {
                id: post.id,
                fullName: fullName,
                userId: post.userId,
                content: post.content,
                media: post.media,
                createdOn: post.createdOn,
                likeCount: post.dataValues.likeCount || 0,
                commentCount: post.dataValues.commentCount || 0,
                liked: post.dataValues.liked || false,
                comments: comments
                    .filter(comment => comment.postId === post.id)
                    .map(comment => ({
                        id: comment.id,
                        userId: comment.userId,
                        fullName: comment.User
                            ? `${comment.User.firstName} ${comment.User.lastName}`
                            : "Unknown",
                        content: comment.content,
                        createdOn: comment.createdOn
                    }))
            }
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.appUser.id;

        let media = [];
        if (req.files && req.files.length > 0) {
            media = req.files.map(file => `/uploads/${file.filename}`);
            media = JSON.stringify(media)
        }

        const newPost = await Post.create({ userId, content, media },);
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, media } = req.body;

        const post = await Post.findByPk(id);
        if (!post) res.status(404).json({ error: "post not found" });
        await post.update({ content, media });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) res.status(404).json({ error: "Post not found" });
        await post.destroy(post);
        res.status(200).json({ message: "Post deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.likePost = async (req, res) => {
    try {
        const userId = req.appUser.id; // Assuming userId is sent from the frontend
        const postId = req.params.id;
        const liked = req.body.liked

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        const existingLike = await Like.findOne({
            where: { postId, userId }
        });

        if (existingLike && !liked) {
            // Unlike the post
            await existingLike.destroy();
        } else {
            // Like the post
            await Like.create({ postId, userId });
        }

        res.status(200).json({ liked: !existingLike });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.commentPost = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.appUser.id;

        // Validate input
        if (!comment || !postId) {
            return res.status(400).json({ error: 'Post ID and comment are required.' });
        }

        // Check if post exists
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Add the comment
        const newComment = await Comment.create({
            postId,
            userId,
            content: comment,
        });

        // Fetch the newly created comment with user details
        const commentData = await Comment.findOne({
            where: { id: newComment.id },
            include: [
                {
                    model: User,
                    as: 'User', // Ensure this matches your model association
                    attributes: ['firstName', 'lastName']
                }
            ],
            attributes: ['id', 'postId', 'userId', 'content', 'createdOn']
        });

        if (!commentData) {
            return res.status(500).json({ error: 'Failed to retrieve the comment details.' });
        }

        res.status(200).json({
            message: 'Comment added successfully!',
            data: commentData
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment. Please try again.' });
    }
};