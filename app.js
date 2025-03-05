import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bookRoutes from "./routes/book.js";
import userRoutes from "./routes/user.js";

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.KEY_CLUSTER}@cluster0.b3yhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.error("Connexion à MongoDB échouée !", error);
  }
};

connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static("images"));

export default app;
