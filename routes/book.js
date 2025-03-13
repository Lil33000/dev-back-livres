import multer from "../middleware/multer-config.js";
import express from "express";
import bookCtrl from "../controllers/book.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, multer,bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addRating);

router.put("/:id", auth, multer, bookCtrl.modifyBook);

router.delete("/:id", auth, bookCtrl.deleteBook);

router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);
router.get("/:id/ratings", bookCtrl.getBookRatings);

export default router;
