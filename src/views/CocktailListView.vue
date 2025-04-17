<template>
	<div class="category-recipes-view container py-4">
		<!-- Header with Back Button and Title -->
		<div class="d-flex align-items-center mb-4 view-header">
			<BackButton class="me-3" />
			<h2 class="mb-0 flex-grow-1 section-title">{{ pageTitle }}</h2>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading"
			class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 placeholder-glow"
		>
			<SkeletonCard v-for="n in 8" :key="'sk-' + n" />
		</div>

		<!-- Error State -->
		<ErrorMessage v-else-if="error" :message="error" />

		<!-- No Results State -->
		<div v-else-if="cocktails.length === 0" class="alert alert-info">
			No cocktails found matching this filter.
		</div>

		<!-- Cocktails Grid -->
		<div
			v-else
			class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
		>
			<CocktailCard
				v-for="cocktail in cocktails"
				:key="cocktail.idDrink"
				:image-url="cocktail.strDrinkThumb"
				:title="cocktail.strDrink"
				:link-to="{
					name: 'CocktailDetail',
					params: { id: cocktail.idDrink },
				}"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { getCocktailsByFilter } from "@/services/cocktailApi.js";
import CocktailCard from "@/components/CocktailCard.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";
import BackButton from "@/components/BackButton.vue";

const props = defineProps({
	filterType: {
		type: String,
		required: true,
	},
	filterValue: {
		type: String,
		required: true,
	},
});

const route = useRoute();
const loading = ref(false);
const error = ref(null);
const cocktails = ref([]);

const fetchCocktails = async (type, value) => {
	loading.value = true;
	error.value = null;
	cocktails.value = [];
	try {
		cocktails.value = await getCocktailsByFilter(type, value);
	} catch (e) {
		console.error("Error fetching filtered cocktails:", e);
		error.value =
			e.message ||
			"An unexpected error occurred while loading cocktails.";
	} finally {
		loading.value = false;
	}
};

const pageTitle = computed(() => {
	// Create a user-friendly title based on filter
	const valueDisplay = props.filterValue.replace(/_/g, " "); // Replace underscores for display
	switch (props.filterType) {
		case "a":
			return `${valueDisplay} Cocktails`;
		case "g":
			return `Cocktails served in a ${valueDisplay}`;
		case "c":
			return `${valueDisplay} Cocktails`;
		case "i":
			return `Cocktails with ${valueDisplay}`;
		default:
			return "Cocktails";
	}
});

// Fetch on initial mount
onMounted(() => {
	fetchCocktails(props.filterType, props.filterValue);
});

// Watch for route changes to refetch if navigating between filters
watch(
	() => [props.filterType, props.filterValue],
	(newValues, oldValues) => {
		if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
			fetchCocktails(newValues[0], newValues[1]);
		}
	}
);
</script>

<style scoped>
/* No component-specific styles needed, rely on global layout SCSS */
</style>
