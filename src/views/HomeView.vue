<template>
	<div class="home-view py-4">
		<section class="hero">
			<div class="container">
				<div class="welcome-header mb-4 text-md-center">
					<p class="text-muted mb-1">Hello, {{ userGreeting }}</p>
					<!-- Add user name later if implementing auth -->
					<h2>What would you like<br />to cook today?</h2>

					<!-- Search -->
					<RecipeSearch class="mt-3 mb-4" />
				</div>
			</div>
		</section>

		<section class="recipe-section mb-5">
			<div class="container">
				<div
					class="d-flex justify-content-between align-items-center mb-3"
				>
					<h4 class="section-title">Featured Recipes</h4>
					<!-- Optional: Link to Categories view -->
					<router-link
						:to="{ name: 'Categories' }"
						class="btn btn-sm btn-outline-secondary"
						>See all</router-link
					>
				</div>

				<!-- Loading State with Skeleton Cards -->
				<div
					v-if="loadingFeatured"
					class="row row-cols-2 row-cols-md-4 g-4 placeholder-glow"
				>
					<SkeletonCard v-for="n in 4" :key="'sk-' + n" />
				</div>
				<!-- Error State -->
				<ErrorMessage
					v-else-if="errorFeatured"
					:message="errorFeatured"
				/>
				<!-- Recipe Grid -->
				<div
					v-else-if="featuredRecipes.length > 0"
					class="row row-cols-2 row-cols-md-4 g-4"
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
						:item-id="recipe.idMeal"
						item-type="meal"
						:is-favorite="isFavoriteMeal(recipe.idMeal)"
						@toggle-favorite="handleToggleFavorite"
						@share-item="handleShareItem"
					/>
				</div>
				<!-- No Recipes Found -->
				<p v-else>Could not load featured recipes.</p>
			</div>
		</section>

		<!-- === Featured Cocktail Section (Using ItemCard) === -->
		<section class="cocktail-section mb-5">
			<div class="container">
				<div
					class="d-flex justify-content-between align-items-center mb-3"
				>
					<h4 class="section-title">Featured Cocktails</h4>
					<!-- Optional: Link to Cocktails view -->
					<router-link
						:to="{ name: 'Cocktails' }"
						class="btn btn-sm btn-outline-secondary"
						>Explore More</router-link
					>
				</div>
				<!-- Loading State -->
				<div
					v-if="loadingCocktails"
					class="row row-cols-2 row-cols-md-4 g-4 placeholder-glow"
				>
					<SkeletonCard v-for="n in 4" :key="'sk-cocktail-' + n" />
				</div>
				<!-- Error State -->
				<ErrorMessage
					v-else-if="errorCocktails"
					:message="errorCocktails"
				/>
				<!-- Cocktail Cards Display (Using ItemCard) -->
				<div
					v-else-if="featuredCocktails.length > 0"
					class="row row-cols-2 row-cols-md-4 g-4"
				>
					<ItemCard
						v-for="cocktail in featuredCocktails"
						:key="cocktail.idDrink"
						:image-url="cocktail.strDrinkThumb"
						:title="cocktail.strDrink"
						:link-to="{
							name: 'CocktailDetail',
							params: { id: cocktail.idDrink },
						}"
						:item-id="cocktail.idDrink"
						item-type="cocktail"
						:is-favorite="isFavoriteCocktail(cocktail.idDrink)"
						@toggle-favorite="handleToggleFavorite"
						@share-item="handleShareItem"
					/>
				</div>
				<!-- No Cocktails Found -->
				<p v-else>Could not load featured cocktails.</p>
			</div>
		</section>
		<!-- === End Featured Cocktail Section === -->

		<section class="recipe-section mb-5">
			<div class="container">
				<div
					class="d-flex justify-content-between align-items-center mb-3"
				>
					<h4 class="section-title">Categories</h4>
					<router-link
						:to="{ name: 'Categories' }"
						class="btn btn-sm btn-outline-secondary"
						>See all</router-link
					>
				</div>
				<CategoryCarousel />
			</div>
		</section>

		<!-- Recommendations Section (Conditional & Using ItemCard) -->
		<template v-if="combinedFavoriteIds.length > 0">
			<section class="recipe-section mb-5">
				<div class="container">
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
						class="row row-cols-2 row-cols-md-4 g-4 placeholder-glow"
					>
						<SkeletonCard v-for="n in 4" :key="'sk-rec-' + n" />
					</div>
					<!-- Error State -->
					<ErrorMessage
						v-else-if="errorRecommended"
						:message="errorRecommended"
					/>
					<!-- Combined Grid -->
					<div
						v-else-if="recommendedItems.length > 0"
						class="row row-cols-2 row-cols-md-4 g-4"
					>
						<template
							v-for="item in recommendedItems"
							:key="
								item.type + '-' + (item.idMeal || item.idDrink)
							"
						>
							<ItemCard
								v-if="
									(item.type === 'meal' && item.idMeal) ||
									(item.type === 'cocktail' && item.idDrink)
								"
								:image-url="
									item.type === 'meal'
										? item.strMealThumb
										: item.strDrinkThumb
								"
								:title="
									item.type === 'meal'
										? item.strMeal
										: item.strDrink
								"
								:link-to="
									item.type === 'meal'
										? {
												name: 'RecipeDetail',
												params: { id: item.idMeal },
										  }
										: {
												name: 'CocktailDetail',
												params: { id: item.idDrink },
										  }
								"
								:item-id="
									item.type === 'meal'
										? item.idMeal
										: item.idDrink
								"
								:item-type="item.type"
								:is-favorite="
									item.type === 'meal'
										? isFavoriteMeal(item.idMeal)
										: isFavoriteCocktail(item.idDrink)
								"
								@toggle-favorite="handleToggleFavorite"
								@share-item="handleShareItem"
							/>
						</template>
					</div>
					<!-- No Recommendations Found -->
					<p v-else class="text-muted">
						Could not load recommendations at this time.
					</p>
				</div>
			</section>
		</template>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject } from "vue";
import { RouterLink } from "vue-router";
import ItemCard from "../components/ItemCard.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import CategoryCarousel from "../components/CategoryCarousel.vue";
import RecipeSearch from "../components/RecipeSearch.vue";
import SkeletonCard from "../components/SkeletonCard.vue";
import ShareButtons from "../components/ShareButtons.vue";
import { useFavorites } from "../composables/useFavorites";
import { useCocktailFavorites } from "../composables/useCocktailFavorites.js";
import { getRandomCocktail } from "@/services/cocktailApi.js";
import {
	getMealsByCategory,
	getMealDetailsById,
	getRandomMeal,
} from "@/services/mealApi.js";

// Inject the global openShareModal function
const openShareModal = inject("openShareModal");

//const userName = ref(null); // Username
const userGreeting = ref("");
const {
	favoriteIds: mealFavoriteIds,
	addFavorite: addMealFavorite,
	removeFavorite: removeMealFavorite,
	isFavorite: isFavoriteMeal,
} = useFavorites();
const {
	favoriteCocktailIds,
	addFavorite: addCocktailFavorite,
	removeFavorite: removeCocktailFavorite,
	isFavorite: isFavoriteCocktail,
} = useCocktailFavorites();

// Featured Recipes State
const featuredRecipes = ref([]);
const loadingFeatured = ref(false);
const errorFeatured = ref(null);

// Recommendations State
const recommendedItems = ref([]); // Holds combined meals & cocktails
const loadingRecommended = ref(false);
const errorRecommended = ref(null);

// === Featured Cocktail State ===
const featuredCocktails = ref([]);
const loadingCocktails = ref(false);
const errorCocktails = ref(null);
// === End Featured Cocktail State ===

// Combine meal and cocktail IDs for triggering recommendation fetch
const combinedFavoriteIds = computed(() => [
	...mealFavoriteIds.value,
	...favoriteCocktailIds.value,
]);

// Fetch user greeting based on current time
const fetchUserGreeting = async () => {
	const currentTime = new Date();
	const hours = currentTime.getHours();

	if (hours < 12) {
		userGreeting.value = "Good Morning";
	} else if (hours < 18) {
		userGreeting.value = "Good Afternoon";
	} else {
		userGreeting.value = "Good Evening";
	}
};

// Fetch featured recipes (random recipes from different categories)
const fetchFeaturedRecipes = async () => {
	loadingFeatured.value = true;
	errorFeatured.value = null;
	featuredRecipes.value = [];

	try {
		// Fetch 4 random meals
		const randomMeals = [];
		for (let i = 0; i < 4; i++) {
			const meal = await getRandomMeal();
			if (meal) {
				const isDuplicate = randomMeals.some(
					(m) => m.idMeal === meal.idMeal
				);
				if (!isDuplicate) {
					randomMeals.push(meal);
				} else {
					i--; // Decrement to try again if duplicate
				}
			}
		}
		featuredRecipes.value = randomMeals;

		if (featuredRecipes.value.length === 0) {
			console.warn("No random meals found for featured section");
		}
	} catch (e) {
		console.error("Error fetching featured recipes:", e);
		errorFeatured.value = `Failed to load featured recipes: ${e.message}`;
	} finally {
		loadingFeatured.value = false;
	}
};

// === Fetch Featured Cocktails ===
const fetchFeaturedCocktails = async () => {
	loadingCocktails.value = true;
	errorCocktails.value = null;
	featuredCocktails.value = [];

	try {
		// Fetch 4 random cocktails
		const randomCocktails = [];
		for (let i = 0; i < 4; i++) {
			const cocktail = await getRandomCocktail();
			if (cocktail) {
				const isDuplicate = randomCocktails.some(
					(c) => c.idDrink === cocktail.idDrink
				);
				if (!isDuplicate) {
					randomCocktails.push(cocktail);
				} else {
					i--; // Decrement to try again
				}
			}
		}
		featuredCocktails.value = randomCocktails;

		if (featuredCocktails.value.length === 0) {
			console.warn("No random cocktails found for featured section");
		}
	} catch (e) {
		console.error("Error fetching featured cocktails:", e);
		errorCocktails.value = `Failed to load featured cocktails: ${e.message}`;
	} finally {
		loadingCocktails.value = false;
	}
};
// === End Fetch Featured Cocktails ===

// Fetch recommendations
const fetchRecommendations = async () => {
	// Only fetch if there are meal favorites (current logic base)
	if (mealFavoriteIds.value.length === 0) {
		console.log("No meal favorites found, skipping recommendations.");
		recommendedItems.value = []; // Ensure list is empty
		return;
	}

	loadingRecommended.value = true;
	errorRecommended.value = null;
	recommendedItems.value = []; // Clear previous recommendations
	// console.log("Fetching recommendations based on meal favorites...");

	let fetchedMeals = [];
	let fetchedCocktails = [];

	try {
		// --- Fetch Meal Recommendations (existing logic) ---
		const randomIndex = Math.floor(
			Math.random() * mealFavoriteIds.value.length
		);
		const randomFavId = mealFavoriteIds.value[randomIndex];
		const detailData = await getMealDetailsById(randomFavId);
		if (detailData && detailData.strCategory) {
			const sourceCategory = detailData.strCategory;
			const recommendData = await getMealsByCategory(sourceCategory);
			const featuredIds = featuredRecipes.value.map((r) => r.idMeal);
			const filteredMeals = recommendData
				.filter(
					(r) =>
						r.idMeal &&
						!featuredIds.includes(r.idMeal) &&
						r.idMeal !== randomFavId
				)
				.slice(0, 4)
				.map((meal) => ({ ...meal, type: "meal" }));
			fetchedMeals = filteredMeals;
			// console.log("Recommended Meals Fetched:", fetchedMeals);
		} else {
			console.warn(
				`Could not get category for favorite meal ${randomFavId} or no category found.`
			);
		}

		// --- Fetch Random Cocktails (Option B implementation) ---
		try {
			// Fetch 1 or 2 random cocktails
			const cocktail1 = await getRandomCocktail();
			const cocktail2 = await getRandomCocktail();
			if (cocktail1 && cocktail1.idDrink) {
				fetchedCocktails.push({ ...cocktail1, type: "cocktail" });
			}
			// Avoid duplicates if API returns same random cocktail twice AND check idDrink
			if (
				cocktail2 &&
				cocktail2.idDrink &&
				cocktail2.idDrink !== cocktail1?.idDrink
			) {
				fetchedCocktails.push({ ...cocktail2, type: "cocktail" });
			}
			// console.log("Recommended Cocktails Fetched:", fetchedCocktails);
		} catch (cocktailError) {
			console.error(
				"Could not fetch recommended cocktails:",
				cocktailError
			);
			// Optionally set a partial error message, but don't overwrite meal error
			if (!errorRecommended.value) {
				errorRecommended.value =
					"Could not load cocktail recommendations.";
			}
		}

		// Combine and assign (only include valid items)
		recommendedItems.value = [...fetchedMeals, ...fetchedCocktails].filter(
			(item) => item.idMeal || item.idDrink
		);
		// Optional: Shuffle combined list?
		// recommendedItems.value.sort(() => Math.random() - 0.5);

		if (recommendedItems.value.length === 0 && !errorRecommended.value) {
			console.warn("No recommendations could be generated.");
		}
	} catch (e) {
		// Catch errors from meal fetching part
		console.error("Error fetching meal recommendations:", e);
		errorRecommended.value = `Failed to load recommendations: ${e.message}`;
		// Still try to fetch cocktails even if meals fail?
		// For simplicity, we stop here if meal part fails, but could add cocktail fetch in finally.
	} finally {
		loadingRecommended.value = false;
	}
};

// Fetch when the component is mounted
onMounted(async () => {
	// Fetch essentials concurrently
	Promise.all([fetchFeaturedRecipes(), fetchFeaturedCocktails()]).then(() => {
		// Once featured sections are loaded (or failed),
		// fetch recommendations based on favorites (if any meal favs exist)
		fetchRecommendations();
	});
	fetchUserGreeting();
});

// Watch combined favorites (optional - maybe too noisy?)
// watch(combinedFavoriteIds, fetchRecommendations, { deep: true });

// --- Event Handlers ---
const handleToggleFavorite = ({ id, type }) => {
	if (type === "meal") {
		if (isFavoriteMeal(id)) {
			removeMealFavorite(id);
		} else {
			addMealFavorite(id);
		}
	} else if (type === "cocktail") {
		if (isFavoriteCocktail(id)) {
			removeCocktailFavorite(id);
		} else {
			addCocktailFavorite(id);
		}
	}
};

// Update share handler to call the injected function
const handleShareItem = ({ title, url }) => {
	if (openShareModal) {
		openShareModal({ title, url, text: `Check out this recipe: ${title}` }); // Pass payload
	} else {
		console.error("openShareModal function not injected in HomeView");
	}
};

// Watch combined favorites to refetch recommendations
watch(combinedFavoriteIds, (newVal, oldVal) => {
	if (newVal.length > 0 && newVal.length !== oldVal.length) {
		fetchRecommendations();
	}
});
</script>

<style scoped>
/* No scoped styles needed - use global layout files */
</style>
