# ChloroFill - A Vue Recipe (No Bun intended)

A modern, mobile-first recipe and cocktail showcase app built with Vue.js 3, Vite, and Bootstrap 5. It utilizes TheMealDB and TheCocktailDB APIs for data.

## Overview

This project repurposes a static HTML layout into a dynamic single-page application (SPA) using Vue 3's Composition API (`<script setup>`). It serves as a practical example of integrating multiple external APIs, implementing common frontend features, and building a responsive user interface with Bootstrap.

## Key Features

*   **Vue 3 Composition API:** Built using the latest Vue standards with `<script setup>` for concise components.
*   **Vite Build Tool:** Fast development server and optimized production builds.
*   **Bun Package Manager:** Utilizes Bun for rapid dependency installation and script execution.
*   **Routing:** Client-side routing handled by `vue-router` for seamless navigation.
*   **Dual API Integration:** Fetches meal recipes from TheMealDB and cocktail recipes from TheCocktailDB.
*   **Component-Based:** Modular design with reusable components (`TheHeader`, `TheFooter`, `RecipeCard`, `CocktailCard`, `LoadingSpinner`, `ErrorMessage`, `BackButton`, etc.).
*   **Enhanced Search (Full-Screen Modal):**
    *   Header search icon (on non-home pages) opens a full-screen modal.
    *   Searches both meal and cocktail APIs concurrently by name.
    *   Debounced API calls (400ms) for performance.
    *   Minimum query length (3 characters).
    *   Skeleton loader during search.
    *   Clickable results list with type indicators (meal/cocktail).
    *   Homepage retains a simpler inline search bar (`RecipeSearch.vue`).
*   **Favorites System:** Uses `localStorage` via composables (`useFavorites`, `useCocktailFavorites`) to save favorite meals and cocktails.
*   **Amazon Affiliate Integration:**
    *   Dynamically generated affiliate search links for recipe/cocktail ingredients, categories, areas, etc. (`src/utils/affiliateLinks.js`).
    *   Curated affiliate links on the Offers page.
*   **Styling & Theming:**
    *   Bootstrap 5 integrated via SCSS with custom overrides (`scss/` directory).
    *   **Dark Mode:** Supports light/dark themes via Bootstrap's `data-bs-theme`, persisted in `localStorage` (`useTheme.js`). Animated SVG theme toggle button.
*   **UI/UX:**
    *   Skeleton loaders for content loading states.
    *   Responsive design targeting mobile-first.
    *   Standardized back button component.
    *   Offcanvas navigation (simplified to links due to JS conflicts).

## Project Status

The application includes both meal and cocktail browsing, searching, detail views, favorites, and affiliate links. The UI features dark mode, responsive layouts, and loading states.

### Completed Features

*   ✅ Core Vue.js setup, routing, and component structure
*   ✅ TheMealDB API integration (categories, areas, details, random, search)
*   ✅ TheCocktailDB API integration (filters, details, random, search)
*   ✅ Combined Meal/Cocktail Full-Screen Search Modal
*   ✅ Dark mode support with persistence
*   ✅ Affiliate integration (dynamic and curated)
*   ✅ Meal Favorites (LocalStorage)
*   ✅ Cocktail Favorites (LocalStorage)
*   ✅ Skeleton loading states
*   ✅ Responsive design & SCSS customization

### Known Issues

*   **Offcanvas Dropdowns:** Bootstrap dropdowns within the offcanvas menu conflicted with other components (likely the modal). Replaced with simple links as a workaround.

## Technology Stack

*   **Framework:** Vue.js 3 (Composition API with `<script setup>`)
*   **Build Tool:** Vite
*   **Package Manager:** Bun
*   **Routing:** Vue Router 4
*   **Styling:** Bootstrap 5 (SCSS), PrimeIcons
*   **State Management:** Vue Composables (for Theme, Favorites)
*   **APIs:** TheMealDB, TheCocktailDB
*   **Libraries:** `lodash-es` (for debounce)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hkgonebad/chlorofill.git
    cd chlorofill
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application should be running locally (Vite will specify the port, typically `http://localhost:5173`).

## Build & Deployment

*   **Build:**
    ```bash
    bun run build
    ```
    This creates an optimized production build in the `dist/` folder.
*   **Deployment:** The `dist` folder contains static assets suitable for deployment on any static file server (e.g., GitHub Pages, Netlify, Vercel). (Note: A GitHub Actions workflow might exist but needs verification/setup).

## Contributing

This is primarily a practice project, but contributions, issues, and feature requests are welcome.

## License

[MIT License](LICENSE)
