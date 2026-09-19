# AI Coding Instructions & Conventions

This file defines the project-wide coding conventions and instructions for AI agents working on this repository.

## General Principles
- **Preserve existing logic:** Do not alter existing application logic unless explicitly asked.
- **Maintain consistency:** Follow existing patterns (e.g., Axios for API calls, Express router structure).
- **Code Style:** Use modern ES6+ features. The backend uses ES Modules (`"type": "module"` in package.json).

## Backend Guidelines
- Use `import/export` syntax instead of `require()`.
- Ensure proper error handling and return standardized JSON responses: `{ success: boolean, error: boolean, message: string, data?: any }`.
- Do not expose sensitive `.env` variables. Use `process.env`.
- Write tests using Jest and Supertest. Ensure database isolation using `mongodb-memory-server`.

## Frontend Guidelines
- Use React functional components and hooks.
- Use `react-bootstrap` for UI components where possible.
- API requests should go through `src/utils/api.js` or directly via Axios with proper error handling.
- Tests should be written using React Testing Library (`@testing-library/react`). Avoid deprecated `react-dom/test-utils` imports.
