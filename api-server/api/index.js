// Dependencies
const router = require('express').Router();
const logger = require('../utils/logger');
const { LOG_TYPES, STATUS_CODES, ENVIRONMENTS } = require('../config/enum');
const PostService = require('../services/PostService');
const CommentService = require('../services/CommentService');
const config = require('../config')[process.env.NODE_ENV || ENVIRONMENTS.DEV];

// Services
const postService = new PostService(config);
const commentService = new CommentService(config);

// Get Posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await postService.getPosts();

        res.send({ posts });
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(e.status || STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

// Get a post
router.get('/post/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postService.getPost(id);
        const comments = await commentService.getComments(id);

        post.comments = comments;

        res.send({ post });
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(e.status || STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

// Create a post
router.post('/post', async (req, res) => {
    try {
        const result = await postService.createPost(req.body);
        res.send(result);
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(e.status || STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

// Create a comment
router.post('/comment', async (req, res) => {
    try {
        const result = await commentService(req.body);
        res.send(result);
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(e.status || STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

// Delete a post
router.delete('/post/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await postService.deletePost(id);
        await commentService.deleteComments(id);
        res.send(result);
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(e.status || STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

// Delete a comment
router.delete('/comment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await commentService.deleteComment(id);
        res.send(result);
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(e.status || STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});