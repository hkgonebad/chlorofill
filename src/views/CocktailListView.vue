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
			class="row row-cols-2 row-cols-sm-2 row-cols-md-4 g-4 placeholder-glow"
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
		<div v-else class="row row-cols-2 row-cols-sm-2 row-cols-md-4 g-4">
			<ItemCard
				v-for="cocktail in cocktails"
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
	</div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { getCocktailsByFilter } from "@/services/cocktailApi.js";
import ItemCard from "@/components/ItemCard.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";
import BackButton from "@/components/BackButton.vue";
import { useCocktailFavorites } from "@/composables/useCocktailFavorites.js";

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

// Inject the global openShareModal function
const openShareModal = inject("openShareModal");

// Use cocktail favorites composable
const {
	addFavorite,
	removeFavorite,
	isFavorite: isFavoriteCocktail,
} = useCocktailFavorites();

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

// --- Event Handlers (Added) ---
const handleToggleFavorite = ({ id, type }) => {
	if (type === "cocktail") {
		if (isFavoriteCocktail(id)) {
			removeFavorite(id);
		} else {
			addFavorite(id);
		}
	}
};

const handleShareItem = ({ title, url }) => {
	if (openShareModal) {
		openShareModal({
			title,
			url,
			text: `Check out this cocktail: ${title}`,
		});
	} else {
		console.error(
			"openShareModal function not injected in CocktailListView"
		);
	}
};
</script>

<style scoped>
/* No component-specific styles needed, rely on global layout SCSS */
</style>
