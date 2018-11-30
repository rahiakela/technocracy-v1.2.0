const express=require("express");
const router=express.Router();
const verifyJWT = require("../config/verify-jwt-token");
const commentController=require("../controllers/comment-controller");

//routes for Blog's comment
router.post("/api/comment/:userId/:blogId", verifyJWT, commentController.saveBlogComment);
router.put("/api/blog/comment/:blogId/:actionType", verifyJWT, commentController.editBlogCommentReply);
router.delete("/api/blog/comment/:blogId/:commentId", verifyJWT, commentController.deleteBlogComment);
router.delete("/api/blog/comment/reply/:blogId/:replyId", verifyJWT, commentController.deleteBlogReply);

//routes for Question's comment
router.post("/api/question/comment/:userId/:questionId", verifyJWT, commentController.saveQuestionComment);
router.put("/api/question/comment/:questionId/:actionType", verifyJWT, commentController.editQuestionCommentReply);
router.delete("/api/question/comment/:questionId/:actionId/:actionType", verifyJWT, commentController.deleteQuestionCommentAndReply);

//routes for Comment like
router.get("/api/comment/:userId/:_id/like/:commentId", verifyJWT, commentController.saveCommentLike);

//routes for Comment reply
router.post("/api/reply/:userId/:_id/:commentId", verifyJWT, commentController.saveReply);
//routes for Comment reply like
router.get("/api/reply/:userId/:_id/:commentId/like/:replyId", verifyJWT, commentController.saveReplyLike);

//export router
module.exports=router;