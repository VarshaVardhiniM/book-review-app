import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', author: '', description: '',
    genre: 'Fiction', coverImage: '', isbn: '', publishedYear: '',
  });

  useEffect(() => {
    const fetchBook = async () => {
      const { data } = await api.get(`/books/${id}`);
      setForm({
        title: data.title || '',
        author: data.author || '',
        description: data.description || '',
        genre: data.genre || 'Fiction',
        coverImage: data.coverImage || '',
        isbn: data.isbn || '',
        publishedYear: data.publishedYear || '',
      });
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/books/${id}`, form);
      toast.success('Book updated!');
      navigate(`/books/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating book');
    } finally { setLoading(false); }
  };

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Romance', 'Biography'];

  return (
    <div className='form-container'>
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <input name='title'       placeholder='Book Title'
          value={form.title}       onChange={handleChange} required />
        <input name='author'      placeholder='Author Name'
          value={form.author}      onChange={handleChange} required />
        <textarea name='description' placeholder='Description'
          value={form.description} onChange={handleChange} required />
        <select name='genre' value={form.genre} onChange={handleChange}>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <input name='coverImage'    placeholder='Cover image URL (optional)'
          value={form.coverImage}    onChange={handleChange} />
        <input name='isbn'          placeholder='ISBN (optional)'
          value={form.isbn}          onChange={handleChange} />
        <input name='publishedYear' placeholder='Published Year' type='number'
          value={form.publishedYear} onChange={handleChange} />
        <button type='submit' disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}