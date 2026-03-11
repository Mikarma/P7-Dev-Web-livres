// controllers/book.js

const Book = require('../models/Book');

// POST un livre
exports.createBook =(req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};


// GET tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// PUT un livre par id
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

// DELETE un livre par id
exports.deleteBook = (req, res) => {
  const { id } = req.params;
  Book.deleteOne({ _id: id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};

// GET un livre par id
exports.getBookById = (req, res) => {
  const { id } = req.params;
  Book.findById(id)
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
      return res.status(200).json(book);
    })
    .catch(error => res.status(400).json({ error: 'ID invalide ou erreur serveur' }));
};