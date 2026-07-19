# NeuroFive Solutions – Full Stack Developer Internship

This repository contains my submissions for the **Full Stack Developer Internship** assessment at **NeuroFive Solutions**. The project, **Brew Haven**, was developed step by step as each internship task was completed, evolving from a responsive landing page into a full-stack web application.

## Completed Tasks

### ✅ Task 1 – Responsive Landing Page
Built **Brew Haven**, a modern coffee shop landing page featuring:
- Responsive design for mobile, tablet, and desktop
- Reusable React components
- Clean and consistent UI
- Component-based architecture

### ✅ Task 2 – Public API Integration
Integrated **TheCocktailDB API** into the application.
Features include:
- Fetching live drink data
- Search functionality
- Loading and error states
- Responsive card layout

### ✅ Task 3 – Full Stack CRUD
Built a custom backend API and connected it to the React frontend.
Features include:
- REST API with Express.js
- Create, Read, Update, and Delete (CRUD) operations on coffee menu items
- MongoDB database integration
- Loading and error handling
- React state management with Hooks

### ✅ Task 4 – Authentication & Protected Routes
Added a complete authentication system.
Features include:
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes
- Secure token storage
- Logout functionality
- Client-side form validation

### ✅ Task 5 – Multi-Field Form
Implemented a customer table reservation system.
Features include:
- Interactive multi-field booking form (date, time, guests, special requests)
- Robust validation on both client and server sides
- Dynamic booking slots and guest capacity rules
- Persistence in MongoDB with custom model relationships

### ✅ Task 6 – Global State Management
Refactored application state to improve performance and code quality.
Features include:
- Integrated React Context API to manage shared authentication state and menu caches
- Eliminated redundant API reads and prop-drilling
- Interactive loaders (skeleton UI) for smoother transitions
- Well-designed empty placeholder states for zero-data scenarios

### ✅ Task 7 – File Upload
Added media upload capabilities to the administrator dashboard.
Features include:
- Image file uploads for coffee items
- Server-side multipart form processing using Node Multer middleware
- Static asset serving for uploaded images
- Responsive image previews during item addition/edit

### ✅ Task 8 – Visual Data Dashboard
Built an interactive analytics panel for shop managers.
Features include:
- Real-time stat cards (Total Sales, Order Volume, Average Ticket value, and Menu Size)
- Custom-drawn, fully responsive SVG charts:
  - **Category Breakdown** (horizontal bar chart showing revenue per items group)
  - **Chronological Timeline** (smooth line chart with area gradients plotting daily performance)
  - **Status Completion Ratios** (donut chart showing ratio of pending vs. completed purchases)
- Interactive category-based filter dropdown that dynamically updates all charts in real-time

---

## Tech Stack

### Frontend
- React
- Vite
- CSS Modules
- React Context API (Task 6)
- React Router
- Axios / React Icons

### Backend
- Node.js
- Express.js
- MongoDB / Mongoose
- Multer (Task 7)
- JWT Authentication / bcrypt

### APIs
- TheCocktailDB API (Task 2)
- Custom Express REST API

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (defaulting to Port 27017) or running via Docker

### Install dependencies
At the root folder, run:
```bash
npm install
```

### Run the application
To start both client and server concurrently:
```bash
npm run dev
```

---

This project showcases a structured approach to building full-stack applications with proper software engineering practices, responsive visual layouts, state control, and real-time interactive business analytics dashboards.
