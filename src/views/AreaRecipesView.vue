<template>
	<div class="area-recipes-view container py-4">
		<!-- Header with Back Button and Title -->
		<div class="d-flex align-items-center mb-4 view-header">
			<BackButton class="me-3" />
			<h2 class="mb-0 flex-grow-1 section-title">
				{{ areaName }} Recipes
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
			class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
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
				:item-id="recipe.idMeal"
				item-type="meal"
				:is-favorite="isFavoriteMeal(recipe.idMeal)"
				@toggle-favorite="handleToggleFavorite"
				@share-item="handleShareItem"
			/>
		</div>
		<!-- No Recipes Found State -->
		<div v-else>
			<p class="alert alert-info">
				No recipes found for the area "{{ areaName }}".
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from "vue";
import { useRouter } from "vue-router";
import ItemCard from "../components/ItemCard.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import SkeletonCard from "../components/SkeletonCard.vue";
import BackButton from "@/components/BackButton.vue";
import { getMealsByArea } from "@/services/mealApi.js";
import { useFavorites } from "../composables/useFavorites.js";

// Inject the global openShareModal function
const openShareModal = inject("openShareModal");

// Use favorites composable
const {
	addFavorite,
	removeFavorite,
	isFavorite: isFavoriteMeal,
} = useFavorites();

const router = useRouter();

const props = defineProps({
	areaName: {
		type: String,
		required: true,
	},
});

const recipes = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchRecipesByArea = async (area) => {
	console.log(`Fetching recipes for area: ${area}`);
	loading.value = true;
	error.value = null;
	recipes.value = [];
	try {
		recipes.value = await getMealsByArea(area);
		if (recipes.value.length === 0) {
			console.log(`No meals found for area: ${area}`);
		}
	} catch (e) {
		console.error("Error fetching recipes by area:", e);
		error.value = `Failed to load recipes: ${e.message}`;
	} finally {
		loading.value = false;
	}
};

// --- Event Handlers (Added) ---
const handleToggleFavorite = ({ id, type }) => {
	// Only handle meals in this view
	if (type === "meal") {
		if (isFavoriteMeal(id)) {
			removeFavorite(id);
		} else {
			addFavorite(id);
		}
	}
};

const handleShareItem = ({ title, url }) => {
	if (openShareModal) {
		openShareModal({ title, url, text: `Check out this recipe: ${title}` });
	} else {
		console.error(
			"openShareModal function not injected in AreaRecipesView"
		);
	}
};

onMounted(() => {
	fetchRecipesByArea(props.areaName);
});

watch(
	() => props.areaName,
	(newArea) => {
		fetchRecipesByArea(newArea);
	}
);
</script>
