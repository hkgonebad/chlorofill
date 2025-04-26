import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load env file based on mode - defaults to loading .env files
	// in the root directory.
	// The third argument loads all env variables, not just VITE_ prefixed ones.
	// Use '' as the third argument to load all env vars
	const env = loadEnv(mode, process.cwd(), "");

	// Define base path based on mode
	const base = mode === "production" ? "/chlorofill/" : "/";

	return {
		base: base,
		plugins: [vue()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		// Define global constants replacements
		define: {
			// Ensure the values are stringified for replacement
			__SUPABASE_URL__: JSON.stringify(env.SUPABASE_URL),
			__SUPABASE_PUBLIC_TOKEN__: JSON.stringify(
				env.SUPABASE_PUBLIC_TOKEN
			),
			// You can add other non-prefixed variables here if needed
		},
		server: {
			// Optional: configure the dev server port if needed
			// port: 3000,
			proxy: {
				// Proxy /api/themealdb requests to the actual MealDB API
				"/api/themealdb": {
					target: "https://www.themealdb.com",
					changeOrigin: true,
					rewrite: (path) =>
						path.replace(/^\/api\/themealdb/, "/api/json/v1/1"), // Adjust rewrite path as needed
					secure: false, // Needed for some environments
				},
				// Add proxy for CocktailDB if needed later
				// '/api/cocktaildb': {
				// 	target: 'https://www.thecocktaildb.com',
				// 	changeOrigin: true,
				// 	rewrite: (path) => path.replace(/^\/api\/cocktaildb/, '/api/json/v1/1'),
				// 	secure: false,
				// },
			},
		},
		build: {
			// Optional: configure build options if needed
			// outDir: 'dist', // Default is 'dist'
		},
	};
});
