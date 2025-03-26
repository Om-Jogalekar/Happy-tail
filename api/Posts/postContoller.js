const { Sequelize } = require('sequelize');
const Post = require('./postServices');
const User = require('../users/userServices');
const Comment = require('./commentModel');

exports.getAllPost = async (req, res) => {
    try {
        const posts = await Post.findAll({
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
                )`), 'commentCount']
            ],
            order: [['createdOn', 'DESC']]
        });

        // Fetch comments with correct alias
        const postIds = posts.map(post => post.id);

        const comments = await Comment.findAll({
            where: { postId: postIds },
            include: [
                {
                    model: User,      // Correct alias used here
                    as: 'User',        // Ensure it matches the defined alias
                    attributes: ['firstName', 'lastName']
                }
            ],
            attributes: ['id', 'postId', 'userId', 'content', 'createdOn']
        });

        const formattedPosts = posts.map(post => ({
            id: post.id,
            content: post.content,
            media: post.media,
            createdOn: post.createdOn,
            likeCount: post.dataValues.likeCount || 0,
            commentCount: post.dataValues.commentCount || 0,
            comments: comments
                .filter(comment => comment.postId === post.id)
                .map(comment => ({
                    id: comment.id,
                    fullName: comment.User
                        ? `${comment.User.firstName} ${comment.User.lastName}`
                        : "Unknown",
                    content: comment.content,
                    createdOn: comment.createdOn
                }))
        }));

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
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};