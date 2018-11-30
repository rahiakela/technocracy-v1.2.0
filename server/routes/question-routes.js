const express = require("express");
const router = express.Router();
const verifyJWT = require("../config/verify-jwt-token");
const questionController = require("../controllers/question-controller");

//routes for question
router.get("/api/question/:page", questionController.getQuestions);
router.get("/api/question/load/:_id", questionController.getQuestion);
router.get("/api/question/all/:askedBy", verifyJWT, questionController.getAllQuestions);
router.get("/api/question/list/pending", verifyJWT, questionController.getPendingQuestionList);
router.post("/api/question/:userId/:actionType", verifyJWT, questionController.saveQuestion);
router.put("/api/question/:questionId/:actionType", verifyJWT, questionController.modifyQuestion);
router.put("/api/question/:questionId", verifyJWT, questionController.editQuestion);
router.delete("/api/question/:questionId", verifyJWT, questionController.deleteQuestion);

// routes for statistics
router.get("/api/question/statistics/:userId", questionController.getTotalQuestion);
router.get("/api/question/statistics/pending/:userId", questionController.getTotalPendingQuestion);

//routes for like
router.get("/api/question/like/:_id/:userId", verifyJWT, questionController.saveLike);

//routes for vote up and down
router.get("/api/question/voteup/:_id/:userId", verifyJWT, questionController.voteUp);
router.get("/api/question/votedown/:_id/:userId", verifyJWT, questionController.voteDown);

//export router
module.exports = router;