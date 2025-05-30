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
					:src="cocktail.strDrinkThumb + '/large'"
					class="img-fluid recipe-image"
					:alt="cocktail.strDrink"
				/>
			</div>

			<div class="container recipe-body px-4 py-2">
				<!-- Header Row -->
				<div class="d-flex align-items-center mb-4 view-header">
					<BackButton
						class="btn btn-light btn-sm rounded-circle me-3 back-button-icon"
					/>
					<h2 class="mb-0 flex-grow-1 section-title">
						{{ cocktail.strDrink }}
					</h2>
					<!-- Share Icon Button -->
					<button
						@click="openShareModal"
						class="btn btn-sm btn-light rounded-circle ms-3 action-icon"
						title="Share Cocktail"
						aria-label="Share Cocktail"
					>
						<i class="pi pi-share-alt"></i>
					</button>
					<!-- Favorite Button -->
					<button
						@click="toggleFavorite"
						class="btn btn-outline-danger btn-sm rounded-circle ms-2 favorite-button"
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
import { ref, onMounted, watch, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCocktailDetailsById } from "@/services/cocktailApi.js";
import ErrorMessage from "@/components/ErrorMessage.vue";
import BackButton from "@/components/BackButton.vue";
import { getAmazonSearchUrl } from "@/utils/affiliateLinks.js";
import { useCocktailFavorites } from "@/composables/useCocktailFavorites.js";
import ShareButtons from "@/components/ShareButtons.vue";
import { useHead } from "@unhead/vue";

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const error = ref(null);
const cocktail = ref(null);

// --- Composables ---
const { addFavorite, removeFavorite, isFavorite } = useCocktailFavorites();

// --- Reactive State for Favorite Button ---
const isCurrentFavorite = isFavorite(props.id);

// --- START INGREDIENT IMAGE LOGIC ---
const getIngredientImageUrl = (ingredientName) => {
	if (!ingredientName) return ""; // Handle empty name
	// Replace spaces with underscores and encode for URL
	const formattedName = encodeURIComponent(
		ingredientName.trim().replace(/ /g, "_")
	);
	// Use the medium thumbnail version
	return `https://www.thecocktaildb.com/images/ingredients/${formattedName}-medium.png`;
};
// --- END INGREDIENT IMAGE LOGIC ---

// --- Toggle Favorite Function ---
const toggleFavorite = () => {
	if (isCurrentFavorite.value) {
		removeFavorite(props.id);
	} else {
		addFavorite(props.id);
	}
};

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

// --- Computed values for Share and Meta ---
const shareText = computed(() => {
	return cocktail.value?.strInstructions
		? cocktail.value.strInstructions.substring(0, 160) + "..."
		: `Learn how to make the ${
				cocktail.value?.strDrink || "this cocktail"
		  }.`;
});

const pageUrl = computed(() => {
	// Use canonical URL if available and cocktail exists, otherwise fallback
	return cocktail.value?.idDrink
		? `${window.location.origin}/cocktail/${cocktail.value.idDrink}`
		: window.location.href;
});

// Create a computed property for meta tags based on cocktail details
const metaTags = computed(() => {
	if (!cocktail.value)
		return {
			title: "Cocktail Detail - ChloroFill 🍴🍹",
			meta: [],
		};

	const details = cocktail.value;
	const title = `${details.strDrink} - ChloroFill Cocktail`;
	const description = details.strInstructions
		? `${details.strDrink} cocktail - ${details.strInstructions.substring(
				0,
				120
		  )}...`
		: `Learn how to make ${details.strDrink}. Get the full cocktail recipe on ChloroFill.`;
	const image = details.strDrinkThumb;
	const url = window.location.href;

	return {
		title,
		meta: [
			{ key: "description", name: "description", content: description },
			{ key: "og:title", property: "og:title", content: title },
			{
				key: "og:description",
				property: "og:description",
				content: description,
			},
			{ key: "og:image", property: "og:image", content: image },
			{ key: "og:url", property: "og:url", content: url },
			{ key: "og:type", property: "og:type", content: "article" },
			{
				key: "og:site_name",
				property: "og:site_name",
				content: "ChloroFill",
			},
			{
				key: "twitter:card",
				name: "twitter:card",
				content: "summary_large_image",
			},
			{ key: "twitter:title", name: "twitter:title", content: title },
			{
				key: "twitter:description",
				name: "twitter:description",
				content: description,
			},
			{ key: "twitter:image", name: "twitter:image", content: image },
		],
		// Set a high priority to ensure these tags override static ones
		tagPriority: 10,
	};
});

// Use useHead at the setup level with the computed property
useHead(metaTags);

// Inject the global openShareModal function
const openShareModalFunc = inject("openShareModal");

// Update share handler to call the injected function
const openShareModal = () => {
	if (openShareModalFunc && cocktail.value) {
		openShareModalFunc({
			title: cocktail.value.strDrink,
			url: pageUrl.value, // Use existing computed url
			text: shareText.value, // Use existing computed text
		});
	} else {
		console.error(
			"openShareModal function not injected or cocktail details missing"
		);
	}
};

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
