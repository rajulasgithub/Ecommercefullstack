# Frontend Application

This is the React frontend for the ecommerce application.

## Architecture & Setup
- **Framework:** React.js (Create React App)
- **Routing:** React Router DOM
- **UI & Styling:** Bootstrap, React Bootstrap
- **Authentication:** Google OAuth (`@react-oauth/google`)
- **API Calls:** Axios

## Setup Instructions
1. Navigate to the frontend directory: `cd ecommerceapp`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Environment Variables
Create a `.env` file in the `ecommerceapp/` directory. Typically, you will need:
- `REACT_APP_GOOGLE_CLIENT_ID`
- `REACT_APP_API_BASE_URL`

## Testing
The frontend uses Jest and React Testing Library for component testing.
Run tests with:
```bash
npm test
```
