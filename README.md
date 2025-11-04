# MÍA E-Commerce Website

A modern, responsive e-commerce website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Product Catalog**: Browse products across multiple categories (Electronics, Fashion, Home & Living, Sports)
- **Advanced Filtering**: Filter by category, price range, rating, and search
- **Shopping Cart**: Add items to cart with persistent storage
- **Product Details**: Detailed product pages with image zoom
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Toast Notifications**: User-friendly notifications for cart actions
- **Smooth Animations**: Modern UI with smooth transitions and hover effects

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
  app/              # Next.js app router pages
  components/       # React components
    ui/            # Reusable UI components
    layout/        # Layout components
    product/       # Product-related components
    cart/          # Cart components
  lib/
    utils/         # Utility functions
    types/         # TypeScript types
    constants/     # Constants and mock data
  hooks/           # Custom React hooks
  test/            # Test setup files
```

## Development Guidelines

- Follow DRY and SOLID principles
- Use TypeScript for all components
- Write unit tests for utilities, hooks, and components
- Ensure responsive design across all breakpoints
- Follow the existing code style and patterns
