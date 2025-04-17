import { ref, watch, computed } from "vue";

const FAVORITES_KEY = "favoriteRecipeIds";

// Reactive state for favorite IDs
const favoriteIds = ref([]);

// --- Load favorites from LocalStorage on initialization ---
const loadFavorites = () => {
	const storedFavorites = localStorage.getItem(FAVORITES_KEY);
	if (storedFavorites) {
		try {
			const parsedIds = JSON.parse(storedFavorites);
			// Basic validation: ensure it's an array
			if (Array.isArray(parsedIds)) {
				favoriteIds.value = parsedIds;
				// console.log(
				// 	"Favorites loaded from LocalStorage:",
				// 	favoriteIds.value
				// );
			} else {
				console.warn(
					"Invalid data found in LocalStorage for favorites, resetting."
				);
				localStorage.removeItem(FAVORITES_KEY);
			}
		} catch (error) {
			console.error("Error parsing favorites from LocalStorage:", error);
			localStorage.removeItem(FAVORITES_KEY); // Clear corrupted data
		}
	} else {
		console.log("No favorites found in LocalStorage.");
	}
};

loadFavorites(); // Load immediately when composable is imported/used

// --- Watch for changes and save to LocalStorage ---
watch(
	favoriteIds,
	(newIds) => {
		console.log("Saving favorites to LocalStorage:", newIds);
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(newIds));
	},
	{ deep: true } // Necessary because we are modifying the array itself
);

// --- Methods to interact with favorites ---
const addFavorite = (recipeId) => {
	if (recipeId && !favoriteIds.value.includes(recipeId)) {
		favoriteIds.value.push(recipeId);
		console.log(`Added favorite: ${recipeId}`);
	}
};

const removeFavorite = (recipeId) => {
	if (recipeId) {
		const index = favoriteIds.value.indexOf(recipeId);
		if (index > -1) {
			favoriteIds.value.splice(index, 1);
			console.log(`Removed favorite: ${recipeId}`);
		}
	}
};

// --- Computed property to check if an item is a favorite ---
const isFavorite = (recipeId) => {
	// Using computed for potential reactivity if recipeId could change reactively,
	// but here it's used more like a simple check function.
	// If recipeId is passed as a ref/prop, computed would be better.
	return computed(() => favoriteIds.value.includes(recipeId));
	// Alternatively, a simple function if recipeId is always a static value when checked:
	// return favoriteIds.value.includes(recipeId);
};

// --- Export the public API of the composable ---
export function useFavorites() {
	return {
		// Provide a readonly version of the IDs if direct manipulation outside is not desired
		// favoriteIds: computed(() => [...favoriteIds.value]),
		favoriteIds, // Expose the raw ref for direct use (e.g., in FavoritesView)
		addFavorite,
		removeFavorite,
		isFavorite,
	};
}
