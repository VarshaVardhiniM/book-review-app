import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

export default function Books() {
  const [books, setBooks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [genre, setGenre]         = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/books', {
          params: { search, genre, page, limit: 9 },
        });
        setBooks(data.books);
        setTotalPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [search, genre, page, location.key]);

  const handleDelete = (deletedId) => {
    setBooks(prev => prev.filter(b => b._id !== deletedId));
    setTotal(prev => prev - 1);
  };

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Romance', 'Biography'];

  return (
    <div>
      <div className='books-page-header'>
        <h1>All Books</h1>
        {!loading && <span className='books-count'>{total} books found</span>}
      </div>

      <div className='filters'>
        <input
          placeholder='Search title or author...'
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={genre} onChange={e => { setGenre(e.target.value); setPage(1); }}>
          <option value=''>All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div className='loading'></div>
      ) : books.length === 0 ? (
        <div className='empty-state'>
          <p>No books found. Try a different search!</p>
        </div>
      ) : (
        <div className='books-grid'>
          {books.map(b => (
            <BookCard key={b._id} book={b} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className='pagination'>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}