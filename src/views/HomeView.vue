<template>
	<div class="home-view container py-4">
		<div class="welcome-header mb-4">
			<p class="text-muted mb-1">Hello, {{ userName || "User" }}</p>
			<!-- Add user name later if implementing auth -->
			<h2>What would you like<br />to cook today?</h2>
			<!-- Add Search Bar component later -->
			<RecipeSearch class="mt-3 mb-4" />
		</div>

		<section class="recipe-section mb-5">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h4 class="section-title">Featured Desserts</h4>
				<!-- Optional: Link to Desserts category -->
				<router-link
					:to="{
						name: 'CategoryRecipes',
						params: { categoryName: 'Dessert' },
					}"
					class="btn btn-sm btn-outline-secondary"
					>See all</router-link
				>
			</div>
			<!-- Loading State with Skeleton Cards -->
			<div
				v-if="loadingFeatured"
				class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 placeholder-glow"
			>
				<SkeletonCard v-for="n in 6" :key="'sk-' + n" />
			</div>
			<!-- Error State -->
			<ErrorMessage v-else-if="errorFeatured" :message="errorFeatured" />
			<!-- Recipe Grid -->
			<div
				v-else-if="featuredRecipes.length > 0"
				class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4"
			>
				<ItemCard
					v-for="recipe in featuredRecipes"
					:key="recipe.idMeal"
					:image-url="recipe.strMealThumb"
					:title="recipe.strMeal"
					:link-to="{
						name: 'RecipeDetail',
						params: { id: recipe.idMeal },
					}"
				/>
			</div>
			<!-- No Recipes Found -->
			<p v-else>Could not load featured recipes.</p>
		</section>

		<section class="recipe-section mb-5">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h4 class="section-title">Categories</h4>
				<router-link
					:to="{ name: 'Categories' }"
					class="btn btn-sm btn-outline-secondary"
					>See all</router-link
				>
			</div>
			<CategoryCarousel />
		</section>

		<!-- Recommendations Section (Conditional) -->
		<template v-if="favoriteIds.length > 0">
			<section class="recipe-section mb-5">
				<div
					class="d-flex justify-content-between align-items-center mb-3"
				>
					<h4 class="section-title">Recommendations For You</h4>
					<!-- Optional: Link to the source category/area? -->
					<!-- <a href="#" class="btn btn-sm btn-outline-secondary">See all</a> -->
				</div>
				<!-- Loading State -->
				<div
					v-if="loadingRecommended"
					class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 placeholder-glow"
				>
					<SkeletonCard v-for="n in 6" :key="'sk-rec-' + n" />
				</div>
				<!-- Error State -->
				<ErrorMessage
					v-else-if="errorRecommended"
					:message="errorRecommended"
				/>
				<!-- Recipe Grid -->
				<div
					v-else-if="recommendedRecipes.length > 0"
					class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4"
				>
					<ItemCard
						v-for="recipe in recommendedRecipes"
						:key="recipe.idMeal"
						:image-url="recipe.strMealThumb"
						:title="recipe.strMeal"
						:link-to="{
							name: 'RecipeDetail',
							params: { id: recipe.idMeal },
						}"
					/>
				</div>
				<!-- No Recommendations Found -->
				<p v-else class="text-muted">
					Could not load recommendations based on your favorites.
				</p>
			</section>
		</template>

		<!-- Add more sections as needed -->
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";
import ItemCard from "../components/ItemCard.vue";
// Import reusable components
import ErrorMessage from "../components/ErrorMessage.vue";
import CategoryCarousel from "../components/CategoryCarousel.vue";
import RecipeSearch from "../components/RecipeSearch.vue";
import SkeletonCard from "../components/SkeletonCard.vue";
import { useFavorites } from "../composables/useFavorites"; // <-- Import useFavorites

const userName = ref(null); // Placeholder for username
const { favoriteIds } = useFavorites(); // <-- Get favorite IDs

// Featured Recipes State
const featuredRecipes = ref([]);
const loadingFeatured = ref(false);
const errorFeatured = ref(null);

// Recommendations State
const recommendedRecipes = ref([]);
const loadingRecommended = ref(false);
const errorRecommended = ref(null);

// Fetch featured recipes (e.g., from Dessert category)
const fetchFeaturedRecipes = async () => {
	loadingFeatured.value = true;
	errorFeatured.value = null;
	featuredRecipes.value = [];
	const category = "Dessert"; // Or choose another category
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
		);
		if (!response.ok)
			throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();
		if (data.meals) {
			featuredRecipes.value = data.meals.slice(0, 6); // Limit to e.g., 6 items
		} else {
			featuredRecipes.value = [];
			console.warn(`No meals found for featured category: ${category}`);
		}
	} catch (e) {
		console.error("Error fetching featured recipes:", e);
		errorFeatured.value = `Failed to load featured recipes: ${e.message}`;
	} finally {
		loadingFeatured.value = false;
	}
};

// Fetch recommendations based on a random favorite
const fetchRecommendations = async () => {
	if (favoriteIds.value.length === 0) {
		console.log("No favorites found, skipping recommendations.");
		return; // Skip if no favorites
	}

	loadingRecommended.value = true;
	errorRecommended.value = null;
	recommendedRecipes.value = [];
	console.log("Fetching recommendations based on favorites...");

	try {
		// 1. Pick a random favorite ID
		const randomIndex = Math.floor(
			Math.random() * favoriteIds.value.length
		);
		const randomFavId = favoriteIds.value[randomIndex];
		console.log(`Recommendation base: random favorite ID ${randomFavId}`);

		// 2. Fetch details of the random favorite to get its category
		const detailResponse = await fetch(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomFavId}`
		);
		if (!detailResponse.ok)
			throw new Error(
				`Failed to fetch details for favorite ${randomFavId}`
			);
		const detailData = await detailResponse.json();

		if (!detailData.meals || detailData.meals.length === 0) {
			throw new Error(
				`Could not find details for favorite ${randomFavId}`
			);
		}

		const sourceCategory = detailData.meals[0].strCategory;
		if (!sourceCategory) {
			throw new Error(
				`Favorite ${randomFavId} does not have a category.`
			);
		}
		console.log(`Recommendation base: category '${sourceCategory}'`);

		// 3. Fetch recipes from that category
		const recommendResponse = await fetch(
			`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
				sourceCategory
			)}`
		);
		if (!recommendResponse.ok)
			throw new Error(
				`Failed to fetch recommendations for category ${sourceCategory}`
			);
		const recommendData = await recommendResponse.json();

		if (recommendData.meals) {
			// 4. Filter out already featured recipes and the source favorite itself
			const featuredIds = featuredRecipes.value.map((r) => r.idMeal);
			const filteredRecommendations = recommendData.meals.filter(
				(r) =>
					!featuredIds.includes(r.idMeal) && r.idMeal !== randomFavId
			);

			// 5. Take a slice (e.g., first 6)
			recommendedRecipes.value = filteredRecommendations.slice(0, 6);
			console.log("Recommendations fetched:", recommendedRecipes.value);
		} else {
			recommendedRecipes.value = [];
			console.warn(
				`No meals found for recommendation category: ${sourceCategory}`
			);
		}
	} catch (e) {
		console.error("Error fetching recommendations:", e);
		errorRecommended.value = `Failed to load recommendations: ${e.message}`;
	} finally {
		loadingRecommended.value = false;
	}
};

// Fetch when the component is mounted
onMounted(async () => {
	await fetchFeaturedRecipes(); // Wait for featured to load first
	fetchRecommendations(); // Then fetch recommendations
});

// Optional: Watch favoriteIds to refresh recommendations?
// watch(favoriteIds, fetchRecommendations, { deep: true }); // Could cause extra calls
</script>
