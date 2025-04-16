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
					:key="suggestion.id"
					class="list-group-item list-group-item-action p-2"
					@mousedown.prevent="selectSuggestion(suggestion)"
				>
					{{ suggestion.name }}
				</li>
			</ul>
			<div
				v-else-if="searchQuery.length >= MIN_QUERY_LENGTH"
				class="list-group-item text-muted small p-2"
			>
				No recipes found.
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

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

// Fetch suggestions from TheMealDB
const fetchSuggestions = async (query) => {
	if (query.length < MIN_QUERY_LENGTH) {
		suggestions.value = [];
		showSuggestions.value = false;
		return;
	}

	isLoading.value = true;
	suggestions.value = []; // Clear previous suggestions

	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
				query
			)}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();

		if (data.meals) {
			suggestions.value = data.meals.map((meal) => ({
				id: meal.idMeal,
				name: meal.strMeal,
			}));
		} else {
			suggestions.value = [];
		}
	} catch (error) {
		console.error("Error fetching recipe suggestions:", error);
		suggestions.value = []; // Clear suggestions on error
	} finally {
		isLoading.value = false;
		// Keep suggestions open if loading finished and there are results or no results for a valid query
		showSuggestions.value =
			suggestions.value.length > 0 ||
			(searchQuery.value.length >= MIN_QUERY_LENGTH && !isLoading.value);
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

// Handle suggestion selection
const selectSuggestion = (suggestion) => {
	searchQuery.value = ""; // Clear search input
	suggestions.value = []; // Clear suggestions
	showSuggestions.value = false; // Hide dropdown
	router.push({ name: "RecipeDetail", params: { id: suggestion.id } });
};
</script>
