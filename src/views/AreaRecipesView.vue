<template>
	<div class="area-recipes-view container py-4">
		<!-- Header with Back Button -->
		<div class="d-flex align-items-center mb-4 view-header">
			<button
				@click="goBack"
				class="btn btn-light btn-sm rounded-circle me-3 back-button-icon"
			>
				<i class="pi pi-arrow-left"></i>
			</button>
			<h2 class="mb-0 flex-grow-1">{{ areaName }} Recipes</h2>
		</div>

		<LoadingSpinner v-if="loading" />
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
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import ItemCard from "../components/ItemCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

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

const goBack = () => {
	router.go(-1);
};

const fetchRecipesByArea = async (area) => {
	console.log(`Fetching recipes for area: ${area}`);
	loading.value = true;
	error.value = null;
	recipes.value = [];
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
				area
			)}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.meals) {
			recipes.value = data.meals;
		} else {
			recipes.value = [];
			console.log(`No meals found for area: ${area}`);
		}
	} catch (e) {
		console.error("Error fetching recipes by area:", e);
		error.value = `Failed to load recipes: ${e.message}`;
	} finally {
		loading.value = false;
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

<style scoped>
/* Use styles from _category-recipes.scss or create _area-recipes.scss if needed */
.view-header h2 {
	font-weight: 600;
}

.back-button-icon {
	width: 35px;
	height: 35px;
	line-height: 1;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--bs-box-shadow-sm);
}
</style>
