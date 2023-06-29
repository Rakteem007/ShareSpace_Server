import {Router} from "express";
import {getFeedPosts , getUserPosts , likePost } from "../controllers/posts.js";
import {verifyTokens} from "../middleware/auth.js";

var router = Router();

//read 
router.get("/" , verifyTokens , getFeedPosts);
router.get("/:userId/posts",verifyTokens , getUserPosts);

//update
router.patch("/:id/like", verifyTokens , likePost);

export default router;