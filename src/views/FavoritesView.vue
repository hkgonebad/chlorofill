<template>
	<div class="favorites-view container py-4">
		<div class="view-header mb-4">
			<h2 class="section-title mb-0">My Favorites</h2>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading"
			class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 placeholder-glow"
		>
			<!-- Adapt skeleton count based on total favorites -->
			<SkeletonCard
				v-for="n in Math.max(combinedFavoriteIds.length, 4)"
				:key="'sk-' + n"
			/>
		</div>
		<!-- Error State -->
		<ErrorMessage v-else-if="error" :message="error" />

		<!-- Combined List -->
		<div
			v-else-if="allFavoritesDetails.length > 0"
			class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
		>
			<template
				v-for="item in allFavoritesDetails"
				:key="item.type + '-' + item.id"
			>
				<!-- Meal Card -->
				<ItemCard
					v-if="item.type === 'meal'"
					:image-url="item.strMealThumb"
					:title="item.strMeal"
					:link-to="{
						name: 'RecipeDetail',
						params: { id: item.idMeal },
					}"
				/>
				<!-- Cocktail Card -->
				<CocktailCard
					v-else-if="item.type === 'cocktail'"
					:image-url="item.strDrinkThumb"
					:title="item.strDrink"
					:link-to="{
						name: 'CocktailDetail',
						params: { id: item.idDrink },
					}"
				/>
			</template>
		</div>
		<!-- No Favorites State -->
		<div v-else>
			<p class="alert alert-info">
				You haven't added any favorites yet.
				<router-link :to="{ name: 'Browse' }" class="alert-link"
					>Browse recipes & cocktails</router-link
				>
				to find some!
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { RouterLink } from "vue-router";
import { useFavorites } from "../composables/useFavorites";
import { useCocktailFavorites } from "../composables/useCocktailFavorites.js"; // <-- Import cocktail favorites
import { getMealDetailsById } from "@/services/mealApi.js"; // <-- Need meal detail function
import { getCocktailDetailsById } from "@/services/cocktailApi.js"; // <-- Need cocktail detail function
import ItemCard from "../components/ItemCard.vue";
import CocktailCard from "../components/CocktailCard.vue"; // <-- Import cocktail card
import ErrorMessage from "../components/ErrorMessage.vue";
import SkeletonCard from "../components/SkeletonCard.vue";

const { favoriteIds: mealFavoriteIds } = useFavorites();
const { favoriteCocktailIds } = useCocktailFavorites(); // <-- Use cocktail favorites

const allFavoritesDetails = ref([]);
const loading = ref(false);
const error = ref(null);

// Combine meal and cocktail IDs for watching changes
const combinedFavoriteIds = computed(() => [
	...mealFavoriteIds.value,
	...favoriteCocktailIds.value,
]);

// Function to fetch details for a single meal ID
const fetchSingleMeal = async (id) => {
	try {
		// Assume getMealDetailsById exists in mealApi.js
		const meal = await getMealDetailsById(id);
		return meal ? { ...meal, type: "meal" } : null; // Add type
	} catch (e) {
		console.error(`Error fetching details for meal ID ${id}:`, e);
		throw e;
	}
};

// Function to fetch details for a single cocktail ID
const fetchSingleCocktail = async (id) => {
	try {
		const cocktail = await getCocktailDetailsById(id);
		return cocktail ? { ...cocktail, type: "cocktail" } : null; // Add type
	} catch (e) {
		console.error(`Error fetching details for cocktail ID ${id}:`, e);
		throw e;
	}
};

// Function to fetch details for all favorite IDs (both types)
const fetchAllFavoriteDetails = async () => {
	if (combinedFavoriteIds.value.length === 0) {
		allFavoritesDetails.value = [];
		console.log("No favorite IDs to fetch.");
		return;
	}

	loading.value = true;
	error.value = null;
	allFavoritesDetails.value = [];
	console.log("Fetching details for combined favorites...");

	try {
		const mealPromises = mealFavoriteIds.value.map((id) =>
			fetchSingleMeal(id)
		);
		const cocktailPromises = favoriteCocktailIds.value.map((id) =>
			fetchSingleCocktail(id)
		);

		const results = await Promise.allSettled([
			...mealPromises,
			...cocktailPromises,
		]);

		const successfulItems = [];
		let fetchError = false;

		results.forEach((result) => {
			if (result.status === "fulfilled" && result.value) {
				successfulItems.push(result.value);
			} else {
				console.error(`Failed to fetch a favorite:`, result.reason);
				fetchError = true;
			}
		});

		// Optional: Sort combined list (e.g., by name)
		successfulItems.sort((a, b) => {
			const nameA = a.type === "meal" ? a.strMeal : a.strDrink;
			const nameB = b.type === "meal" ? b.strMeal : b.strDrink;
			return nameA.localeCompare(nameB);
		});

		allFavoritesDetails.value = successfulItems;

		if (fetchError) {
			error.value = "Could not load details for all favorites.";
		}
	} catch (e) {
		console.error("General error fetching favorite details:", e);
		error.value = "An unexpected error occurred while loading favorites.";
	} finally {
		loading.value = false;
	}
};

// Fetch details when component mounts
onMounted(() => {
	fetchAllFavoriteDetails();
});

// Watch for changes in combined favorite IDs and refetch
watch(
	combinedFavoriteIds,
	() => {
		console.log("Combined favorite IDs changed, refetching details...");
		fetchAllFavoriteDetails();
	},
	{ deep: true }
);
</script>

<style scoped>
/* Add styles if needed */
</style>
