// Dependencies
const router = require('express').Router();
const logger = require('../utils/logger');
const CommentService = require('../lib/CommentService');
const { LOG_TYPES, STATUS_CODES } = require('../config/enum');

const commentService = new CommentService();

router.get('/comments/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await commentService.getAll(postId);
        
        res.send(comments);
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

router.post('/comment', async (req, res) => {
    try {
        const { comment, name, postId } = req.body;
        const id = await commentService.create(comment, name, postId);

        res.send({
            id,
            message: 'Comment created!'
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
router.delete('/comment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await commentService.delete(id);

        res.send({
            message: 'Comment deleted'
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
router.delete('/comments/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        await commentService.deleteAll(postId);

        res.send({
            message: 'Comments deleted'
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