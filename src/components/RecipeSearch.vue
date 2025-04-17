<template>
	<div class="recipe-search-component position-relative">
		<div class="input-group input-group-sm">
			<input
				type="search"
				class="form-control form-control-sm search-input"
				placeholder="Search recipes..."
				v-model="searchQuery"
				@input="onSearchInput"
				@focus="showSuggestionsList"
				@blur="hideSuggestionsWithDelay"
				aria-label="Search Recipes"
			/>
			<span v-if="isLoading" class="input-group-text search-loader-addon">
				<i class="pi pi-spin pi-spinner search-loader"></i>
			</span>
		</div>
		<div
			v-if="showSuggestions"
			class="suggestions-dropdown position-absolute list-group shadow-sm"
		>
			<div v-if="isLoading" class="list-group-item text-muted small p-2">
				Loading...
			</div>
			<ul v-else-if="suggestions.length > 0" class="list-unstyled mb-0">
				<li
					v-for="suggestion in suggestions"
					:key="suggestion.type + '-' + suggestion.id"
					class="list-group-item list-group-item-action p-2 d-flex justify-content-between align-items-center"
					@mousedown.prevent="selectSuggestion(suggestion)"
				>
					<span>{{ suggestion.name }}</span>
					<span
						class="badge rounded-pill ms-2"
						:class="{
							'bg-primary text-white': suggestion.type === 'meal',
							'bg-secondary text-white':
								suggestion.type === 'cocktail',
						}"
					>
						{{ suggestion.type === "meal" ? "Recipe" : "Cocktail" }}
					</span>
				</li>
			</ul>
			<div
				v-else-if="searchQuery.length >= MIN_QUERY_LENGTH"
				class="list-group-item text-muted small p-2"
			>
				No results found.
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { searchMealsByName } from "@/services/mealApi.js";
import { searchCocktailsByName } from "@/services/cocktailApi.js";

// Router instance for navigation
const router = useRouter();

// Search Autocomplete State
const searchQuery = ref("");
const suggestions = ref([]);
const isLoading = ref(false);
const showSuggestions = ref(false);
const debounceTimer = ref(null);
const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_DELAY = 400; // ms

// Fetch suggestions from BOTH APIs
const fetchSuggestions = async (query) => {
	if (query.length < MIN_QUERY_LENGTH) {
		suggestions.value = [];
		showSuggestions.value = false;
		return;
	}

	isLoading.value = true;
	suggestions.value = []; // Clear previous suggestions
	let apiError = null;

	try {
		// Fetch from both APIs concurrently, wait for all results (even if one fails)
		const results = await Promise.allSettled([
			searchMealsByName(query),
			searchCocktailsByName(query),
		]);

		const combinedSuggestions = [];

		// Process MealDB results
		if (results[0].status === "fulfilled" && results[0].value) {
			results[0].value.forEach((meal) => {
				combinedSuggestions.push({
					id: meal.idMeal,
					name: meal.strMeal,
					type: "meal", // Add type identifier
				});
			});
		} else if (results[0].status === "rejected") {
			console.error(
				"Error fetching meal suggestions:",
				results[0].reason
			);
			apiError = "Could not load meal suggestions."; // Capture error
		}

		// Process CocktailDB results
		if (results[1].status === "fulfilled" && results[1].value) {
			results[1].value.forEach((cocktail) => {
				combinedSuggestions.push({
					id: cocktail.idDrink,
					name: cocktail.strDrink,
					type: "cocktail", // Add type identifier
				});
			});
		} else if (results[1].status === "rejected") {
			console.error(
				"Error fetching cocktail suggestions:",
				results[1].reason
			);
			// Append error or set if no previous error
			apiError = apiError
				? apiError + " Could not load cocktail suggestions."
				: "Could not load cocktail suggestions.";
		}

		// Optional: Sort combined results alphabetically?
		combinedSuggestions.sort((a, b) => a.name.localeCompare(b.name));

		suggestions.value = combinedSuggestions;
	} catch (error) {
		// Catch unexpected errors during Promise.allSettled or processing
		console.error("Error fetching combined suggestions:", error);
		suggestions.value = [];
		apiError = "An unexpected error occurred during search.";
	} finally {
		isLoading.value = false;
		// Show suggestions if there are results or if there was an error to display?
		// Let's keep it simple: show if not loading and query is long enough
		showSuggestions.value = searchQuery.value.length >= MIN_QUERY_LENGTH;

		// TODO: Display apiError message in the dropdown if needed
		if (apiError) {
			console.warn("API Errors:", apiError); // Log for now
		}
	}
};

// Debounced input handler
const onSearchInput = () => {
	clearTimeout(debounceTimer.value);
	debounceTimer.value = setTimeout(() => {
		fetchSuggestions(searchQuery.value);
	}, DEBOUNCE_DELAY);
};

// Show suggestions list (e.g., on focus if results are available)
const showSuggestionsList = () => {
	if (
		suggestions.value.length > 0 ||
		(searchQuery.value.length >= MIN_QUERY_LENGTH &&
			!isLoading.value &&
			suggestions.value.length === 0)
	) {
		showSuggestions.value = true;
	}
};

// Hide suggestions list with a delay to allow click
const hideSuggestionsWithDelay = () => {
	// Use setTimeout to allow click event on suggestion to fire before hiding
	setTimeout(() => {
		showSuggestions.value = false;
	}, 150); // Adjust delay if needed
};

// Handle suggestion selection based on type
const selectSuggestion = (suggestion) => {
	searchQuery.value = ""; // Clear search input
	suggestions.value = []; // Clear suggestions
	showSuggestions.value = false; // Hide dropdown

	if (suggestion.type === "meal") {
		router.push({ name: "RecipeDetail", params: { id: suggestion.id } });
	} else if (suggestion.type === "cocktail") {
		router.push({ name: "CocktailDetail", params: { id: suggestion.id } });
	} else {
		console.warn("Unknown suggestion type selected:", suggestion);
	}
};
</script>
