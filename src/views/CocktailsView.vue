<template>
	<section class="block cocktails-view">
		<div class="container py-4">
			<h1 class="section-title">Explore Cocktails</h1>

			<!-- Loading State -->
			<div v-if="loading" class="text-center my-5">
				<div class="spinner-border text-secondary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>

			<!-- Error State -->
			<ErrorMessage v-else-if="error" :message="error" />

			<!-- Filter Lists -->
			<div v-else>
				<!-- Alcoholic Filter -->
				<section class="mb-4 block">
					<h2 class="section-title">By Type</h2>
					<ul class="list-group list-group-flush">
						<li
							v-for="type in alcoholicTypes"
							:key="type.strAlcoholic"
							class="list-group-item list-group-item-action"
						>
							<!-- Link to filtered list view by Alcoholic Type -->
							<router-link
								:to="{
									name: 'CocktailList',
									params: {
										filterType: 'a',
										filterValue: type.strAlcoholic,
									},
								}"
								class="text-decoration-none"
							>
								{{ type.strAlcoholic }}
							</router-link>
						</li>
					</ul>
				</section>

				<!-- Glass Filter -->
				<section class="mb-4 block">
					<h2 class="section-title">By Glass</h2>
					<ul class="list-group list-group-flush">
						<li
							v-for="glass in glasses"
							:key="glass.strGlass"
							class="list-group-item list-group-item-action"
						>
							<!-- Link to filtered list view by Glass Type -->
							<router-link
								:to="{
									name: 'CocktailList',
									params: {
										filterType: 'g',
										filterValue: glass.strGlass,
									},
								}"
								class="text-decoration-none"
							>
								{{ glass.strGlass }}
							</router-link>
						</li>
					</ul>
				</section>

				<!-- Categories Filter (Optional - might be less common than alcoholic/glass) -->
				<!--
                <section class="mb-4 block">
                    <h2 class="section-title">By Category</h2>
                    <ul class="list-group list-group-flush">
                        <li v-for="cat in categories" :key="cat.strCategory" class="list-group-item list-group-item-action">
                            <router-link :to="{ name: 'Home' }" class="text-decoration-none">
								{{ cat.strCategory }}
							</router-link>
                        </li>
                    </ul>
                </section>
                -->
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getCocktailFilterLists } from "@/services/cocktailApi.js";
import ErrorMessage from "@/components/ErrorMessage.vue";

const loading = ref(false);
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
