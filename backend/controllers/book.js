// controllers/book.js
const Book = require('../models/Book');

// POST : créer un livre avec gestion image et note initiale
exports.createBook = (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image requise' });
    if (!req.body.book) return res.status(400).json({ message: 'Données du livre manquantes' });

    const bookObject = JSON.parse(req.body.book);
    const userId = req.auth.userId;

    let rating = req.body.rating;
    if (rating) {
      rating = Number(rating);
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
      }
    }

    const book = new Book({
      ...bookObject,
      userId: userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      ratings: rating ? [{ userId, grade: rating }] : [],
      averageRating: rating ? rating : 0
    });

    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !', book }))
      .catch(error => res.status(400).json({ error }));

  } catch (error) {
    console.error('Erreur création livre:', error);
    res.status(400).json({ message: 'Erreur lors de la création du livre', error });
  }
};

// GET : tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// GET : un livre par ID
exports.getBookById = (req, res) => {
  const { id } = req.params;
  Book.findById(id)
    .then(book => {
      if (!book) return res.status(404).json({ error: 'Livre non trouvé' });
      res.status(200).json(book);
    })
    .catch(error => res.status(400).json({ error: 'ID invalide ou erreur serveur' }));
};

// PUT : modifier un livre
exports.updateBook = (req, res) => {
  const { id } = req.params;
  let bookObject;

  if (req.file) {
    bookObject = JSON.parse(req.body.book);
    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  } else {
    bookObject = req.body;
  }

  Book.updateOne({ _id: id }, { ...bookObject, _id: id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// DELETE : supprimer un livre
exports.deleteBook = (req, res) => {
  const { id } = req.params;
  Book.deleteOne({ _id: id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};

// GET : meilleurs livres (top 10)
exports.getBestRatedBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(2)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// POST : noter un livre existant
exports.rateBook = (req, res) => {
  const { id } = req.params;
  const userId = req.auth.userId;
  const grade = req.body.grade || req.body.rating;

  if (!grade || grade < 1 || grade > 5) {
    return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
  }

  Book.findById(id)
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

      const existingRatingIndex = book.ratings.findIndex(r => r.userId.toString() === userId);

      if (existingRatingIndex !== -1) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      }

      book.ratings.push({ userId, grade });

      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      return book.save();
    })
    .then(updatedBook => res.status(200).json(updatedBook))
    .catch(error => res.status(400).json({ error }));
};