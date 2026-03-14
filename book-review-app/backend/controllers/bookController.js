const Book = require('../models/Book');

// GET /api/books  — with search, genre filter, pagination
exports.getBooks = async (req, res, next) => {
  try {
    const { search, genre, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
    if (genre) query.genre = genre;
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json({ books, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) { next(err); }
};

// GET /api/books/:id
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) { next(err); }
};

// POST /api/books
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json(book);
  } catch (err) { next(err); }
};

// PUT /api/books/:id
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /api/books/:id
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (err) { next(err); }
};
