// external import
import express from "express";

// internal import
import userController from "../controller/user";

// create router
const router = express.Router();

// routes

/**
 * @description - get user
 */
router.get("/:userId", userController.getUser);

/**
 * @description - get all user
 */
router.get("/", userController.getAllUser);

router.post("/create-blog", userController.createPostByUser);

/**
 * @description - update user
 */
router.patch("/:userId", userController.modifyUser);

/**
 * @description - delete user
 */
router.delete("/:userId", userController.removeUser);

// export
export default router;