<template>
	<section class="block cocktails-view">
		<div class="container py-4">
			<h1 class="section-title">Explore Cocktails</h1>

			<!-- Skeleton Loading State -->
			<div v-if="loading" class="placeholder-glow">
				<!-- Skeleton for Alcoholic Types -->
				<section class="mb-4 block">
					<h2 class="section-title section-title-sm">
						<span class="placeholder col-3"></span>
					</h2>
					<ul class="list-group">
						<li class="list-group-item">
							<span class="placeholder col-5"></span>
						</li>
						<li class="list-group-item">
							<span class="placeholder col-4"></span>
						</li>
					</ul>
				</section>

				<!-- Skeleton for Glasses -->
				<section class="mb-4 block">
					<h2 class="section-title">
						<span class="placeholder col-4"></span>
					</h2>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">
							<span class="placeholder col-6"></span>
						</li>
						<li class="list-group-item">
							<span class="placeholder col-5"></span>
						</li>
						<li class="list-group-item">
							<span class="placeholder col-7"></span>
						</li>
					</ul>
				</section>
			</div>

			<!-- Error State -->
			<ErrorMessage v-else-if="error" :message="error" />

			<!-- Filter Lists -->
			<div v-else>
				<!-- Alcoholic Filter -->
				<section class="mb-2 block">
					<h2 class="section-title section-title-sm">By Type</h2>
					<div class="list-group">
						<router-link
							v-for="type in alcoholicTypes"
							:key="type.strAlcoholic"
							:to="{
								name: 'CocktailList',
								params: {
									filterType: 'a',
									filterValue: type.strAlcoholic,
								},
							}"
							class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
						>
							{{ type.strAlcoholic }}
							<i class="pi pi-chevron-right"></i>
						</router-link>
					</div>
				</section>

				<!-- Glass Filter -->
				<section class="mb-2 block">
					<h2 class="section-title section-title-sm">By Glass</h2>
					<div class="list-group">
						<router-link
							v-for="glass in glasses"
							:key="glass.strGlass"
							:to="{
								name: 'CocktailList',
								params: {
									filterType: 'g',
									filterValue: glass.strGlass,
								},
							}"
							class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
						>
							{{ glass.strGlass }}
							<i class="pi pi-chevron-right"></i>
						</router-link>
					</div>
				</section>

				<!-- Categories Filter (Optional - might be less common than alcoholic/glass) -->

				<section class="mb-4 block">
					<h2 class="section-title section-title-sm">By Category</h2>
					<div class="list-group">
						<router-link
							v-for="cat in categories"
							:key="cat.strCategory"
							:to="{
								name: 'CocktailList',
								params: {
									filterType: 'c',
									filterValue: cat.strCategory,
								},
							}"
							class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
						>
							{{ cat.strCategory }}
							<i class="pi pi-chevron-right"></i>
						</router-link>
					</div>
				</section>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getCocktailFilterLists } from "@/services/cocktailApi.js";
import ErrorMessage from "@/components/ErrorMessage.vue";

const loading = ref(true);
const error = ref(null);

const categories = ref([]);
const glasses = ref([]);
const alcoholicTypes = ref([]);
const ingredients = ref([]); // We fetch ingredients but might not display the full list here

onMounted(async () => {
	loading.value = true;
	error.value = null;
	try {
		const lists = await getCocktailFilterLists();
		categories.value = lists.categories || [];
		glasses.value = lists.glasses || [];
		alcoholicTypes.value = lists.alcoholicTypes || [];
		ingredients.value = lists.ingredients || []; // Store it even if not displayed
	} catch (e) {
		console.error("Error fetching cocktail filter lists:", e);
		error.value = e.message || "Failed to load cocktail filters.";
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
/* Styles moved to global SCSS if needed */
</style>
