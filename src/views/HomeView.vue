<template>
	<div class="home-view container py-4">
		<div class="welcome-header mb-4">
			<p class="text-muted mb-1">Hello, {{ userName || "User" }}</p>
			<!-- Add user name later if implementing auth -->
			<h2>What would you like<br />to cook today?</h2>
			<!-- Add Search Bar component later -->
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
			<LoadingSpinner v-if="loadingFeatured" />
			<ErrorMessage v-else-if="errorFeatured" :message="errorFeatured" />
			<!-- Use ItemCard in a grid -->
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

		<section class="recipe-section mb-5">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h4 class="section-title">Recommendations</h4>
				<a href="#" class="btn btn-sm btn-outline-secondary">See all</a>
			</div>
			<!-- Placeholder for recommendations -->
			<p class="text-muted">(Recommended recipes will go here)</p>
		</section>

		<!-- Add more sections as needed -->
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import ItemCard from "../components/ItemCard.vue";
// Import reusable components
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import CategoryCarousel from "../components/CategoryCarousel.vue";

const userName = ref(null); // Placeholder for username
const featuredRecipes = ref([]);
const loadingFeatured = ref(false);
const errorFeatured = ref(null);

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

// Fetch when the component is mounted
onMounted(() => {
	fetchFeaturedRecipes();
});
</script>
