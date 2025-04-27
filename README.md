# ChloroFill - Vue Recipe & Cocktail App 🍴🍹

[![Made with Vue.js](https://img.shields.io/badge/Made_with-Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Built with Vite](https://img.shields.io/badge/Built_with-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Managed with Bun](https://img.shields.io/badge/Managed_with-Bun-FBF0DF?style=flat-square&logo=bun&logoColor=black)](https://bun.sh/)
[![Styled with Bootstrap](https://img.shields.io/badge/Styled_with-Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Powered by Supabase](https://img.shields.io/badge/Powered_by-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

ChloroFill is a modern, responsive web application showcasing meal and cocktail recipes, built with Vue 3 and powered by Supabase for backend features.

## Project Overview

This project demonstrates the integration of modern frontend technologies to create a dynamic Single Page Application (SPA). It started as a static layout and evolved into a feature-rich app using:

*   **Vue 3 (Composition API):** Leveraging `<script setup>` for clean and efficient component development.
*   **Vite & Bun:** Ensuring a fast development experience and optimized builds.
*   **Supabase:** Integrating user authentication (Signup, Login, Magic Link, Logout) and profile management (Username/Full Name updates) using Supabase Auth and Database.
*   **External APIs:** Fetching recipe data from TheMealDB and TheCocktailDB, with development proxy setup to handle CORS.
*   **Routing:** Client-side navigation managed by Vue Router, including dynamic routes and lazy-loading.
*   **Styling:** Responsive design achieved with Bootstrap 5 (SCSS) and custom theming, including a persistent light/dark mode toggle.
*   **State Management:** Utilizing Vue Composables for managing global state (Auth, Theme, LocalStorage Favorites).

## Key Features & Technical Highlights

*   **Dual Recipe Types:** Browse and search both meal and cocktail recipes.
*   **Supabase Integration:**
    *   Email/Password Authentication
    *   Magic Link (OTP) Login
    *   User Profile Creation (via trigger) & Updates
    *   PostgreSQL Database with Row Level Security (RLS)
*   **Responsive UI:** Mobile-first design using Bootstrap 5 SCSS.
*   **Dark Mode:** Persistent theme switching with smooth transitions.
*   **API Interaction:** 
    *   Async data fetching from multiple REST APIs.
    *   Vite proxy for handling CORS in development.
    *   Simple in-memory caching with TTL for API responses.
*   **Client-Side Favorites:** Save favorite recipes locally using `localStorage`.
*   **Search Functionality:** Debounced, combined search across both recipe APIs.
*   **UI Components:** Reusable components for cards, carousels, modals, loaders, error messages.
*   **SEO Basics:** Dynamic page titles and meta descriptions using `@vueuse/head`.
*   **Modern Tooling:** Built with Vite and managed with Bun.
*   **Environment Variable Handling:** Securely managing API keys using Vite's `loadEnv` and `define` configuration (avoiding `VITE_` prefix exposure in code).

## Technology Stack

*   **Framework:** Vue.js 3 (Composition API)
*   **Build Tool:** Vite
*   **Package Manager:** Bun
*   **Backend:** Supabase (Auth, Database)
*   **Routing:** Vue Router 4
*   **Styling:** Bootstrap 5 (SCSS), PrimeIcons
*   **State Management:** Vue Composables
*   **APIs:** TheMealDB, TheCocktailDB
*   **Libraries:** `vue-toastification`, `@vueuse/head`, `dotenv` (dev)

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hkgonebad/chlorofill.git
    cd chlorofill
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Environment Setup:**
    *   Create a `.env.local` file in the root directory.
    *   Add your Supabase credentials (obtain from your Supabase project settings):
        ```dotenv
        SUPABASE_URL=YOUR_SUPABASE_URL
        SUPABASE_PUBLIC_TOKEN=YOUR_SUPABASE_ANON_KEY
        ```

4.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Deployment (Vercel Example)

1.  Push your code to a Git provider (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel.
3.  Configure Vercel settings:
    *   **Framework Preset:** Vite
    *   **Build Command:** `bun run build`
    *   **Output Directory:** `dist`
    *   **Install Command:** `bun install`
    *   **Environment Variables:** Add `SUPABASE_URL` and `SUPABASE_PUBLIC_TOKEN` with your Supabase project values.
4.  Deploy!

## Future Enhancements

*   **User Recipe Submissions:** Allow users to add and share their own recipes.
*   Server-side recipe saving & management.
*   Recipe/Cocktail rating system.
*   User avatar uploads (Supabase Storage).
*   Advanced filtering options.

## Contributing

Contributions, issues, and feature requests are welcome.

## License

[MIT License](LICENSE) <!-- Make sure you have a LICENSE file -->
