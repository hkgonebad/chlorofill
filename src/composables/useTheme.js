import { ref, computed, onMounted, onUnmounted } from "vue";

const LOCAL_STORAGE_KEY = "preferred_theme";
const currentTheme = ref("light"); // Default to light before initialization

// Function to apply the theme to the DOM and save preference
const applyTheme = (theme) => {
	if (theme !== "light" && theme !== "dark") {
		console.warn(`Invalid theme value: ${theme}. Defaulting to light.`);
		theme = "light";
	}

	document.documentElement.setAttribute("data-bs-theme", theme);
	try {
		localStorage.setItem(LOCAL_STORAGE_KEY, theme);
		currentTheme.value = theme;
		console.log(`Theme applied and saved: ${theme}`);
	} catch (e) {
		console.error("Failed to save theme preference to localStorage:", e);
	}
};

// Function to determine and apply the initial theme
export const initializeTheme = () => {
	let initialTheme = "dark"; // <-- Change default assumption to dark
	try {
		const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedTheme === "light" || savedTheme === "dark") {
			initialTheme = savedTheme;
			console.log(`Loaded theme from localStorage: ${initialTheme}`);
		} else {
			// No valid saved theme, check system preference
			if (
				window.matchMedia &&
				window.matchMedia("(prefers-color-scheme: dark)").matches
			) {
				initialTheme = "dark";
				console.log("Using system preference: dark");
			} else {
				initialTheme = "light"; // Default light if system is light or preference cannot be determined
				console.log("Using system preference: light (or default)");
			}
		}
	} catch (e) {
		console.error("Failed to access localStorage or matchMedia:", e);
		// Fallback to default light theme
		initialTheme = "light";
	}
	applyTheme(initialTheme);
};

// Function to toggle the theme
const toggleTheme = () => {
	const newTheme = currentTheme.value === "dark" ? "light" : "dark";
	applyTheme(newTheme);
};

// Listener for system theme changes (optional but good UX)
let mediaQueryListener = null;
const setupSystemThemeListener = () => {
	if (window.matchMedia) {
		mediaQueryListener = (e) => {
			// Only apply system change if no user preference is explicitly saved
			if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
				console.log("System theme changed, applying...");
				applyTheme(e.matches ? "dark" : "light");
			}
		};
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", mediaQueryListener);
	}
};

const removeSystemThemeListener = () => {
	if (mediaQueryListener && window.matchMedia) {
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.removeEventListener("change", mediaQueryListener);
	}
};

// Composable function
export function useTheme() {
	// Setup listener when composable is used
	onMounted(setupSystemThemeListener);
	onUnmounted(removeSystemThemeListener);

	// Expose theme state and actions
	return {
		initializeTheme,
		toggleTheme,
		currentTheme: computed(() => currentTheme.value), // Read-only computed ref
		isDarkMode: computed(() => currentTheme.value === "dark"),
	};
}
