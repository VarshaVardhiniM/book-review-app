const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  author:      { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre:       { type: String, required: true },
  coverImage:  { type: String, default: 'https://via.placeholder.com/200x300' },
  isbn:        { type: String, unique: true, sparse: true },
  publishedYear: { type: Number },
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avgRating:   { type: Number, default: 0 },
  totalReviews:{ type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
