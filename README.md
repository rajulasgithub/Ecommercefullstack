# Ecommerce Fullstack App

This is a MERN stack (MongoDB, Express, React, Node.js) ecommerce application.

## Project Structure
- `backend/`: Node.js Express server with MongoDB connection, authentication, product, cart, order, wishlist, and review management.
- `ecommerceapp/`: React frontend application.

## Environment Setup
Make sure to create `.env` files in the respective directories based on the required environment variables.

### Backend `.env`
See `backend/README.md` for specific environment variables.

### Frontend `.env`
See `ecommerceapp/README.md` for specific environment variables.

## Scripts & Running
From the root, you can start the backend and frontend separately.
- Backend: `cd backend && npm run dev`
- Frontend: `cd ecommerceapp && npm start`

## Features
- User Authentication (Local and Google Auth)
- Product Management (CRUD operations for Sellers)
- Shopping Cart & Wishlist
- Order Management
- Product Reviews and Ratings
- Email Notifications (via Nodemailer)
