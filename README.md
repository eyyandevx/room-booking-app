# RoomBook - Online Room Booking Application

A user-friendly web application for booking rooms across major cities in Pakistan.

## Features

✅ User Authentication (Signup & Login with JWT)
✅ City-based Room Filtering (Karachi, Lahore, Islamabad, etc.)
✅ Real-time Room Availability
✅ Booking with Date Selection
✅ Dynamic Price Calculation
✅ Responsive & Mobile-Friendly UI
✅ Secure Password Hashing
✅ Professional Dashboard

## Project Structure

```
room-booking-app/
├── frontend/          # React + Tailwind CSS
├── backend/           # Node.js + Express
└── README.md
```

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt (Password Hashing)

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/room-booking" > .env
echo "JWT_SECRET=your_super_secret_jwt_key_change_this" >> .env
echo "PORT=5000" >> .env

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` 🎉

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Rooms
- `GET /api/rooms` - Get rooms by city
- `GET /api/rooms/:id` - Get room details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings

## Cities Supported

- Karachi
- Lahore
- Islamabad
- Rawalpindi
- Multan
- Peshawar
- Quetta
- Faisalabad

## License

MIT
