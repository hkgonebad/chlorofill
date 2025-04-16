<template>
	<div class="favorites-view container py-4">
		<div class="view-header mb-4">
			<h2>My Favorite Recipes</h2>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading"
			class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 placeholder-glow"
		>
			<SkeletonCard
				v-for="n in favoriteIds.length || 4"
				:key="'sk-' + n"
			/>
			<!-- Show skeletons based on fav count or default -->
		</div>
		<!-- Error State -->
		<ErrorMessage v-else-if="error" :message="error" />

		<!-- Recipe List -->
		<div
			v-else-if="favoriteRecipes.length > 0"
			class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
		>
			<ItemCard
				v-for="recipe in favoriteRecipes"
				:key="recipe.idMeal"
				:image-url="recipe.strMealThumb"
				:title="recipe.strMeal"
				:link-to="{
					name: 'RecipeDetail',
					params: { id: recipe.idMeal },
				}"
			/>
		</div>
		<!-- No Favorites State -->
		<div v-else>
			<p class="alert alert-info">
				You haven't added any favorite recipes yet.
				<router-link :to="{ name: 'Home' }" class="alert-link"
					>Browse recipes</router-link
				>
				to find some!
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";
import { useFavorites } from "../composables/useFavorites";
import ItemCard from "../components/ItemCard.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import SkeletonCard from "../components/SkeletonCard.vue";

const { favoriteIds } = useFavorites();

const favoriteRecipes = ref([]);
const loading = ref(false);
const error = ref(null);

// Function to fetch details for a single recipe ID
const fetchSingleRecipe = async (id) => {
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
		);
		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} for ID ${id}`
			);
		}
		const data = await response.json();
		return data.meals ? data.meals[0] : null; // Return the meal object or null
	} catch (e) {
		console.error(`Error fetching details for favorite ID ${id}:`, e);
		throw e; // Re-throw to be caught by Promise.allSettled
	}
};

// Function to fetch details for all favorite IDs
const fetchFavoriteDetails = async () => {
	if (favoriteIds.value.length === 0) {
		favoriteRecipes.value = [];
		console.log("No favorite IDs to fetch.");
		return; // Nothing to fetch
	}

	loading.value = true;
	error.value = null;
	favoriteRecipes.value = []; // Clear previous results
	console.log("Fetching details for favorites:", favoriteIds.value);

	try {
		const promises = favoriteIds.value.map((id) => fetchSingleRecipe(id));
		const results = await Promise.allSettled(promises);

		const successfulRecipes = [];
		let fetchError = false;

		results.forEach((result, index) => {
			if (result.status === "fulfilled" && result.value) {
				successfulRecipes.push(result.value);
			} else {
				console.error(
					`Failed to fetch favorite with ID: ${favoriteIds.value[index]}`,
					result.reason
				);
				fetchError = true; // Mark that at least one fetch failed
			}
		});

		favoriteRecipes.value = successfulRecipes;

		if (fetchError) {
			// Set a general error if any favorite failed to load
			error.value = "Could not load details for all favorite recipes.";
		}
	} catch (e) {
		// Catch potential errors from Promise.allSettled itself (though unlikely)
		console.error("General error fetching favorite details:", e);
		error.value = "An unexpected error occurred while loading favorites.";
	} finally {
		loading.value = false;
	}
};

// Fetch details when component mounts
onMounted(() => {
	fetchFavoriteDetails();
});

// Watch for changes in favorite IDs and refetch
watch(
	favoriteIds,
	(newIds, oldIds) => {
		// Simple comparison: refetch if length changes or content might differ
		// More sophisticated checks could compare array contents if needed
		if (
			newIds.length !== oldIds?.length ||
			JSON.stringify(newIds) !== JSON.stringify(oldIds)
		) {
			console.log("Favorite IDs changed, refetching details...");
			fetchFavoriteDetails();
		}
	},
	{ deep: true } // Watch for changes within the array
);
</script>

<style scoped>
.view-header h2 {
	font-weight: 600;
}
</style>
