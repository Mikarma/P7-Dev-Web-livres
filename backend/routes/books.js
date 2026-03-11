const express = require("express");
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'images'),
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    callback(null, Date.now() + '_' + name);
  }
});

const upload = multer({ storage: storage });

// Création, modification et suppression
router.post('/', auth, upload.single('image'), bookCtrl.createBook);
router.put('/:id', auth, upload.single('image'), bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

// Récupération
router.get('/', bookCtrl.getAllBooks);
// Route existante
router.get('/best-rated', bookCtrl.getBestRatedBooks);

// Alias pour le frontend qui utilise /bestrating
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getBookById);


// Notation
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;