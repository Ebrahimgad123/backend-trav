import express from "express";
import { protect, restrictTo } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateUserSchema } from "../validation/schemas";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();
router.use(protect);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers);

router
  .route("/:id")
  .get(getUser)
  .patch(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

export default router;
