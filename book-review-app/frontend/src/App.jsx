import { Routes, Route } from 'react-router-dom';
import Navbar         from './components/Navbar';
import Home           from './pages/Home';
import Books          from './pages/Books';
import BookDetail     from './pages/BookDetail';
import AddBook        from './pages/AddBook';
import EditBook       from './pages/EditBook';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <main className='container'>
        <Routes>
          <Route path='/'          element={<Home />} />
          <Route path='/books'     element={<Books />} />
          <Route path='/books/:id' element={<BookDetail />} />
          <Route path='/login'     element={<Login />} />
          <Route path='/register'  element={<Register />} />
          <Route path='/add-book'  element={
            <ProtectedRoute><AddBook /></ProtectedRoute>
          } />
          <Route path='/edit-book/:id' element={
            <ProtectedRoute><EditBook /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}