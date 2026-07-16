# Brew Haven

A clean, responsive landing page for a premium coffee shop brand called Brew Haven, built with React and Vite. It is broken into reusable components, styled with local CSS Modules, and integrates with a public API to fetch drink mixology data.

## Features & Implementation

### 1. Responsive Landing Page
- **Framework Choice:** React + Vite was chosen for its virtual DOM rendering speed and modular component structure.
- **Components:** Built with modular components (`Navbar`, `Hero`, `Menu`, `Mixology`, `About`, `Testimonials`, `Contact`) that keep code tiny and maintainable.
- **Design & Layout:** Custom CSS Variables are placed under `src/styles/variables.css` to govern the color scheme, spacing rules, and typography.
- **Responsiveness:** Runs seamlessly across mobile, tablet, and desktop screen widths using standard CSS media queries.

### 2. Cocktail API Integration (Signature Mixology)
- **Live Data:** Fetches drink recipes in real-time from TheCocktailDB (a free public API).
- **Search & Chips:** Users can search custom drink names or click preset pick chips (e.g., Espresso Martinis, Irish Coffees).
- **Graceful States:** Includes a friendly loading spinner while fetching, and handles errors with fallback alerts and a query reset option.

## Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   ```
