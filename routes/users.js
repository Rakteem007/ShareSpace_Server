import { Router } from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriends
} from "../controllers/users.js";
import { verifyTokens } from "../middleware/auth.js";

const router = Router();

//Read
router.get("/:id", verifyTokens , getUser);
router.get("/:id/:friends" , verifyTokens , getUserFriends);

//Update
router.patch("/:id/:friendId", verifyTokens, addRemoveFriends );

export default router;