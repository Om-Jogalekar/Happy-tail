const express = require('express');
const router = express.Router();
const CommunityController = require('./CommunityController');

router.post('/questions', CommunityController.createQuestion);
router.get('/questions', CommunityController.getAllQuestions);
router.get('/questions/:id', CommunityController.getQuestionById);

router.post('/answers', CommunityController.createAnswer);
router.get('/answers/:id', CommunityController.getAnswersByQuestionId);

module.exports = router;
