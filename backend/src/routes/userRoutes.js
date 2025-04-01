import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  createUserCode,
  getUserCodes,
  editUserCode,
  deleteUserCode,
} from "../controllers/userCodeController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id/userCodes", getUserCodes);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/:id/userCodes", createUserCode);
router.put("/:id", updateUser);
router.put("/:id/userCodes/:codeId", editUserCode);
router.delete("/:id/userCodes/:codeId", deleteUserCode);
router.delete("/:id", deleteUser);

export default router;
