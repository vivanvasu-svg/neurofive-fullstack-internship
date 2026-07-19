# Brew Haven Monorepo

Brew Haven is a premium coffee shop web application. This project has been structured as a monorepo containing a React frontend client and an Express backend API server connected to a MongoDB database.

---

## Folder Structure

```
brew-haven/
├── client/          # React + Vite Frontend
├── server/          # Node.js + Express.js Backend
├── package.json     # Monorepo Workspace Coordinator
└── README.md        # Monorepo Instructions
```

---

## Tech Stack

### Frontend (`client/`)
* React (Vite)
* Axios (API Integration)
* CSS Modules (Styling)
* React Router (Routing)
* React Icons

### Backend (`server/`)
* Node.js
* Express.js
* Mongoose
* dotenv
* cors

### Database
* MongoDB (run locally or using Docker container)

---

## Prerequisites

Ensure you have the following installed on your system:
* **Node.js** (v16+)
* **NPM**
* **Docker** (recommended for running MongoDB easily)

---

## Running the Application

Follow these steps to run both backend and frontend applications:

### 1. Run MongoDB database

If you do not have a local MongoDB daemon running, you can spin up MongoDB container easily via Docker:

```bash
# Run MongoDB 4.4 in a Docker container named "brew-mongo"
docker run --name brew-mongo -p 27017:27017 -d mongo:4.4
```

Verify that the container is running:

```bash
docker ps
```

---

### 2. Configure Environment Variables

1. Go to the `server/` directory.
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp server/.env.example server/.env
   ```
3. Customise standard settings in `server/.env` if your MongoDB lies elsewhere:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/brew-haven
   NODE_ENV=development
   ```

---

### 3. Install Workspace Dependencies

At the monorepo root folder (`brew-haven/`), execute:

```bash
npm install
```

This will configure the workspaces and restore dependencies for both the `client/` and `server/` subfolders.

---

### 4. Start the Application

To run both servers in parallel from the root folder:

```bash
npm run dev
```

Alternatively, you can boot them individually:

* **Startup Client Dev Server:**
  ```bash
  npm run client
  ```
  Runs Vite dev server on: `http://localhost:5173/`

* **Startup Server API Server:**
  ```bash
  npm run server
  ```
  Runs Express/Nodemon server on: `http://localhost:5000/`

---

## API Endpoints

The Express server exposes the following endpoints (prefix with `http://localhost:5000`):

* `GET /api/coffees` - Fetch all coffee items.
* `GET /api/coffees/:id` - Fetch one coffee item.
* `POST /api/coffees` - Create a new coffee.
* `PUT /api/coffees/:id` - Update an existing coffee.
* `DELETE /api/coffees/:id` - Delete an item.
* `GET /api/health` - Simple server connectivity check.
