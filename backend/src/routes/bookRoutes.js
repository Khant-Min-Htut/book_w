import express from "express";
import {
  deleteBook,
  getAllBook,
  postBook,
  recommendedbooks,
} from "../controllers/booksController.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, postBook);
router.get("/", protectRoute, getAllBook);
router.delete("/:id", protectRoute, deleteBook);
router.get("/user", protectRoute, recommendedbooks);

export default router;
