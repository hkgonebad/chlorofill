# ChloroFill - A Vue Recipe

A modern recipe showcase website built with Vue.js 3, Vite, and Bootstrap 5, utilizing TheMealDB API for recipe data and demonstrating Amazon Affiliate link integration.

**Live Demo:** [Link to your GitHub Pages deployment URL]

## Overview

This project repurposes a static HTML layout into a dynamic single-page application (SPA) using Vue 3's Composition API (`<script setup>`). It serves as a practice project to explore modern frontend development techniques, including component-based architecture, routing, API integration, state management (implicit via Composition API refs), SCSS styling with Bootstrap customization, and deployment automation.

## Key Features

*   **Vue 3 Composition API:** Built using the latest Vue standards with `<script setup>` for concise and readable components.
*   **Vite Build Tool:** Fast development server and optimized production builds.
*   **Bun Package Manager:** Utilizes Bun for rapid dependency installation and script execution.
*   **Routing:** Client-side routing handled by `vue-router` for seamless navigation between views (Home, Categories, Recipe Details, Offers, About).
*   **TheMealDB API Integration:** Fetches recipe categories, details, and search results dynamically.
*   **Reusable Components:** Modular design with components like `TheHeader`, `TheFooter`, `ItemCard`, `CategoryCarousel`, `LoadingSpinner`, `ErrorMessage`, and `RecipeSearch`.
*   **Optimized Search:**
    *   Dedicated `RecipeSearch.vue` component.
    *   Autocomplete suggestions fetched from the API.
    *   Performance optimized using **debouncing** to limit API calls during typing.
    *   Minimum query length enforced for better UX.
    *   Integrated into header (conditionally hidden on homepage) and homepage (with enhanced styling).
*   **Amazon Affiliate Integration:**
    *   Dynamically generated affiliate search links for recipe ingredients/categories/areas.
    *   Curated affiliate links on the Offers page.
*   **Styling:**
    *   Bootstrap 5 integrated via SCSS for layout and base components.
    *   Custom SCSS partials (`scss/` directory) for theme overrides (`layout/_variables.scss`), component styles (`components/`), and layout adjustments.
    *   **Dark Mode:** Supports light and dark themes using Bootstrap's `data-bs-theme` attribute and custom variable overrides (`layout/_dark-mode.scss`).
*   **Deployment:** Automated deployment to GitHub Pages via GitHub Actions on pushes to the `main` branch.

## Technology Stack

*   **Framework:** Vue.js 3 (Composition API with `<script setup>`)
*   **Build Tool:** Vite
*   **Package Manager:** Bun
*   **Routing:** Vue Router
*   **Styling:** Bootstrap 5 (SCSS), PrimeIcons
*   **API:** TheMealDB (Recipe Data)
*   **Deployment:** GitHub Actions, GitHub Pages

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
    The application should now be running on `http://localhost:5173` (or the port specified by Vite).

## Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the application to GitHub Pages whenever changes are pushed to the `main` branch. Ensure GitHub Pages is configured in your repository settings to deploy from the `gh-pages` branch (which the action will create/update).

## Contributing

This is primarily a practice project, but contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit pull requests.

## License

[MIT License](LICENSE) - *(Optional: Create a LICENSE file if you wish)*
