const Review = require('../models/Review');
const Book   = require('../models/Book');
const mongoose = require('mongoose');

// Helper — recalculate book avg rating
const updateBookRating = async (bookId) => {
  const reviews = await Review.find({ book: bookId });
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : 0;
  await Book.findByIdAndUpdate(bookId, { avgRating, totalReviews });
  console.log(`Book updated → avgRating: ${avgRating}, totalReviews: ${totalReviews}`);
};

// GET /api/reviews/book/:bookId
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { book, rating, title, content } = req.body;
    const exists = await Review.findOne({ book, user: req.user._id });
    if (exists) return res.status(400).json({ message: 'Already reviewed this book' });
    const review = await Review.create({ book, user: req.user._id, rating, title, content });
    await updateBookRating(book);
    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('user', 'name avatar');
    await updateBookRating(review.book);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const bookId = review.book;
    await review.deleteOne();
    await updateBookRating(bookId);
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};