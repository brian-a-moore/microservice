// Dependencies
const router = require('express').Router();
const logger = require('../utils/logger');
const PostService = require('../lib/PostService');
const { LOG_TYPES, STATUS_CODES } = require('../config/enum');

const postService = new PostService();

router.get('/posts', async (req, res) => {
    try {
        const posts = await postService.getAll();
        
        res.send({ posts });
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postService.getById(id);

        res.send({ post });
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

router.post('/post', async (req, res) => {
    try {
        const { title, body, name } = req.body;
        const id = await postService.create(title, body, name);

        res.send({
            id,
            message: 'Post created!'
        });
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});
router.delete('/post/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await postService.delete(id);

        res.send({
            message: 'Post deleted'
        });
    } catch(e) {
        logger({
            type: LOG_TYPES.ERROR.type,
            message: e.message
        });

        res.status(STATUS_CODES.ERROR).send({
            message: e.message
        });
    }
});

module.exports = router;