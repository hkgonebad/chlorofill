# Nuxt Migration Plan for ChloroFill

## Current Project Analysis

The ChloroFill Vue application is currently a Single Page Application (SPA) built with:

- Vue 3 with Composition API (`<script setup>`)
- Vue Router for routing
- Vite as the build tool
- Bootstrap 5 for styling with SCSS
- Unhead for meta tag management
- Supabase for authentication and database
- TheMealDB and TheCocktailDB as content APIs

**Current SEO Solution**: Using `vite-plugin-prerender` to pre-render some routes with meta tags, but this has limitations for dynamic routes when sharing URLs.

## Why Migrate to Nuxt?

The primary motivation is to enable better URL sharing capabilities:
- **Server-Side Rendering (SSR)** for dynamic meta tags
- **Improved SEO** for all routes, including dynamic ones
- **Better social media sharing experience** with properly rendered Open Graph tags
- **No need for client-side pre-rendering** workarounds

## Migration Difficulty Assessment

Overall difficulty: **Moderate**

- **Easier parts**:
  - Similar component structure (Vue 3 components are compatible)
  - Similar Composition API syntax
  - File-based routing matches our current structure
  - Meta tag management has direct Nuxt equivalents

- **Challenging parts**:
  - Adapting Vite-specific configuration to Nuxt
  - Converting Vue Router to Nuxt's file-based routing system
  - Configuring Nuxt modules to replace current plugins
  - Handling layout transitions
  - Migrating Bootstrap integration
  - Ensuring authentication flow works properly with SSR

## Migration Steps

### 1. Project Setup

1. **Create a new Nuxt project**
   ```bash
   npx nuxi init chlorofill-nuxt
   cd chlorofill-nuxt
   ```

2. **Install dependencies**
   ```bash
   bun install
   
   # Install required dependencies similar to current project
   bun add bootstrap@5.3.5 @popperjs/core@2.11.8 lodash-es@4.17.21 sass@1.86.3 
   bun add @supabase/supabase-js@2.49.4 vue-toastification@2.0.0-rc.5 primeicons@7.0.0 swiper@11.2.6 open-props@1.7.15
   
   # Install Nuxt modules
   bun add -D @nuxtjs/google-fonts @pinia/nuxt @vueuse/nuxt
   ```

3. **Update nuxt.config.ts**
   - Configure paths, modules, and build settings
   - Set up environment variables
   - Configure head/meta defaults

### 2. Directory Structure Migration (Done)

Migrate files from the current project structure to Nuxt's directory structure:

| Current Structure | Nuxt Structure |
|------------------|----------------|
| `src/components/` | `components/` | (Copied)
| `src/composables/` | `composables/` | (Copied)
| `src/utils/` | `utils/` | (Copied)
| `src/views/` | `pages/` | (Copied & Renamed)
| `src/layouts/` | `layouts/` | (Migrated)
| `src/router/index.js` | File-based routing in `pages/` | (Converted to file structure)
| `src/services/` | `server/api/` or `composables/` | (Migrated to composables)
| `scss/` | `assets/scss/` | (Copied)
| `js/main.js` | Handled by Nuxt | (Replaced)
| `index.html` | `app.vue` + Nuxt config | (Replaced)
| `public/` | `public/` | (Copied)

### 3. Routing Migration (In Progress)

1. **Create file-based routing**: (Done - Files copied/renamed)
   - Convert routes in `router/index.js` to directory structure in `pages/`
   - Example: `/recipe/:id` → `pages/recipe/[id].vue`
   - Add `definePageMeta()` for route metadata (Partially Done - Need to add to all pages)

2. **Create layouts**: (Done)
   - Move `App.vue` layout to `layouts/default.vue`
   - Move `AuthLayout.vue` to `layouts/auth.vue`
   - Create `error.vue` for 404 handling (Done - Needs adaptation)

3. **Navigation handling**: (Partially Done)
   - Replace `<router-link>` with `<NuxtLink>` (Done in Header, Footer, Home, Categories, CategoryRecipes, RecipeDetail, Cocktails, CocktailList, CocktailDetail)
   - Replace `useRouter()` with Nuxt's `navigateTo()` (Done in Header, Login, Signup)
   - Replace `this.$router` with `navigateTo()` (N/A - Composition API used)

### 4. Meta Tags Migration (In Progress)

1. **Replace Unhead implementation with Nuxt's built-in meta management**: (Partially Done)
   - Replace `createHead()` setup with Nuxt's `useHead()` in components/pages (Done for About, Categories, CategoryRecipes, RecipeDetail, Home, Cocktails, CocktailList, CocktailDetail)
   - Update dynamic meta tags in detail pages (Done for RecipeDetail, CocktailDetail, needs others?)

2. **Configure default meta tags in nuxt.config.ts**: (Done)
   ```typescript
   export default defineNuxtConfig({
     app: {
       head: {
         title: 'ChloroFill 🍴🍹 - A Vue Recipe',
         meta: [
           { name: 'description', content: 'Discover and explore delicious recipes and cocktails with ChloroFill 🍴🍹' },
           { property: 'og:title', content: 'ChloroFill 🍴🍹 - A Vue Recipe' },
           // ... other meta tags
         ],
         link: [
           { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
           // ... other links
         ]
       }
     }
   })
   ```

3. **Implement dynamic meta tags in page components**: (Partially Done - RecipeDetail, CocktailDetail adapted)
   ```js
   // Example for recipe/[id].vue
   useHead({
     title: () => recipe.value ? `${recipe.value.strMeal} - ChloroFill` : 'Recipe Details',
     meta: () => recipe.value ? [
       { name: 'description', content: recipe.value.strInstructions.substring(0, 160) },
       { property: 'og:title', content: recipe.value.strMeal },
       { property: 'og:image', content: recipe.value.strMealThumb },
       // ... other meta tags
     ] : []
   })
   ```

### 5. API Services Migration (Done)

1. **Move API services to appropriate locations**: (Done - Migrated to `composables/`)
   - Option 1: Keep as client-side services in `composables/`
   - Option 2: Create API endpoints in `server/api/` for improved caching

2. **Update imports throughout the application** (Partially Done)

### 6. Authentication & State Management (Partially Done)

1. **Set up Supabase for Nuxt**: (Done - Config needs verification)
   - Install Nuxt Supabase module: `bun add -D @nuxtjs/supabase`
   - Configure in nuxt.config.ts
   - Update auth guards with middleware

2. **Create auth middleware**: (Done - Needs verification/refinement)
   - Create `middleware/auth.ts` for protected routes

3. **Adapt Auth Pages**: (Done - Login/Signup pages created/adapted)

4. **Adapt Favorites Page**: (Done)

### 7. Styling Migration (Done)

1. **Move SCSS files to Nuxt structure**: (Done)
   - Move `scss/` to `assets/scss/`
   - Update imports in components (Not needed if global import works)

2. **Configure Bootstrap in Nuxt**: (Done)
   - Update imports in `assets/scss/main.scss`
   - Add client-side Bootstrap JS imports to plugins

3. **Create plugin for Bootstrap JS**: (Done)
   ```js
   // plugins/bootstrap.client.ts
   export default defineNuxtPlugin((nuxtApp) => {
     // Only import Bootstrap JS on the client side
     if (process.client) {
       import('bootstrap/dist/js/bootstrap.bundle.min.js')
     }
   })
   ```

### 8. Component & Composable Migration (In Progress)

1. **Update Vue components**: (In Progress - Header, Footer, ItemCard, RecipeSearch adapted)
   - Update imports to match new structure
   - Replace router-specific code with Nuxt equivalents
   - Keep component logic mostly intact

2. **Update composables**: (Partially Done - Need to review/adapt `useFavorites`, `useTheme` for client-safety)
   - Move to `composables/` directory
   - Update imports if needed
   - Ensure localStorage logic is client-side safe (`process.client` checks)

### 9. Environment Variables (Done)

1. **Configure environment variables**: (Done)
   - Create `.env` file with the same variables (User needs to do this)
   - Update references in nuxt.config.ts
   - Update code to access via `useRuntimeConfig()` (Done in config)

### 10. Build & Deployment (Pending)

1. **Configure Nuxt build settings**: (Initial config done)

2. **Update deployment configuration**: (Pending - Update Vercel config)

## Detailed Migration Action Plan

### Week 1: Setup & Structure (Done)

1. **Day 1-2: Initial Setup**
   - Create new Nuxt project
   - Configure base settings
   - Set up directory structure
   - Migrate static assets

2. **Day 3-4: Core Architecture**
   - Set up layouts
   - Migrate routing structure
   - Configure meta tags framework
   - Set up Supabase integration

3. **Day 5: Styling Framework**
   - Migrate SCSS structure
   - Configure Bootstrap
   - Test basic layout and styling

### Week 2: Component Migration (Done)

1. **Day 1-2: Core Components** (Done - Header, Footer, ItemCard, RecipeSearch adapted)
2. **Day 3-4: Page Components** (Done - Static, Category, Recipe, Cocktail, Favorites, Browse, Areas pages adapted)
3. **Day 5: Services & Utils** (Done - Migrated, API composables adapted)

### Week 3: Features & Testing (In Progress)

1. **Day 1-2: Authentication** (Pending - Review Supabase config, middleware, Profile page)
2. **Day 3-4: Advanced Features** (Pending - Adapt Offers, review Modals, review Composables (`localStorage`))
3. **Day 5: Final Testing & Deployment** (Pending)

## Potential Challenges & Solutions

### 1. SSR vs. Client-Side Logic

**Challenge**: Some client-side code may not work in SSR context, especially code relying on `window`, `document`, or certain third-party libraries.
**Solution**: Use `onMounted()` for client-only initialization, check `process.client` before accessing browser APIs, or use Nuxt-specific composables like `useAsyncData()` for data fetching.

### 2. Bootstrap JS and SSR (Resolved... tentatively)

**Challenge**: Integrating Bootstrap's JavaScript components (like Modals, Offcanvas) caused persistent 500 server errors (`Cannot read properties of undefined (reading 'readyState')`) during SSR, even when initialization code was placed in `onMounted` or guarded with `process.client`. The issue seemed related to the `import 'bootstrap'` statement itself potentially interfering with the server environment.
**Solution Attempt 1**: Using the `plugins/bootstrap.client.js` file to load the bundle globally on the client. This seemed insufficient for components initializing instances manually.
**Solution Attempt 2**: Directly initializing `new Modal(...)` within the component's `onMounted` hook. This still caused the 500 error, likely due to the top-level static `import { Modal } from 'bootstrap';`.
**Solution Attempt 3 (Current)**: Removing the static top-level import and dynamically importing `Modal` *within* the `onMounted` hook (`const { Modal } = await import('bootstrap');`). This appears to have resolved the 500 error while allowing client-side JS functionality.
**Note**: If issues persist, consider using pure CSS implementations for modals or exploring Nuxt-specific UI libraries.

### 3. Hydration Mismatches (Partially Addressed)

**Challenge**: Differences between server-rendered HTML and client-side virtual DOM can cause hydration errors, leading to unexpected behavior or UI glitches (like the theme flash).
**Solution**: Ensure state accessed during SSR is consistent with initial client state. Use tools like `@nuxtjs/color-mode` for theme handling. Avoid rendering content based *only* on client-side state (e.g., `localStorage`) without proper SSR handling or placeholders.

### 4. Configuration Differences

**Challenge**: Adapting Vite configuration (`vite.config.js`, `.env` handling) to Nuxt's configuration (`nuxt.config.ts`, runtime config).
**Solution**: Carefully review Nuxt documentation for module configuration, environment variables (`runtimeConfig`), and build options. Use `defineNuxtConfig` helpers.