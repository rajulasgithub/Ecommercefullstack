# Backend API

This is the Node.js / Express backend for the ecommerce application.

## Architecture & Setup
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT & Google OAuth (`google-auth-library`)
- **File Uploads:** Multer & Cloudinary
- **Email:** Nodemailer

## Setup Instructions
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:
- `MONGO_URL`
- `PORT` (default: 8080)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLOUD_NAME`
- `CLOUD_KEY`
- `CLOUD_SECKEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

## Testing
The backend uses Jest and Supertest with `mongodb-memory-server` for integration testing.
Run tests with:
```bash
npm run test
```
