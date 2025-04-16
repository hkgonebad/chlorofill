<template>
	<div class="recipe-detail-view container-fluid pb-5">
		<!-- Use container-fluid for edge-to-edge, add padding bottom -->

		<LoadingSpinner v-if="loading" />
		<ErrorMessage v-else-if="error" :message="error" class="m-4" />

		<div v-else-if="recipeDetails" class="recipe-content">
			<!-- Image Header (No Back Button Here) -->
			<div class="image-header position-relative mb-3">
				<img
					:src="recipeDetails.strMealThumb + '/large'"
					class="img-fluid recipe-image"
					:alt="recipeDetails.strMeal"
				/>
				<!-- Remove Back Button From Image -->
			</div>

			<div class="container recipe-body px-4 py-2">
				<!-- Header Row with Back Button and Title -->
				<div class="d-flex align-items-center mb-4 view-header">
					<button
						@click="goBack"
						class="btn btn-light btn-sm rounded-circle me-3 back-button-icon"
					>
						<i class="pi pi-arrow-left"></i>
					</button>
					<h2 class="mb-0 flex-grow-1">
						{{ recipeDetails.strMeal }}
					</h2>
				</div>

				<!-- Meta Info -->
				<p class="text-muted small mb-3">
					<span v-if="recipeDetails.strCategory"
						>Category:
						<a
							:href="
								getAmazonSearchUrl(
									recipeDetails.strCategory + ' Cuisine'
								)
							"
							target="_blank"
							rel="noopener noreferrer"
							>{{ recipeDetails.strCategory }}</a
						>
					</span>
					<span v-if="recipeDetails.strArea">
						| Area:
						<a
							:href="
								getAmazonSearchUrl(
									recipeDetails.strArea + ' Cuisine'
								)
							"
							target="_blank"
							rel="noopener noreferrer"
							>{{ recipeDetails.strArea }}</a
						>
					</span>
					<!-- Add other meta like time, difficulty if available -->
				</p>
				<p v-if="recipeDetails.strTags" class="mb-3">
					<span
						class="badge bg-secondary me-1"
						v-for="tag in recipeDetails.strTags.split(',')"
						:key="tag"
						>{{ tag.trim() }}</span
					>
				</p>

				<!-- Ingredients -->
				<h5 class="mt-4">Ingredients</h5>
				<ul class="list-unstyled ingredients-list mb-4">
					<li
						class="d-flex align-items-center mb-2"
						v-for="(ingredient, index) in ingredientsList"
						:key="index"
					>
						<!-- Placeholder icon -->
						<span class="ingredient-icon me-2">🍽️</span>
						<div class="flex-grow-1">
							<a
								:href="getAmazonSearchUrl(ingredient.name)"
								target="_blank"
								rel="noopener noreferrer"
								>{{ ingredient.name }}</a
							>
						</div>
						<div class="text-muted ms-2">
							{{ ingredient.measure }}
						</div>
					</li>
				</ul>

				<!-- Instructions -->
				<h5 class="mt-4">Instructions</h5>
				<p class="instructions-text">
					{{ recipeDetails.strInstructions }}
				</p>

				<!-- Source/Video Links -->
				<div class="mt-4">
					<a
						v-if="recipeDetails.strSource"
						:href="recipeDetails.strSource"
						target="_blank"
						class="btn btn-sm btn-outline-secondary me-2"
						>View Source</a
					>
					<a
						v-if="recipeDetails.strYoutube"
						:href="recipeDetails.strYoutube"
						target="_blank"
						class="btn btn-sm btn-danger"
						>Watch Video</a
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

// Initialize router for back button
const router = useRouter();

// Define props received from the router
const props = defineProps({
	id: {
		// Matches the :id parameter in the route path
		type: String,
		required: true,
	},
});

const recipeDetails = ref(null);
const loading = ref(false);
const error = ref(null);

// --- START AFFILIATE LINK CONFIG ---
const AMAZON_AFFILIATE_TAG = "awzdigital00-21"; // Your Amazon affiliate tag
const AMAZON_BASE_URL = "https://www.amazon.in/s";

const getAmazonSearchUrl = (searchTerm) => {
	if (!searchTerm) return "#"; // Return a harmless link if search term is empty
	const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
	return `${AMAZON_BASE_URL}?k=${encodedSearchTerm}&tag=${AMAZON_AFFILIATE_TAG}`;
};
// --- END AFFILIATE LINK CONFIG ---

// Back navigation method
const goBack = () => {
	router.go(-1);
};

// Function to fetch full recipe details by ID
const fetchRecipeDetails = async (recipeId) => {
	console.log(`Fetching details for recipe ID: ${recipeId}`);
	loading.value = true;
	error.value = null;
	recipeDetails.value = null;
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.meals && data.meals.length > 0) {
			recipeDetails.value = data.meals[0];
			// Optional: Process ingredients/measures into a cleaner array here if needed
		} else {
			throw new Error(`Recipe with ID ${recipeId} not found.`);
		}
	} catch (e) {
		console.error("Error fetching recipe details:", e);
		error.value = `Failed to load recipe details: ${e.message}`;
	} finally {
		loading.value = false;
	}
};

// Computed property to process ingredients/measures
const ingredientsList = computed(() => {
	if (!recipeDetails.value) return [];
	const list = [];
	for (let i = 1; i <= 20; i++) {
		const ingredient = recipeDetails.value[`strIngredient${i}`];
		const measure = recipeDetails.value[`strMeasure${i}`];
		// Check if both ingredient and measure exist and are not empty/null
		if (ingredient && ingredient.trim() && measure && measure.trim()) {
			list.push({ name: ingredient, measure: measure });
		}
		// Optional: Include ingredients even if measure is blank/null
		// else if (ingredient && ingredient.trim()) {
		//     list.push({ name: ingredient, measure: '' });
		// }
	}
	return list;
});

// Fetch details when the component mounts
onMounted(() => {
	fetchRecipeDetails(props.id);
});

// Optional: Watch for changes in the prop if needed
watch(
	() => props.id,
	(newId) => {
		fetchRecipeDetails(newId);
	}
);
</script>
