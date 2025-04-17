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
import ErrorMessage from "../components/ErrorMessage.vue";
import SkeletonCard from "../components/SkeletonCard.vue";
import BackButton from "@/components/BackButton.vue";

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
