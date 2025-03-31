const Sequelize = require("../../config/dbSquelize");
const Question = require("./questionModel");
const Answer = require("./answerModel");
const User = require("../users/userServices");

// Create a Question
exports.createQuestion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const user_id = req.appUser.id;

        const question = await Question.create({ user_id, title, description: content, tags });
        if (!question) return res.status(400).json({ error: "Failed to create question" });

        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Questions with Answer Count
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Sequelize.query(
            `SELECT q.id, q.title, q.description, q.tags, q.createdOn, u.id as user_id, u.username, u.email,
            (SELECT COUNT(*) FROM answer_master a WHERE a.question_id = q.id) as answer_count
            FROM question_master q
            JOIN user_master u ON q.user_id = u.id`,
            { type: Sequelize.QueryTypes.SELECT }
        );
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Question with Answers
exports.getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch question details
        const question = await Sequelize.query(
            `SELECT q.id, q.title, q.description, q.tags, q.createdOn, u.id as user_id, u.username, u.email
            FROM question_master q
            JOIN user_master u ON q.user_id = u.id
            WHERE q.id = :id`,
            { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
        );

        if (!question.length) return res.status(404).json({ error: "Question not found" });

        // Fetch answers for the question
        const answers = await Sequelize.query(
            `SELECT a.id, a.content, a.createdOn, u.id as user_id, u.username
            FROM answer_master a
            JOIN user_master u ON a.user_id = u.id
            WHERE a.question_id = :id`,
            { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
        );

        res.status(200).json({ ...question[0], answers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Post an Answer
exports.createAnswer = async (req, res) => {
    try {
        const { question_id, content } = req.body;
        const user_id = req.appUser.id;

        const answer = await Answer.create({ question_id, user_id, content });
        res.status(201).json(answer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Answers for a Question
exports.getAnswersByQuestionId = async (req, res) => {
    try {
        const { id } = req.params;

        const answers = await Sequelize.query(
            `SELECT a.id, a.content, a.created_at, u.id as user_id, u.username
            FROM answer_master a
            JOIN user_master u ON a.user_id = u.id
            WHERE a.question_id = :id`,
            { replacements: { id }, type: Sequelize.QueryTypes.SELECT }
        );

        if (!answers.length) return res.status(404).json({ error: "No answers found" });
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};