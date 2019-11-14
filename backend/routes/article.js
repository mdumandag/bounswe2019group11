const express = require('express');
const articleService = require('../services/article');
const errors = require('../helpers/errors');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await articleService.getAll();
        res.status(200).json(response);

    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        const response = await articleService.getById(ID);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'ArticleNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const {title, body} = req.body;
        const authorId = req.token.data._id;
        const response = await articleService.create(title, body, authorId);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const causes = [];
            for (const field in err.errors) {
                switch (err.errors[field].message) {
                    case 'InvalidTitle':
                        causes.push(errors.INVALID_TITLE());
                        break;
                    case 'InvalidBody':
                        causes.push(errors.INVALID_BODY());
                        break;
                    default:
                        causes.push(errors.UNKNOWN_VALIDATION_ERROR(err.errors[field]));
                }
            }
            res.status(400).send(errors.VALIDATION_ERROR(causes));
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const Id = req.params.userId;
        const response = await articleService.getByUserId(Id);
        res.status(200).json(response);
    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/comment', isAuthenticated, async (req, res) => {
    try {
        const articleId = req.params.id;
        const userId = req.token.data._id;
        const body = req.body.body;
        await articleService.postComment(articleId, userId, body);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'ArticleNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'ValidationError') {
            const causes = [];
            for (const field in err.errors) {
                if (err.errors[field].message === 'InvalidBody') {
                    causes.push(errors.INVALID_BODY());
                } else {
                    causes.push(errors.UNKNOWN_VALIDATION_ERROR(err.errors[field]));
                }
            }
            res.status(400).send(errors.VALIDATION_ERROR(causes));
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:id/comment/:commentId', async (req, res) => {
    try {
        const articleId = req.params.id;
        const commentId = req.params.commentId;
        const comment = await articleService.getComment(articleId, commentId);
        res.status(200).send(comment);
    } catch (err) {
        if (err.name === 'CommentNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'ArticleNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/comment/:commentId', async (req, res) => {
    try {
        const articleId = req.params.id;
        const commentId = req.params.commentId;
        const newBody = req.body.body;
        await articleService.editComment(articleId, commentId, newBody);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'ArticleNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'CommentNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'ValidationError') {
            const causes = [];
            for (const field in err.errors) {
                if (err.errors[field].message === 'InvalidBody') {
                    causes.push(errors.INVALID_BODY());
                } else {
                    causes.push(errors.UNKNOWN_VALIDATION_ERROR(err.errors[field]));
                }
            }
            res.status(400).send(errors.VALIDATION_ERROR(causes));
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.delete('/:id/comment/:commentId', isAuthenticated, async (req, res) => {
    try {
        const articleId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.token.data._id;
        await articleService.deleteComment(articleId, commentId, userId);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'ArticleNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'CommentNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});
module.exports = router;
