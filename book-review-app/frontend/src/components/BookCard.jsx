import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function BookCard({ book, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    try {
      await api.delete(`/books/${book._id}`);
      toast.success('Book deleted!');
      onDelete(book._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting book');
    }
  };

  return (
    <div className='book-card'>
      <div className='book-card-img-wrap'>
        <img src={book.coverImage} alt={book.title} />
      </div>
      <div className='book-info'>
        <h3>{book.title}</h3>
        <p className='author'>by {book.author}</p>
        <span className='genre-badge'>{book.genre}</span>
        <StarRating rating={book.avgRating} />
        <p className='reviews'>({book.totalReviews} reviews)</p>

        <div className='card-actions'>
          <Link to={`/books/${book._id}`} className='btn'>View Details</Link>
        </div>

        {user && user._id === book.addedBy?._id && (
          <div className='card-actions' style={{ marginTop: '8px' }}>
            <button className='btn-edit'
              onClick={() => navigate(`/edit-book/${book._id}`)}>
              Edit
            </button>
            <button className='btn-delete' onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}