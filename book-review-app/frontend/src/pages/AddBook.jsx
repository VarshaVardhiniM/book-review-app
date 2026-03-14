import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AddBook() {
  const [form, setForm] = useState({
    title:'', author:'', description:'', genre:'Fiction',
    coverImage:'', isbn:'', publishedYear:'',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/books', form);
      toast.success('Book added!');
      navigate(`/books/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding book');
    } finally { setLoading(false); }
  };

  const genres = ['Fiction','Non-Fiction','Mystery','Sci-Fi','Romance','Biography'];

  return (
<div className='form-container'>
<h2>Add a New Book</h2>
<form onSubmit={handleSubmit}>
<input name='title'       placeholder='Book Title'   value={form.title}       onChange={handleChange} required />
<input name='author'      placeholder='Author Name'  value={form.author}      onChange={handleChange} required />
<textarea name='description' placeholder='Description' value={form.description} onChange={handleChange} required />
<select name='genre' value={form.genre} onChange={handleChange}>
          {genres.map(g =><option key={g} value={g}>{g}</option>)}
</select>
<input name='coverImage'    placeholder='Cover image URL (optional)'
          value={form.coverImage}    onChange={handleChange} />
<input name='isbn'          placeholder='ISBN (optional)'
          value={form.isbn}          onChange={handleChange} />
<input name='publishedYear' placeholder='Published Year' type='number'
          value={form.publishedYear} onChange={handleChange} />
<button type='submit' disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
</button>
</form>
</div>
  );
}
