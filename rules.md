# Project Rules and Plan

## Goal
Repurpose the existing static HTML layout to create a recipe showcase website using TheMealDB API and monetize with Amazon Affiliate links. Deploy to GitHub Pages.

## Technology Stack
- **Framework/Library:** Vue.js (using `<script setup>` / `<template>` SFC style).
- **Build Tool:** Vite.
- **Package Manager:** Bun.
- **Styling:** Bootstrap 5 SCSS (imported via `scss/main.scss` from `node_modules`). Custom overrides and components in `scss/` directory, compiled via Vite.
  - **Dark Mode:** Implemented using Bootstrap's `data-bs-theme` attribute and variable overrides in `scss/layout/_dark-mode.scss`.
- **Deployment:** GitHub Pages (static site hosting).

## APIs
- **Content:** TheMealDB (free API for recipe data).
- **Monetization:** Amazon Associates (affiliate links for ingredients/tools).

## Project Structure
```
rsmart/  # Or your project root name (e.g., chlorofill)
├── public/
│   ├── img/         # Static images (e.g., logo)
│   ├── fonts/       # Static fonts (if any)
│   └── json/        # Static JSON data (if needed, e.g., old store data)
├── src/
│   ├── assets/      # Component-specific assets (e.g., CSS, images processed by Vite)
│   ├── components/  # Reusable Vue components (TheHeader.vue, TheFooter.vue, RecipeCard.vue)
│   ├── router/      # Vue Router configuration (index.js)
│   ├── views/       # Page-level Vue components (HomeView.vue, AboutView.vue, etc.)
│   └── App.vue      # Main application component
├── js/
│   └── main.js      # Main JS entry point (initializes Vue, router, imports CSS/Bootstrap JS)
├── scss/
│   ├── layout/      # Layout partials (_variables.scss, _dark-mode.scss, etc.)
│   ├── plugins/     # Old plugin styles (fontawesome, slick - potentially remove later)
│   └── main.scss    # Main SCSS file importing Bootstrap and custom partials
├── node_modules/  # Project dependencies (ignored by git)
├── index.html     # Main HTML entry point (contains #app div)
├── vite.config.js # Vite configuration
├── package.json   # Project metadata and dependencies
├── bun.lockb      # Bun lock file (ignored by git)
├── .gitignore     # Git ignore rules
└── rules.md       # This file
```

## Styling Guidelines
- **Prefer Global SCSS:** Manage theme colors, layout styles, typography, and general component overrides within the `scss/` directory structure.
- **Use SCSS Variables:** Leverage SCSS variables (like `$primary`, `$body-bg`) for theming and consistency.
- **Component Styles:** Use `<style scoped>` within Vue components primarily for styles tightly coupled to the component's internal structure, state, or unique functionality, not for general theme/layout overrides.
- **Dark Mode:** Use the `[data-bs-theme="dark"]` selector in relevant SCSS partials (especially `_dark-mode.scss`) to apply dark theme overrides.

## Development Steps
1.  Set up Vite with Bun to manage the project and handle SCSS compilation. (Done)
2.  Verify the existing HTML pages (`index.html`, etc.) render correctly using the Vite dev server. (Done)
3.  Move static assets (`img`, `fonts`, `json`) into `public/` directory. (Done)
4.  Update all asset paths in HTML, CSS/SCSS, JS to be root-relative (e.g., `img/logo.png` -> `/img/logo.png`). (Done, pending verification)
5.  **Install Vue.js and Vue Router.**
6.  **Configure Vite for Vue.js** (install `@vitejs/plugin-vue`, update `vite.config.js`).
7.  **Create Core Vue App Structure:**
    - Create `src/` directory.
    - Set up `js/main.js` to initialize the Vue app.
    - Create main `src/App.vue` component.
    - Update `index.html` to mount the Vue app (e.g., `<div id="app"></div>`).
8.  **Set up Vue Router:**
    - Create `src/router/index.js`.
    - Define routes for existing pages (Home, About, Categories, Offers).
    - Integrate router into `js/main.js`.
9.  **Componentize Layout:**
    - Create shared components (`src/components/TheHeader.vue`, `src/components/TheFooter.vue`).
    - Create view components (`src/views/HomeView.vue`, `src/views/AboutView.vue`, etc.).
    - Migrate relevant HTML structure from old `.html` files into these Vue components.
    - Use `<router-view>` in `App.vue`.
10. **Cleanup:** Delete old static HTML files (except `index.html`). (Done)
11. **Verify Basic Vue App:** Run `bun run dev` and check if the basic layout (header/footer) and routes are working. (Done - Offcanvas & Dark Mode fixed)
12. Rebrand the site (update titles, logos, text within Vue components). (Done - Name: ChloroFill, Colors defined, Logo temp)
13. **Refactor & Improve UI:** (Done)
    - Create reusable components (e.g., `ItemCard.vue`, `LoadingSpinner.vue`, `ErrorMessage.vue`, `CategoryCarousel.vue`). (Done)
    - Update views (`HomeView`, `CategoriesView`, `CategoryRecipesView`) to use these components. (Done)
    - Apply UI improvements based on design inspiration (layout, card styles, typography, header/footer). (Done)
    - Standardize back buttons. (Done)
    - Centralize styles into SCSS partials (removing from components). (Done)
14. Implement JavaScript logic (within Vue components) to:
    - Generate and insert Amazon Affiliate links for ingredients/tools.
15. Refine styling (including dark mode).
16. Build for production (`bun run build`).
17. Deploy the `dist` folder contents to GitHub Pages. 