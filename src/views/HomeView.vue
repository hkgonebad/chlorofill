<template>
	<div class="home-view container py-4">
		<h1>Welcome to ChloroFill 🌍🥑</h1>

		<hr />

		<h2>Recipe of the Moment</h2>
		<div v-if="loading" class="text-center">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
		<div v-else-if="error" class="alert alert-danger">
			{{ error }}
		</div>
		<div v-else-if="recipe" class="card mb-3">
			<div class="row g-0">
				<div class="col-md-4">
					<img
						:src="recipe.strMealThumb"
						class="img-fluid rounded-start"
						:alt="recipe.strMeal"
					/>
				</div>
				<div class="col-md-8">
					<div class="card-body">
						<h5 class="card-title">{{ recipe.strMeal }}</h5>
						<p class="card-text">
							<small class="text-muted"
								>Category: {{ recipe.strCategory }} | Area:
								{{ recipe.strArea }}</small
							>
						</p>
						<p class="card-text">
							{{ recipe.strInstructions.substring(0, 200) }}...
						</p>
						<!-- Add link to full recipe details later -->
						<a
							:href="recipe.strSource || '#'"
							target="_blank"
							class="btn btn-primary"
							>View Full Recipe</a
						>
						<a
							v-if="recipe.strYoutube"
							:href="recipe.strYoutube"
							target="_blank"
							class="btn btn-danger ms-2"
							>Watch Video</a
						>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<p>No recipe loaded yet.</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const recipe = ref(null); // Holds the fetched recipe object
const loading = ref(false);
const error = ref(null);

const fetchRandomRecipe = async () => {
	loading.value = true;
	error.value = null;
	recipe.value = null;
	try {
		const response = await fetch(
			"https://www.themealdb.com/api/json/v1/1/random.php"
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.meals && data.meals.length > 0) {
			// The API returns an array 'meals', even for random, get the first one
			recipe.value = data.meals[0];
		} else {
			throw new Error("No meal data received from API.");
		}
	} catch (e) {
		console.error("Error fetching recipe:", e);
		error.value = `Failed to load recipe: ${e.message}`;
	} finally {
		loading.value = false;
	}
};

// Fetch the recipe when the component is mounted
onMounted(() => {
	fetchRandomRecipe();
});
</script>

<style scoped>
/* Add styles if needed */
.img-fluid {
	max-height: 300px; /* Limit image height */
	object-fit: cover;
}
</style>
