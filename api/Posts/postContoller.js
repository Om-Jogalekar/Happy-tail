const { Sequelize } = require('sequelize');
const Post = require('../Posts/postServices');
const User = require('../users/userServices');

exports.getAllPost = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                as: 'User', // Alias is 'User'
                attributes: ['firstName', 'lastName'],
            },
            order: [['createdOn', 'DESC']],
            attributes: ['id', 'userId', 'content', 'media', 'createdOn'],
        });

        const formattedPosts = posts.map(post => {
            const fullName = post.User
                ? post.User.firstName + " " + post.User.lastName
                : "Unknown";

            return {
                id: post.id,
                fullName: fullName,
                content: post.content,
                media: post.media,
                createdOn: post.createdOn,
            }
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
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