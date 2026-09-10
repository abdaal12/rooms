# 🏠 RoomRent — MERN Stack Room Rental Platform

A full-stack room rental platform built with MongoDB, Express, React, and Node.js.

---

## 🗂 Project Structure

```
roomrent/
├── server/                        # Express + MongoDB backend
│   ├── index.js                   # Entry point
│   ├── .env                       # Environment variables
│   ├── models/
│   │   ├── Admin.js               # Admin account (bcrypt password)
│   │   ├── Property.js            # Property listings
│   │   └── LeadRequest.js         # Callback & urgent call leads
│   ├── middleware/
│   │   └── auth.js                # JWT protect middleware
│   ├── routes/
│   │   ├── auth.js                # Login / register / me
│   │   ├── properties.js          # CRUD (public GET, admin POST/DELETE)
│   │   └── leads.js               # Submit lead (public), view (admin)
│   ├── utils/
│   │   └── email.js               # Nodemailer HTML email to admin
│   └── uploads/                   # Uploaded property images (auto-created)
│
└── client/                        # React frontend
    ├── .env                       # Frontend environment variables
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                 # Router + AuthProvider
        ├── api.js                 # Axios instance + all API calls
        ├── index.css              # Global design system
        ├── context/
        │   └── AuthContext.js     # Admin login state
        ├── components/
        │   ├── Navbar.js          # Visitor vs admin navbar
        │   ├── PropertyCard.js    # Card with "View Location" button
        │   ├── LocationPopup.js   # Popup: map + callback form + urgent call
        │   └── ProtectedRoute.js  # Redirects guests from admin pages
        └── pages/
            ├── HomePage.js        # Browse + search + filter
            ├── AdminLoginPage.js  # Login + register tabs
            ├── AdminDashboard.js  # Properties + leads management
            └── AddPropertyPage.js # Add new property form
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local install OR [MongoDB Atlas](https://www.mongodb.com/atlas) (free)
- **Gmail account** — for email notifications

---

## 🚀 Setup Instructions

### Step 1 — Install dependencies

```bash
# Backend
cd server
npm install

# Frontend (new terminal)
cd client
npm install
```

---

### Step 2 — Configure server `.env`

Open `server/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roomrent

JWT_SECRET=your_strong_random_secret_here

# Gmail SMTP (for lead email notifications)
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_digit_app_password
ADMIN_EMAIL=yourgmail@gmail.com
```

#### How to get Gmail App Password:
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → App Passwords
3. Select "Mail" → Generate
4. Copy the 16-digit password into `EMAIL_PASS`

---

### Step 3 — Configure client `.env`

Open `client/.env` and fill in your admin contact number:

```env
REACT_APP_API_URL=http://localhost:5000/api

# Your single contact number (used for Urgent Call & WhatsApp)
REACT_APP_ADMIN_PHONE=+923001234567
REACT_APP_ADMIN_WHATSAPP=923001234567
```

> ⚠️ `REACT_APP_ADMIN_PHONE` needs `+` and country code  
> ⚠️ `REACT_APP_ADMIN_WHATSAPP` needs digits only, no `+` or spaces

---

### Step 4 — Start the servers

**Terminal 1 — Backend:**
```bash
cd server
npm start
# or for auto-reload:
npx nodemon index.js
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

Open **http://localhost:3000** in your browser.

---

### Step 5 — Create your admin account

1. Go to **http://localhost:3000/admin/login**
2. Click **"Create Account"** tab
3. Fill your name, email, and password
4. Click **"Create Admin Account"**
5. You are now logged in as admin ✅

> 💡 After first setup, you can remove the "Create Account" tab from `AdminLoginPage.js` if you want to prevent others from registering.

---

## 📱 How It Works

### For Visitors (No login required)
| Action | Description |
|--------|-------------|
| Browse | View all listed properties on the home page |
| Search | Type area, sector, phase, or city in the search bar |
| Filter | Filter by room type or max price |
| View Location | Click button on any card → see map + contact options |
| Callback Request | Fill name, phone, WhatsApp → saved in DB + email sent to admin |
| Urgent Call | One tap → opens phone dialer with admin number |
| WhatsApp | Opens WhatsApp chat with pre-filled message |

### For Admin (Login required)
| Action | Description |
|--------|-------------|
| Add Property | Title, address, area, price, images, amenities, owner contact |
| Delete Property | Remove any listing with confirmation |
| View Leads | See all callback requests and urgent calls |
| Update Lead Status | Mark leads as New → Contacted → Done |
| Call / WhatsApp | Direct action buttons on each lead card |

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create admin account |
| POST | `/api/auth/login` | Public | Login, get JWT token |
| GET | `/api/auth/me` | Admin | Verify token |

### Properties
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/properties` | Public | List all (search, filter, paginate) |
| GET | `/api/properties/:id` | Public | Get single property |
| POST | `/api/properties` | Admin | Add property (multipart/form-data) |
| DELETE | `/api/properties/:id` | Admin | Delete property |

### Leads
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/leads` | Public | Submit callback / urgent call |
| GET | `/api/leads` | Admin | Get all leads |
| PATCH | `/api/leads/:id/status` | Admin | Update lead status |

---

## 🌐 Deployment

### Backend (Railway / Render / Heroku)
1. Set all environment variables from `server/.env`
2. Set `MONGODB_URI` to your Atlas connection string
3. Make sure `uploads/` folder is writable

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend-url.com/api`
2. Set `REACT_APP_ADMIN_PHONE` and `REACT_APP_ADMIN_WHATSAPP`
3. Run `npm run build` → deploy `build/` folder

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Pure CSS with design tokens |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Images | Multer (local storage) |
| Email | Nodemailer + Gmail SMTP |
| Notifications | react-hot-toast |
| Fonts | Playfair Display + Inter |