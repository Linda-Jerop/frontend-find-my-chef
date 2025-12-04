# Find My Chef

People need chefs, but it’s hard to find reliable ones quickly. Chefs also struggle to find steady work. There is no easy, trusted place for clients and chefs to connect. An app is needed to make hiring chefs fast, reliable, and convenient. 



## Table of Contennts

- [General Info](#general-info)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Features](#features)
- [Setup](#setup)
- [Project Status](#project-status)

## General Info

Find My Chef is a full-stack application designed to ease the process of finding and booking professional chefs. The platform serves two main user types:

- **Clients**: Search for chefs, view profiles, and book culinary services
- **Chefs**: Create profiles, showcase expertise, and manage bookings

This repository contains the frontend application built with React and Vite.

## Screenshots

pass

## 🛠 Technologies

### Core
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **React Router DOM** 7.10.0 - Client-side routing

### State Management & Data
- **Zustand** 5.0.9 - Lightweight state management
- **Axios** 1.13.2 - HTTP client

### Styling
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **PostCSS** 8.5.6 - CSS processing
- **Autoprefixer** 10.4.22 - CSS vendor prefixing

### Development Tools
- **ESLint** 9.39.1 - Code linting
- **Prettier** 3.7.4 - Code formatting
- **Vitest** - Unit testing framework

## Features

### Authentication
- User registration and login
- Separate authentication flows for clients and chefs

### For Clients
- Search and filter available chefs
- View detailed chef profiles and specialties
- Book chef services
- Manage booking history
- Update personal profile

### For Chefs
- Create and manage professional profile
- View and manage booking requests
- Update availability and services

### Testing
- Comprehensive test coverage with Vitest
- Component and feature testing
- Mock service workers for API testing

## Setup:
### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Linda-Jerop/frontend-find-my-chef.git
cd frontend-find-my-chef
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Project Status

**Status**: In Development

Currently on the `dev` branch with active development of core features including authentication, chef search, booking management, and profile management.

## Contributing

This is a Phase 3 group project with Linda Jerop as the scrum master, and Ian Nasoore, David Kamau, Sasha Lisa and Banai Marysah as contributors!

## License

This project is part of a software engineering preparation program.
