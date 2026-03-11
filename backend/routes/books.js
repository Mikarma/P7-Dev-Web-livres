const express = require("express");
const Book = require('../models/Book');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    callback(null, Date.now() + '_' + name);
  }
});

const upload = multer({ storage: storage });

router.post('/', auth, upload.single('image'), bookCtrl.createBook);
router.get("/", bookCtrl.getAllBooks);
router.put('/:id', auth, upload.single('image'), bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getBookById);

module.exports = router;
