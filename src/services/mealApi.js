// Base URL for TheMealDB API
const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

/**
 * Fetches the list of meal categories.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 * @throws {Error} Throws an error if the fetch fails or the API returns no categories.
 */
export const getCategories = async () => {
	try {
		const response = await fetch(`${API_BASE_URL}/categories.php`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.categories) {
			return data.categories;
		} else {
			// Return empty array or throw error depending on desired handling
			console.warn("No categories found in API response.");
			return []; // Or throw new Error("No categories found");
		}
	} catch (error) {
		console.error("Error fetching categories:", error);
		// Re-throw the error to be caught by the calling component
		throw new Error(`Failed to load categories: ${error.message}`);
	}
};

/**
 * Searches for meals by name.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} A promise resolving to an array of meal summary objects.
 * @throws {Error} If the fetch fails.
 */
export const searchMealsByName = async (query) => {
	if (!query || query.trim().length === 0) {
		return []; // Return empty if query is empty
	}
	const encodedQuery = encodeURIComponent(query.trim());
	const url = `${API_BASE_URL}/search.php?s=${encodedQuery}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		// Search returns { meals: [...] } or { meals: null }
		return data.meals || [];
	} catch (error) {
		console.error(`Error searching meals for "${query}":`, error);
		throw new Error(`Failed to search meals: ${error.message}`);
	}
};

// Add other MealDB API functions here (e.g., getMealsByCategory, getMealDetails, etc.)
