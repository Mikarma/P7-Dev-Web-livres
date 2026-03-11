const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require('mongoose');
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://Mikarma:supporttechnique22@cluster0.ysrlpce.mongodb.net/test2?appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));


app.use(cors());
app.use(express.json());
// serve images under the /images path
app.use('/images', express.static(path.join(__dirname, "images")));

app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
