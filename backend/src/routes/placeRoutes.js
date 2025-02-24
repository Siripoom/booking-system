import express from "express";
import {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.js";

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.post("/", createPlace);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

export default router;
