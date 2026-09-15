# Agent Knowledge / Project Overview

This document provides a summary of the `Ecommercefullstack` project to assist AI agents and developers working on this repository.

## Project Structure
The repository is divided into a frontend and a backend workspace.

- `backend/`: Node.js Express server.
- `ecommerceapp/`: React.js frontend application.

## Technologies & Stack

### Frontend (`ecommerceapp/`)
- **Framework**: React 18 (Bootstrapped with Create React App `react-scripts`).
- **Routing**: `react-router-dom` v6 for client-side routing.
- **Styling**: Vanilla CSS (`Style.css`) using a modern Glassmorphism design pattern. Bootstrapped with `react-bootstrap` for grid and base components.
- **State Management**: React Hooks (`useState`, `useEffect`) and local storage for persisting tokens, roles, and basic cart sums.
- **API Communication**: `axios` instance configured in `src/utils/api.js` which automatically attaches JWT tokens.
- **Notifications**: `react-toastify` for user feedback.

### Backend (`backend/`)
- **Framework**: Express.js
- **Runtime**: Node.js (ES Modules enabled via `"type": "module"`).
- **Database**: MongoDB via `mongoose`.
- **Authentication**: `jsonwebtoken` (JWT) & `bcryptjs` for hashing.
- **File Uploads**: `multer` and `multer-storage-cloudinary` for uploading images directly to Cloudinary.
- **Validation**: `express-validator` for request payload validation.
- **Security & Config**: `cors` enabled, Environment variables managed by `dotenv`.

## Architecture & Patterns

### Backend Patterns
- **Routes (`src/routes/`)**: Map endpoints to controllers. Middleware is applied here (e.g. `checkauth`, `checkRole`).
- **Controllers (`src/controllers/`)**: Handle business logic, interact with models, and send JSON responses. Standard response pattern: `{ success: boolean, error: boolean, data?: any, message?: string }`.
- **Models (`src/model/`)**: Mongoose schema definitions (e.g., `user`, `login`, `product`, `order`, `address`, `wishlist`).
- **Middleware (`src/middleware/`)**:
  - `checkauth.js`: Verifies JWT tokens.
  - `authorize.js` (`checkRole`): Role-based access control checking `req.userData.role`. Roles typically include `user`, `seller`, `company`, `admin`.
  - `validateResult.js`: Formats and returns `express-validator` errors.

### Frontend Patterns
- **Components (`src/Components/`)**: Contains all view pages and reusable components.
- **Routing (`src/App.js`)**: Centralized route definitions. Includes a `ProtectedRoute` component to gate access based on `allowedRoles` or logged-in status.
- **Design Aesthetic**: Emphasis on modern, visually striking UI using `glass-card`, `glass-input`, `btn-glass-*` classes, along with status pills (e.g., `status-pill ordered`).
- **Role-Based Rendering**: Components like `Header.jsx` conditionally render navigation items based on the user's role (e.g., Seller Dashboard vs User Cart).

## Essential Commands

From the `backend/` directory:
- `npm start`: Starts the Express server using Node.
- `npm run dev`: Starts the Express server using Nodemon (restarts on file changes).

From the `ecommerceapp/` directory:
- `npm start`: Starts the React development server on port 3000.
- `npm run build`: Creates an optimized production build of the React app.

## Development Guidelines
1. **Always verify Roles**: When creating new backend routes, carefully consider which roles (`user`, `seller`, `company`, `admin`) should have access via `checkRole`.
2. **Do Not Break Glassmorphism**: When adding new UI, stick to the existing CSS classes in `Style.css` to maintain the premium glass aesthetic rather than introducing standard Bootstrap components.
3. **API Integration**: Use the pre-configured `api` instance from `src/utils/api.js` rather than raw `axios` or `fetch`, as it handles the auth token interceptors automatically.
4. **Error Handling**: Follow the standard backend JSON response structure, and map backend `error.response.data.message` to `toast.error()` on the frontend.
## Agent Rules

1. Always analyze the existing implementation and complete flow before modifying code.
2. Do not change the existing project structure unless explicitly requested.
3. Do not refactor or modify unrelated code.
4. Reuse existing models, controllers, routes, components, utilities, and API patterns whenever possible.
5. Before creating a new file, check whether the required functionality can be implemented using an existing file.
6. Do not create duplicate controllers, routes, utilities, or API functions.
7. Maintain backward compatibility with existing functionality.
8. For authentication and authorization, always enforce security on the backend. Never rely only on frontend checks.
9. Validate resource ownership on the backend before allowing users to view, update, or delete data.
10. Follow the existing coding style and naming conventions.
11. Avoid `any` unless there is a valid reason.
12. Do not introduce new packages unless necessary and explain why.
13. After implementation, check for syntax errors, lint/build errors, and obvious broken imports.
14. After completing a feature, provide a short summary of:
    - Files changed
    - What was implemented
    - Any important assumptions
    - Any tests performed
