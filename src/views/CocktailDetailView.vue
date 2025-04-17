<template>
	<section class="block cocktail-detail-view pt-0">
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
					<!-- No favorite button placeholder needed for cocktails yet -->
				</div>
				<!-- Meta Placeholder -->
				<p class="placeholder-glow small mb-3">
					<span class="placeholder col-3 me-2"></span>
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
		<div v-else-if="cocktail" class="recipe-content">
			<!-- Image Header -->
			<div class="image-header position-relative mb-3">
				<img
					:src="cocktail.strDrinkThumb + '/preview'"
					class="img-fluid recipe-image"
					:alt="cocktail.strDrink"
				/>
			</div>

			<div class="container recipe-body px-4 py-2">
				<!-- Header Row with Back Button, Title -->
				<div class="d-flex align-items-center mb-4 view-header">
					<BackButton
						class="btn btn-light btn-sm rounded-circle me-3 back-button-icon"
					/>
					<h2 class="mb-0 flex-grow-1 section-title">
						{{ cocktail.strDrink }}
					</h2>
				</div>

				<!-- Meta Info -->
				<p class="text-muted small mb-3">
					<span v-if="cocktail.strCategory"
						>Category: {{ cocktail.strCategory }}</span
					>
					<span v-if="cocktail.strAlcoholic">
						| Type: {{ cocktail.strAlcoholic }}</span
					>
					<span v-if="cocktail.strGlass">
						| Glass:
						<a
							:href="getAmazonSearchUrl(cocktail.strGlass)"
							target="_blank"
							rel="noopener sponsored"
							>{{ cocktail.strGlass }}</a
						>
					</span>
				</p>
				<p v-if="cocktail.strTags" class="mb-3">
					<span
						class="badge bg-secondary me-1"
						v-for="tag in cocktail.strTags.split(',')"
						:key="tag"
						>{{ tag.trim() }}</span
					>
				</p>

				<!-- Ingredients -->
				<h5 class="mt-4">Ingredients</h5>
				<ul class="list-unstyled ingredients-list mb-4">
					<li
						class="d-flex align-items-center mb-2"
						v-for="ingredient in ingredientsList"
						:key="ingredient.name"
					>
						<div class="flex-grow-1">
							<a
								:href="getAmazonSearchUrl(ingredient.name)"
								target="_blank"
								rel="noopener sponsored"
								>{{ ingredient.name }}</a
							>
						</div>
						<div class="text-muted ms-2" v-if="ingredient.measure">
							{{ ingredient.measure }}
						</div>
					</li>
				</ul>

				<!-- Instructions -->
				<h5 class="mt-4">Instructions</h5>
				<p class="instructions-text">
					{{ cocktail.strInstructions }}
				</p>
			</div>
		</div>

		<!-- Not Found State -->
		<div v-else class="alert alert-warning container p-4">
			Cocktail details could not be found.
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCocktailDetailsById } from "@/services/cocktailApi.js";
import ErrorMessage from "@/components/ErrorMessage.vue";
import BackButton from "@/components/BackButton.vue";
import { getAmazonSearchUrl } from "@/utils/affiliateLinks.js";

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

const route = useRoute();
const router = useRouter(); // Initialize router
const loading = ref(false);
const error = ref(null);
const cocktail = ref(null);

const fetchCocktailDetails = async (cocktailId) => {
	loading.value = true;
	error.value = null;
	cocktail.value = null;
	try {
		cocktail.value = await getCocktailDetailsById(cocktailId);
		if (!cocktail.value) {
			// Handle case where API returns null/empty for the ID
			throw new Error("Cocktail not found by the API.");
		}
	} catch (e) {
		console.error("Error fetching cocktail details:", e);
		error.value =
			e.message || "An unexpected error occurred while loading details.";
	} finally {
		loading.value = false;
	}
};

// Computed property to generate the ingredients list
const ingredientsList = computed(() => {
	if (!cocktail.value) return [];
	const list = [];
	for (let i = 1; i <= 15; i++) {
		const ingredient = cocktail.value[`strIngredient${i}`];
		const measure = cocktail.value[`strMeasure${i}`];
		if (ingredient) {
			list.push({
				name: ingredient.trim(),
				measure: measure ? measure.trim() : null,
			});
		} else {
			// Stop processing if no more ingredients
			break;
		}
	}
	return list;
});

// Fetch on initial mount
onMounted(() => {
	fetchCocktailDetails(props.id);
});

// Watch for route changes (if user navigates directly from one cocktail to another)
watch(
	() => props.id,
	(newId) => {
		fetchCocktailDetails(newId);
	}
);
</script>

<style scoped>
/* Styles should target common classes like .recipe-detail-view, .recipe-body, etc. */
/* Add specific rules to scss/layout/_cocktail-detail.scss or _recipe-detail.scss if needed */
</style>
