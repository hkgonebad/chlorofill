<template>
	<div class="areas-view container py-4">
		<div class="view-header mb-4">
			<h2>Browse Recipes by Area (Cuisine)</h2>
		</div>

		<LoadingSpinner v-if="loading" />
		<ErrorMessage v-else-if="error" :message="error" />

		<!-- Area List -->
		<div v-else-if="areas.length > 0" class="list-group">
			<router-link
				v-for="area in areas"
				:key="area.strArea"
				:to="{
					name: 'AreaRecipes',
					params: { areaName: area.strArea },
				}"
				class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
			>
				{{ area.strArea }}
				<i class="pi pi-chevron-right"></i>
			</router-link>
		</div>
		<!-- No Areas Found State -->
		<div v-else>
			<p class="alert alert-info">Could not load area list.</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

const areas = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchAreas = async () => {
	loading.value = true;
	error.value = null;
	areas.value = [];
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/list.php?a=list`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		// The API returns { meals: [ {strArea: 'American'}, {strArea: 'British'} ] }
		if (data.meals) {
			areas.value = data.meals.sort((a, b) =>
				a.strArea.localeCompare(b.strArea)
			); // Sort alphabetically
		} else {
			areas.value = [];
			console.warn("No areas found in API response.");
			error.value = "Could not retrieve the list of areas.";
		}
	} catch (e) {
		console.error("Error fetching areas:", e);
		error.value = `Failed to load areas: ${e.message}`;
	} finally {
		loading.value = false;
	}
};

// Fetch areas when the component mounts
onMounted(() => {
	fetchAreas();
});
</script>

<style scoped>
/* Add minimal styling if needed, prefer global */
.view-header h2 {
	font-weight: 600;
}
.list-group-item i {
	font-size: 0.8rem;
	color: var(--bs-secondary-color);
}
</style>
