import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo2.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className='navbar'>
      <Link to='/' className='brand'>
        <img src={logo} alt='BookReview Logo' className='brand-logo' />
        <span className='brand-name'>Book<span>ly</span></span>
      </Link>

      <div className='nav-links'>
        <Link to='/books'>Books</Link>
        {user ? (
          <>
            <Link to='/add-book' className='nav-add-book'>+ Add Book</Link>
            <span className='nav-greeting'>Hi, {user.name}</span>
            <button className='nav-logout' onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}