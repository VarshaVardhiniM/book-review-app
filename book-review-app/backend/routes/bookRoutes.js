const express = require('express');
const { getBooks, getBook, createBook, updateBook, deleteBook }
  = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

module.exports = router;
