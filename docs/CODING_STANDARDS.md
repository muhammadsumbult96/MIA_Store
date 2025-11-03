# Coding Standards

This document outlines the coding standards and best practices for the MÍA E-Commerce platform.

## General Principles

- **DRY (Don't Repeat Yourself)**: Avoid code duplication. Extract reusable functions/components.
- **SOLID Principles**: Follow SOLID principles for maintainable code.
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones.
- **Strong Typing**: Use TypeScript types and Python type hints extensively.
- **Error Handling**: Explicit error handling with clear messages.

## Frontend Standards (TypeScript/React)

### TypeScript
- Use strict mode
- Avoid `any` type unless absolutely necessary
- Define interfaces for all data structures
- Use type guards for runtime type checking

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use `forwardRef` when refs are needed
- Prefer composition over inheritance

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` (prefixed with `use`)
- Utils: `camelCase.ts`
- Types: `camelCase.ts` or `types.ts`

### Code Organization
```
components/
  ui/           # Base UI components
  products/     # Feature-specific components
hooks/
  useProducts.ts
lib/
  api/          # API client functions
  utils.ts      # Utility functions
types/
  product.ts    # Type definitions
```

## Backend Standards (Python/FastAPI)

### Python Style
- Follow PEP 8 guidelines
- Use type hints for all functions
- Prefer functions over classes where possible
- Use async/await for I/O operations

### FastAPI Structure
- Use dependency injection for database sessions
- Separate business logic in service layer
- Use Pydantic schemas for validation
- Implement proper error handling

### File Naming
- Files: `snake_case.py`
- Classes: `PascalCase`
- Functions: `snake_case`
- Constants: `UPPER_SNAKE_CASE`

### Code Organization
```
app/
  api/v1/       # API routes
  core/         # Core configurations
  models/       # Database models
  schemas/      # Pydantic schemas
  services/     # Business logic
  utils/        # Utility functions
```

## Testing

### Frontend (Vitest)
- Test critical business logic
- Mock external dependencies
- Test edge cases
- Aim for 80%+ coverage on utilities

### Backend (Pytest)
- Test all API endpoints
- Test service layer functions
- Use fixtures for test data
- Test error scenarios

## Git Commits

Follow Conventional Commits specification:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example: `feat(auth): add JWT token refresh endpoint`

## Code Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console.logs or debug code
- [ ] Error handling is appropriate
- [ ] Type safety is maintained

