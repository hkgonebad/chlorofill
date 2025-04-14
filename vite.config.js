import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
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
});
