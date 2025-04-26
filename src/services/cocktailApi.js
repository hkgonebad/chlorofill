// Base URL for TheCocktailDB API (using test key '1')
const API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// --- Simple In-Memory Cache ---
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // Cache Time-To-Live: 1 hour in milliseconds

function setCache(key, data) {
	const expires = Date.now() + CACHE_TTL;
	cache.set(key, { data, expires });
}

function getCache(key) {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() > entry.expires) {
		cache.delete(key);
		return null;
	}
	console.log(`Cache hit for: ${key}`);
	return entry.data;
}
// --- End Cache ---

/**
 * Fetches various filter lists (categories, glasses, ingredients, alcoholic types).
 * @returns {Promise<Object>} A promise resolving to an object with keys: categories, glasses, ingredients, alcoholicTypes.
 * @throws {Error} If any fetch fails.
 */
export const getCocktailFilterLists = async () => {
	const endpoints = {
		categories: "list.php?c=list",
		glasses: "list.php?g=list",
		ingredients: "list.php?i=list",
		alcoholicTypes: "list.php?a=list",
	};

	const results = {};
	const errors = [];

	// Fetch all lists concurrently
	await Promise.all(
		Object.entries(endpoints).map(async ([key, endpoint]) => {
			try {
				const response = await fetch(`${API_BASE_URL}/${endpoint}`);
				if (!response.ok) {
					throw new Error(
						`HTTP error! status: ${response.status} for ${key}`
					);
				}
				const data = await response.json();
				// The API returns { drinks: [{ strCategory: '...' }, ...] } etc.
				results[key] = data.drinks || [];
			} catch (error) {
				console.error(`Error fetching cocktail ${key} list:`, error);
				errors.push(`Failed to load ${key}: ${error.message}`);
			}
		})
	);

	if (errors.length > 0) {
		// If any fetch failed, throw a combined error message
		throw new Error(
			`Failed to load cocktail filter lists: ${errors.join("; ")}`
		);
	}

	return results;
};

/**
 * Fetches a single random cocktail.
 * @returns {Promise<Object|null>} A promise resolving to the cocktail object or null if none found.
 * @throws {Error} If the fetch fails.
 */
export const getRandomCocktail = async () => {
	// Generally, don't cache random results unless you want the same random one for a TTL period
	const url = `${API_BASE_URL}/random.php`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.drinks && data.drinks.length > 0 ? data.drinks[0] : null;
	} catch (error) {
		console.error("Error fetching random cocktail:", error);
		throw new Error(`Failed to load random cocktail: ${error.message}`);
	}
};

/**
 * Fetches a list of cocktails based on a specific filter.
 * @param {string} filterType - The type of filter ('a', 'c', 'g', 'i').
 * @param {string} filterValue - The value to filter by (e.g., 'Alcoholic', 'Cocktail_Glass', 'Gin').
 * @returns {Promise<Array>} A promise resolving to an array of cocktail summary objects.
 * @throws {Error} If the fetch fails or the filter type is invalid.
 */
export const getCocktailsByFilter = async (filterType, filterValue) => {
	const validFilterTypes = ["a", "c", "g", "i"];
	if (!validFilterTypes.includes(filterType)) {
		console.error(`Invalid filter type provided: ${filterType}`);
		throw new Error("Invalid filter type.");
	}

	// Encode the filter value for the URL
	const encodedValue = encodeURIComponent(filterValue);
	const url = `${API_BASE_URL}/filter.php?${filterType}=${encodedValue}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		// The filter endpoint returns { drinks: [...] } or { drinks: null }
		return data.drinks || []; // Return empty array if no drinks found
	} catch (error) {
		console.error(
			`Error fetching cocktails by ${filterType}=${filterValue}:`,
			error
		);
		throw new Error(
			`Failed to load cocktails for ${filterValue}: ${error.message}`
		);
	}
};

/**
 * Fetches the full details for a specific cocktail by its ID.
 * @param {string} id - The cocktail ID.
 * @returns {Promise<Object|null>} A promise resolving to the full cocktail details object or null if not found.
 * @throws {Error} If the fetch fails.
 */
export const getCocktailDetailsById = async (id) => {
	if (!id) {
		throw new Error("Cocktail ID is required.");
	}
	const cacheKey = `cocktailDetail_${id}`;
	const cachedData = getCache(cacheKey);
	if (cachedData) return cachedData;

	const url = `${API_BASE_URL}/lookup.php?i=${id}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		// Lookup returns { drinks: [ cocktailObject ] } or { drinks: null }
		const cocktailData =
			data.drinks && data.drinks.length > 0 ? data.drinks[0] : null;
		setCache(cacheKey, cocktailData); // Cache the result (even if null)
		return cocktailData;
	} catch (error) {
		console.error(`Error fetching cocktail details for ID ${id}:`, error);
		throw new Error(`Failed to load cocktail details: ${error.message}`);
	}
};

/**
 * Searches for cocktails by name.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} A promise resolving to an array of cocktail summary objects.
 * @throws {Error} If the fetch fails.
 */
export const searchCocktailsByName = async (query) => {
	if (!query || query.trim().length === 0) {
		return [];
	}
	const encodedQuery = encodeURIComponent(query.trim());
	const url = `${API_BASE_URL}/search.php?s=${encodedQuery}`;

	// Caching search results can be complex due to varying queries,
	// skipping cache here for simplicity but could be added with query as key.
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.drinks || [];
	} catch (error) {
		console.error(`Error searching cocktails for "${query}":`, error);
		throw new Error(`Failed to search cocktails: ${error.message}`);
	}
};

// Add other CocktailDB API functions here as needed
// e.g., getCocktailsByFilter, getCocktailDetails
