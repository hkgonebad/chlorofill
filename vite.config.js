import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Define base path based on mode
	const base = mode === "production" ? "/chlorofill/" : "/";

	return {
		base: base,
		plugins: [vue()],
		// No specific config needed yet,
		// but this file allows future customization.
		// Vite will automatically use index.html as the entry point.
		server: {
			// Optional: configure the dev server port if needed
			// port: 3000,
		},
		build: {
			// Optional: configure build options if needed
			// outDir: 'dist', // Default is 'dist'
		},
	};
});
