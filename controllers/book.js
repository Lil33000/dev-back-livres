import Book from "../models/Book.js";
import fs from "fs";
import optimizeImage from "../utiles/sharp.js";

const createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    const fileName = await optimizeImage(req.file);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/${fileName}`,
    });
    await book.save();
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    res.status(400).json({ error }); // 400 car erreur potentiel de donné via mongo
  }
};

const modifyBook = async (req, res) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    delete bookObject._userId;
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );
    res.status(200).json({ message: "Livre modifié!" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    const filename = book.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async () => {
      await Book.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Livre supprimé !" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getOneBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error });
  }
};

//NOTATION

const getBookRatings = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.status(200).json(book.ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateAverageRating = (book, ratingObject) => {
  const ratings = [...book.ratings, ratingObject];
  const totalGrade = ratings.reduce((acc, rating) => acc + rating.grade, 0);
  return Math.round((totalGrade / ratings.length) * 10) / 10;
};

const alreadyRated = (userId, ratings) => {
  return ratings.some((rating) => rating.userId == userId);
};

const addRating = async (req, res) => {
  try {
    const ratingObject = { ...req.body, grade: req.body.rating };
    delete ratingObject.rating;

    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    if (alreadyRated(req.body.userId, book.ratings)) {
      return res.status(403).json({ message: "Vous avez déjà noté ce livre" });
    }

    const averageRating = calculateAverageRating(book, ratingObject);
    await Book.updateOne(
      { _id: req.params.id },
      { $push: { ratings: ratingObject }, averageRating }
    );

    const updatedBook = await Book.findOne({ _id: req.params.id });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default {
  createBook,
  modifyBook,
  deleteBook,
  getOneBook,
  getAllBooks,
  addRating,
  getBookRatings,
  getBestRatedBooks
};
