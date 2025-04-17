import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
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
