<template>
	<section class="block category-recipes-view">
		<div class="container">
			<!-- Header with Back Button and Title -->
			<div class="d-flex align-items-center mb-4 view-header">
				<BackButton class="me-3" />
				<h2 class="mb-0 flex-grow-1 section-title">
					{{ categoryName }} Recipes
				</h2>
			</div>

			<!-- Loading State -->
			<div
				v-if="loading"
				class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 placeholder-glow"
			>
				<SkeletonCard v-for="n in 8" :key="'sk-' + n" />
				<!-- Show ~8 skeletons -->
			</div>
			<!-- Error State -->
			<ErrorMessage v-else-if="error" :message="error" />

			<!-- Recipe List -->
			<div
				v-else-if="recipes.length > 0"
				class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
			>
				<ItemCard
					v-for="recipe in recipes"
					:key="recipe.idMeal"
					:image-url="recipe.strMealThumb"
					:title="recipe.strMeal"
					:link-to="{
						name: 'RecipeDetail',
						params: { id: recipe.idMeal },
					}"
				/>
				<!-- Subtitle is not available in filter.php result -->
				<!-- Button uses the default slot content -->
			</div>
			<!-- No Recipes Found State -->
			<div v-else>
				<p class="alert alert-info">
					No recipes found for the category "{{ categoryName }}".
				</p>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";
// Import reusable components
import ItemCard from "../components/ItemCard.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import SkeletonCard from "../components/SkeletonCard.vue";
import BackButton from "@/components/BackButton.vue";

// Define props received from the router
const props = defineProps({
	categoryName: {
		type: String,
		required: true,
	},
});

const recipes = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchRecipesByCategory = async (category) => {
	console.log(`Fetching recipes for category: ${category}`);
	loading.value = true;
	error.value = null;
	recipes.value = [];
	try {
		// Example API endpoint - adjust if TheMealDB uses a different format
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
				category
			)}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.meals) {
			// Note: The filter endpoint only returns name, image, id
			recipes.value = data.meals;
		} else {
			// Handle case where category might exist but have no listed meals
			recipes.value = [];
			console.log(`No meals found for category: ${category}`);
		}
	} catch (e) {
		console.error("Error fetching recipes by category:", e);
		error.value = `Failed to load recipes: ${e.message}`;
	} finally {
		loading.value = false;
	}
};

// Fetch recipes when the component mounts
onMounted(() => {
	fetchRecipesByCategory(props.categoryName);
});

// Optional: Watch for changes in the prop if the user navigates
// between category pages without leaving the component instance
watch(
	() => props.categoryName,
	(newCategory) => {
		fetchRecipesByCategory(newCategory);
	}
);
</script>
