<template>
	<section class="block recipe-detail-view pt-0">
		<!-- Loading State with Placeholders -->
		<div v-if="loading" class="recipe-detail-placeholder placeholder-glow">
			<!-- Image Placeholder -->
			<div class="placeholder image-header-placeholder mb-3"></div>
			<div class="container recipe-body px-4 py-2">
				<!-- Header Placeholder -->
				<div class="d-flex align-items-center mb-4 view-header">
					<span
						class="placeholder back-button-placeholder me-3"
					></span>
					<h2 class="mb-0 flex-grow-1 placeholder col-8"></h2>
					<span
						class="placeholder favorite-button-placeholder ms-3"
					></span>
				</div>
				<!-- Meta Placeholder -->
				<p class="placeholder-glow small mb-3">
					<span class="placeholder col-3 me-2"></span>
					<span class="placeholder col-3"></span>
				</p>
				<!-- Tags Placeholder (Optional) -->
				<p class="placeholder-glow mb-3">
					<span class="placeholder col-2 me-1"></span>
					<span class="placeholder col-3 me-1"></span>
				</p>
				<!-- Ingredients Placeholder -->
				<h5 class="mt-4 placeholder col-4"></h5>
				<ul class="list-unstyled ingredients-list mb-4">
					<li
						v-for="n in 5"
						:key="'sk-ing-' + n"
						class="d-flex align-items-center mb-2 placeholder-glow"
					>
						<span
							class="placeholder ingredient-thumbnail-placeholder me-2"
						></span>
						<span class="placeholder col-5 me-2"></span>
						<span class="placeholder col-3 ms-auto"></span>
					</li>
				</ul>
				<!-- Instructions Placeholder -->
				<h5 class="mt-4 placeholder col-5"></h5>
				<p class="placeholder-glow">
					<span class="placeholder col-12 mb-1"></span>
					<span class="placeholder col-10"></span>
					<span class="placeholder col-11 mb-1"></span>
					<span class="placeholder col-8"></span>
				</p>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="container p-4">
			<ErrorMessage :message="error" />
		</div>

		<!-- Content State -->
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
				<!-- Header Row with Back Button, Title, and Favorite Button -->
				<div class="d-flex align-items-center mb-4 view-header">
					<BackButton
						class="btn btn-light btn-sm rounded-circle me-3 back-button-icon"
					/>
					<h2 class="mb-0 flex-grow-1 section-title">
						{{ recipeDetails.strMeal }}
					</h2>
					<!-- Favorite Button -->
					<button
						@click="toggleFavorite"
						class="btn btn-outline-danger btn-sm rounded-circle ms-3 favorite-button"
						:class="{ active: isCurrentFavorite }"
						:aria-label="
							isCurrentFavorite
								? 'Remove from favorites'
								: 'Add to favorites'
						"
					>
						<i
							:class="
								isCurrentFavorite
									? 'pi pi-heart-fill'
									: 'pi pi-heart'
							"
						></i>
					</button>
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
						<!-- Ingredient Thumbnail -->
						<img
							:src="getIngredientImageUrl(ingredient.name)"
							:alt="ingredient.name"
							class="ingredient-thumbnail me-2"
							@error="
								($event) =>
									($event.target.style.display = 'none')
							"
						/>
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
	</section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import ErrorMessage from "../components/ErrorMessage.vue";
import { useFavorites } from "../composables/useFavorites";
import BackButton from "@/components/BackButton.vue";
import { getAmazonSearchUrl } from "@/utils/affiliateLinks.js";
import { getMealDetailsById } from "@/services/mealApi.js";
import { useHead } from "@vueuse/head";

// Initialize router for back button
// const router = useRouter(); // No longer needed if BackButton handles it

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

// --- Composables ---
const { addFavorite, removeFavorite, isFavorite } = useFavorites();

// --- Reactive State ---
const isCurrentFavorite = isFavorite(props.id);

// --- START INGREDIENT IMAGE LOGIC ---
const getIngredientImageUrl = (ingredientName) => {
	if (!ingredientName) return ""; // Handle empty name
	// Replace spaces with underscores and encode for URL
	const formattedName = encodeURIComponent(
		ingredientName.trim().replace(/ /g, "_")
	);
	// Use the small thumbnail version
	return `https://www.themealdb.com/images/ingredients/${formattedName}-medium.png`;
};
// --- END INGREDIENT IMAGE LOGIC ---

// Toggle favorite status
const toggleFavorite = () => {
	if (isCurrentFavorite.value) {
		removeFavorite(props.id);
	} else {
		addFavorite(props.id);
	}
	// Note: isCurrentFavorite updates reactively because it's based on favoriteIds
};

// Function to fetch full recipe details by ID using service
const fetchRecipeDetails = async (recipeId) => {
	// console.log(`Fetching details for recipe ID: ${recipeId}`);
	loading.value = true;
	error.value = null;
	recipeDetails.value = null;
	try {
		// Use service function
		recipeDetails.value = await getMealDetailsById(recipeId);

		if (!recipeDetails.value) {
			throw new Error(`Recipe with ID ${recipeId} not found.`);
		}
	} catch (e) {
		console.error("Error fetching recipe details:", e);
		error.value = `Failed to load recipe details: ${e.message}`; // Error from service
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

// --- Dynamic Meta Tags ---
useHead(
	computed(() => {
		if (!recipeDetails.value) {
			return { title: "Recipe Details" }; // Default while loading or if error
		}
		const description = recipeDetails.value.strInstructions
			? recipeDetails.value.strInstructions.substring(0, 160) + "..."
			: `Details for ${recipeDetails.value.strMeal}`;

		// Construct the canonical URL - adjust if your base URL is different or comes from env vars
		const canonicalUrl = `${window.location.origin}/recipe/${recipeDetails.value.idMeal}`;

		return {
			title: recipeDetails.value.strMeal,
			meta: [
				{
					name: "description",
					content: description,
				},
				// Open Graph Tags
				{
					property: "og:title",
					content: recipeDetails.value.strMeal,
				},
				{
					property: "og:description",
					content: description,
				},
				{
					property: "og:image",
					content: recipeDetails.value.strMealThumb, // Use the meal thumbnail
				},
				{
					property: "og:type",
					content: "article", // Or 'website' if more appropriate
				},
				{
					property: "og:url",
					content: canonicalUrl,
				},
				// Add other relevant meta tags like twitter cards if needed
			],
			link: [
				{
					rel: "canonical",
					href: canonicalUrl,
				},
			],
		};
	})
);
// --- End Meta Tags ---

// Fetch details when the component mounts
onMounted(() => {
	fetchRecipeDetails(props.id);
});

// Optional: Watch for changes in the prop if needed
watch(
	() => props.id,
	(newId) => {
		fetchRecipeDetails(newId);
		// Note: isCurrentFavorite will update automatically due to reactivity
	}
);
</script>
