const express = require("express");
const router = express.Router();
const verifyJWT = require("../config/verify-jwt-token");
const blogController = require("../controllers/blog-controller");

//routes for blog
router.get("/api/blog/:page", blogController.getBlogs);
router.get("/api/blog/load/:_id", blogController.getBlog);
router.get("/api/blog/search/:query", blogController.search);
router.get("/api/blog/all/:writtenBy", verifyJWT, blogController.getAllBlogs);
router.get("/api/blog/list/pending", verifyJWT, blogController.getPendingBlogList);
router.post("/api/blog/:profileId/:actionType", verifyJWT, blogController.saveBlog);
router.put("/api/blog/:blogId/:actionType", verifyJWT, blogController.modifyBlog);
router.put("/api/blog/:blogId", verifyJWT, blogController.editBlog);
router.delete("/api/blog/:blogId", verifyJWT, blogController.discardBlog);

// routes for statistics
router.get("/api/blog/statistics/:writtenBy", blogController.getTotalBlog);
router.get("/api/blog/statistics/pending/:writtenBy", blogController.getTotalPendingBlog);

//routes for like
router.get("/api/:blogId/like/:userId", verifyJWT, blogController.saveLike);

//export router
module.exports = router;