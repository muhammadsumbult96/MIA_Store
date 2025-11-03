# MÍA E-Commerce Platform

A high-performance, scalable e-commerce platform built with modern technologies following DRY and SOLID principles.

## Tech Stack

### Frontend
- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Vitest** for unit testing
- **React Hook Form + Zod** for form validation
- **Framer Motion** for animations
- **Axios** for API communication

### Backend
- **FastAPI** with Python 3.12
- **SQLAlchemy** (async) with PostgreSQL
- **Pydantic** for data validation
- **JWT** for authentication
- **Pytest** for testing
- **UV** for dependency management

## Project Structure

```
Mia/
├── frontend/          # Next.js application
├── service-1/        # FastAPI backend
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.12
- PostgreSQL 14+
- UV (Python package manager)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Install UV if not already installed:
```bash
pip install uv
```

2. Set up the backend:
```bash
cd service-1
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials and secret key.

5. Run database migrations (when Alembic is configured):
```bash
alembic upgrade head
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

## Development

### Running Tests

**Frontend:**
```bash
cd frontend
npm run test
npm run test:coverage
```

**Backend:**
```bash
cd service-1
pytest
pytest --cov
```

### Code Quality

**Frontend:**
- ESLint for linting
- Prettier for formatting

**Backend:**
- Ruff for linting
- Black for formatting

## Environment Variables

See `.env.example` files in each directory for required environment variables.

## Contributing

Please follow the coding standards defined in `docs/CODING_STANDARDS.md`.

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## Coding Standards

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for coding conventions and best practices.

## Project Status

### Completed Features

- ✅ User Authentication & Authorization (JWT)
- ✅ Product Catalog with Search & Filtering
- ✅ Shopping Cart Management
- ✅ Checkout & Order Processing
- ✅ Payment Integration (VNPay)
- ✅ Order History & Tracking
- ✅ Multi-language Support (Vietnamese, English)
- ✅ Wishlist Functionality
- ✅ Product Reviews & Ratings
- ✅ Store Locator
- ✅ Comprehensive Unit Tests

### In Progress

- 🔄 Admin Panel (Phase 2)
- 🔄 Additional Payment Gateways (MoMo, ZaloPay)

## License

Copyright © 2024 MÍA E-Commerce Platform

