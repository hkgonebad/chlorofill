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

/**
 * Fetches meals by area/cuisine.
 * @param {string} areaName - The name of the area (e.g., 'British', 'Canadian').
 * @returns {Promise<Array>} A promise resolving to an array of meal summary objects.
 * @throws {Error} If the fetch fails.
 */
export const getMealsByArea = async (areaName) => {
	if (!areaName) {
		return [];
	}
	const encodedArea = encodeURIComponent(areaName.trim());
	const url = `${API_BASE_URL}/filter.php?a=${encodedArea}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.meals || [];
	} catch (error) {
		console.error(`Error fetching meals for area "${areaName}":`, error);
		throw new Error(
			`Failed to load meals for ${areaName}: ${error.message}`
		);
	}
};

/**
 * Fetches the full details for a specific meal by its ID.
 * @param {string} id - The meal ID.
 * @returns {Promise<Object|null>} A promise resolving to the full meal details object or null if not found.
 * @throws {Error} If the fetch fails.
 */
export const getMealDetailsById = async (id) => {
	if (!id) {
		throw new Error("Meal ID is required.");
	}
	const url = `${API_BASE_URL}/lookup.php?i=${id}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		// Lookup returns { meals: [ mealObject ] } or { meals: null }
		return data.meals && data.meals.length > 0 ? data.meals[0] : null;
	} catch (error) {
		console.error(`Error fetching meal details for ID ${id}:`, error);
		throw new Error(`Failed to load meal details: ${error.message}`);
	}
};

/**
 * Fetches meals by category name.
 * @param {string} categoryName - The name of the category (e.g., 'Seafood', 'Dessert').
 * @returns {Promise<Array>} A promise resolving to an array of meal summary objects.
 * @throws {Error} If the fetch fails.
 */
export const getMealsByCategory = async (categoryName) => {
	if (!categoryName) {
		return [];
	}
	const encodedCategory = encodeURIComponent(categoryName.trim());
	const url = `${API_BASE_URL}/filter.php?c=${encodedCategory}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.meals || [];
	} catch (error) {
		console.error(
			`Error fetching meals for category "${categoryName}":`,
			error
		);
		throw new Error(
			`Failed to load meals for ${categoryName}: ${error.message}`
		);
	}
};

/**
 * Fetches a single random meal.
 * @returns {Promise<Object|null>} A promise resolving to the random meal object or null if none found.
 * @throws {Error} If the fetch fails.
 */
export const getRandomMeal = async () => {
	const url = `${API_BASE_URL}/random.php`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.meals && data.meals.length > 0 ? data.meals[0] : null;
	} catch (error) {
		console.error("Error fetching random meal:", error);
		throw new Error(`Failed to load random meal: ${error.message}`);
	}
};

// Add other MealDB API functions here (e.g., getMealsByCategory, getMealDetails, etc.)
