# Bookly — Book Review Application

> Discover, read, and share honest reviews with fellow book lovers.

A full-stack web application built with the **MERN stack** where users can browse books, write reviews, rate them with stars, and manage their own content.

---

## Features

- Register and login with JWT authentication
- Browse all books in a responsive grid
- Search by title or author, filter by genre
- Star ratings with automatic average calculation
- Write, edit, and delete your own reviews
- Add new books with cover image and description
- Edit and delete your own books
- Reset password directly from login page
- Pagination for large book collections
- Toast notifications for all actions
- Smooth animations and hover effects

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 5.x | REST API framework |
| MongoDB Atlas | Cloud | NoSQL database |
| Mongoose | 9.x | MongoDB ODM |
| JWT | 9.x | Authentication tokens |
| bcryptjs | 3.x | Password hashing |
| dotenv | 17.x | Environment variables |
| cors | 2.x | Cross-origin requests |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18+ | UI library |
| Vite | 5.x | Build tool |
| React Router DOM | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| React Hot Toast | 2.x | Notifications |

---

## Project Structure
```
book-review-app/
├── backend/
│   ├── server.js              ← Entry point
│   ├── .env                   ← Environment variables (not in git)
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── reviewRoutes.js
│   └── middleware/
│       ├── auth.js
│       └── errorHandler.js
│
└── frontend/
    ├── index.html
    ├── .env                   ← Environment variables (not in git)
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── assets/
        │   └── logo1.png
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── BookCard.jsx
        │   ├── StarRating.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Home.jsx
            ├── Books.jsx
            ├── BookDetail.jsx
            ├── AddBook.jsx
            ├── EditBook.jsx
            ├── Login.jsx
            └── Register.jsx
```

---

## MongoDB Atlas Setup

> MongoDB Atlas is the cloud database used by Bookly. Follow these steps before running the app.

### Step 1 — Create a free account
- Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Sign up for a free account

### Step 2 — Create a free cluster
- Click **"Build a Database"**
- Choose **Free (M0)** tier
- Select provider: **AWS**
- Select region: closest to you (e.g. Mumbai ap-south-1)
- Name: `Cluster0`
- Click **"Create Cluster"** — takes 1-2 minutes

### Step 3 — Create a database user
- Go to **Security → Database Access**
- Click **"Add New Database User"**
- Choose **Password** authentication
- Set a username and strong password
- Role: **Atlas Admin**
- Click **"Add User"**

> Save your username and password — you will need them for the connection string.

### Step 4 — Allow network access
- Go to **Security → Network Access**
- Click **"Add IP Address"**
- Click **"Allow Access From Anywhere"** — fills `0.0.0.0/0` automatically
- Click **"Confirm"**

> This allows your local machine and deployed server to connect. For production, restrict to specific IPs.

### Step 5 — Get your connection string
- Go to **Database → Connect**
- Choose **"Drivers"**
- Select **Node.js**
- Copy the connection string — it looks like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
- Replace `<username>` and `<password>` with your database user credentials
- Add `/bookreviews` before the `?` to set the database name:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookreviews?retryWrites=true&w=majority
```
- Paste this as `MONGO_URI` in your `backend/.env` file

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/VarshaVardhiniM/book-review-app.git
cd book-review-app
```

### 2. Setup MongoDB Atlas
Follow the **MongoDB Atlas Setup** section above and get your `MONGO_URI` connection string.

### 3. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bookreviews?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```
```bash
npm run dev
# Expected: MongoDB connected | Server running on port 5000
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
# Expected: Local: http://localhost:5173
```

### 5. Open browser
```
http://localhost:5173
```

> **Note:** Keep both terminals running at the same time — one for backend, one for frontend.

---

## API Endpoints

### Auth Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get token |
| GET | `/api/auth/me` | Protected | Get current user |
| POST | `/api/auth/reset-password` | Public | Reset password by email |

### Book Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/books` | Public | Get all books (search, filter, paginate) |
| GET | `/api/books/:id` | Public | Get single book |
| POST | `/api/books` | Protected | Add a new book |
| PUT | `/api/books/:id` | Protected | Update book (owner only) |
| DELETE | `/api/books/:id` | Protected | Delete book (owner only) |

### Review Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reviews/book/:bookId` | Public | Get all reviews for a book |
| POST | `/api/reviews` | Protected | Create a review |
| PUT | `/api/reviews/:id` | Protected | Update review (owner only) |
| DELETE | `/api/reviews/:id` | Protected | Delete review (owner only) |

---

## Environment Variables

### `backend/.env`
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |

### `frontend/.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Known Issues Fixed

| Issue | Fix Applied |
|---|---|
| JWT token not sent | Fixed `split(' ')` space character in auth middleware |
| avgRating not updating | Replaced `aggregate()` with manual `find()` + average |
| Books showing stale data | Added `location.key` to `useEffect` dependencies |
| Register 500 error | Removed `next()` from async controllers (Express v5) |
| Search box invisible | Added explicit white background and border to input |

---

## Scripts

### Backend
```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start without auto-restart
```

### Frontend
```bash
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

---

## Author

**Varsha Vardhini**
- GitHub: [@VarshaVardhiniM](https://github.com/VarshaVardhiniM)

---

> Built with MongoDB, Express.js, React.js, and Node.js
