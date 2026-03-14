import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook]       = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', content: '' });
  const [editingReview, setEditingReview] = useState(null); // which review is being edited

  const loadData = async () => {
    const [b, r] = await Promise.all([
      api.get(`/books/${id}`),
      api.get(`/reviews/book/${id}`),
    ]);
    setBook(b.data);
    setReviews(r.data);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Submit new review
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { book: id, ...newReview });
      setNewReview({ rating: 5, title: '', content: '' });
      toast.success('Review added!');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  // Start editing a review
  const startEdit = (review) => {
    setEditingReview({
      _id: review._id,
      rating: review.rating,
      title: review.title,
      content: review.content,
    });
  };

  // Submit edited review
  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/reviews/${editingReview._id}`, {
        rating: editingReview.rating,
        title: editingReview.title,
        content: editingReview.content,
      });
      setEditingReview(null);
      toast.success('Review updated!');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted!');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className='book-detail'>
      <div className='book-header'>
        <img src={book.coverImage} alt={book.title} />
        <div>
          <h1>{book.title}</h1>
          <h3>by {book.author}</h3>
          <StarRating rating={book.avgRating} />
          <p>{book.avgRating} / 5 ({book.totalReviews} reviews)</p>
          <p className='genre-badge'>{book.genre}</p>
          <p>{book.description}</p>
        </div>
      </div>

      <h2>Reviews</h2>

      {/* Add new review form — only if user hasn't reviewed yet */}
      {user && !reviews.find(r => r.user?._id === user._id) && (
        <form onSubmit={submitReview} className='review-form'>
          <h3>Write a Review</h3>
          <StarRating
            rating={newReview.rating}
            onChange={(r) => setNewReview(p => ({ ...p, rating: r }))}
          />
          <input
            placeholder='Review title'
            value={newReview.title}
            onChange={e => setNewReview(p => ({ ...p, title: e.target.value }))}
            required
          />
          <textarea
            placeholder='Your review...'
            value={newReview.content}
            onChange={e => setNewReview(p => ({ ...p, content: e.target.value }))}
            required
          />
          <button type='submit'>Submit Review</button>
        </form>
      )}

      {reviews.length === 0 && (
        <p style={{ color: 'var(--muted)', marginTop: '16px' }}>
          No reviews yet. Be the first to review!
        </p>
      )}

      {reviews.map(r => (
        <div key={r._id} className='review-card'>

          {/* Edit mode */}
          {editingReview?._id === r._id ? (
            <form onSubmit={submitEdit}>
              <StarRating
                rating={editingReview.rating}
                onChange={(val) => setEditingReview(p => ({ ...p, rating: val }))}
              />
              <input
                value={editingReview.title}
                onChange={e => setEditingReview(p => ({ ...p, title: e.target.value }))}
                required
                style={{ marginBottom: '8px' }}
              />
              <textarea
                value={editingReview.content}
                onChange={e => setEditingReview(p => ({ ...p, content: e.target.value }))}
                required
                style={{ marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type='submit'>Save</button>
                <button type='button' onClick={() => setEditingReview(null)}
                  style={{ background: 'var(--muted)' }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* View mode */
            <>
              <strong>{r.title}</strong>
              <StarRating rating={r.rating} />
              <p>{r.content}</p>
              <small>— {r.user?.name} • {new Date(r.createdAt).toLocaleDateString()}</small>

              {/* Edit/Delete buttons — only for review owner */}
              {user?._id === r.user?._id && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={() => startEdit(r)}
                    style={{
                      padding: '6px 14px', fontSize: '0.85rem',
                      background: 'var(--primary)', color: '#fff',
                      border: 'none', borderRadius: '6px', cursor: 'pointer'
                    }}>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReview(r._id)}
                    style={{
                      padding: '6px 14px', fontSize: '0.85rem',
                      background: '#dc2626', color: '#fff',
                      border: 'none', borderRadius: '6px', cursor: 'pointer'
                    }}>
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}