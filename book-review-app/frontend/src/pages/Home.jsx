import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='hero'>
      <div className='hero-badge'>Your Reading Community</div>
      <h1>Welcome to <span>Bookly</span></h1>
      <p>Discover, read, and share honest reviews with fellow book lovers.</p>
      <div className='hero-btns'>
        <Link to='/books'    className='btn btn-primary'>Browse Books</Link>
        <Link to='/register' className='btn btn-outline'>Join Bookly</Link>
      </div>
    </div>
  );
}