<template>
	<div
		class="modal fade search-modal"
		id="searchModal"
		tabindex="-1"
		aria-labelledby="searchModalLabel"
		aria-hidden="true"
		ref="modalRef"
	>
		<div class="modal-dialog modal-fullscreen">
			<div class="modal-content">
				<div class="modal-header">
					<button
						type="button"
						class="btn-close"
						@click="closeModal"
						aria-label="Close"
					></button>
				</div>
				<div class="modal-body py-3">
					<!-- Search Input -->
					<h5 class="modal-title mb-3 pt-5" id="searchModalLabel">
						Search Recipes & Cocktails
					</h5>

					<div class="searchBody py-3">
						<div class="input-group mb-3">
							<input
								type="text"
								class="form-control form-control-lg"
								placeholder="Search by name (e.g., chicken, margarita)..."
								v-model="searchQuery"
								@input="handleInput"
							/>
							<span class="input-group-text" v-if="isLoading">
								<span
									class="spinner-border spinner-border-sm"
									role="status"
									aria-hidden="true"
								></span>
							</span>
						</div>

						<!-- Filters (Placeholder) -->
						<div class="mb-3">
							<p>
								Filters (coming soon): Type (Meal/Cocktail),
								Ingredients, etc.
							</p>
						</div>

						<!-- Results Area -->
						<div class="search-results-container mt-4 w-100">
							<!-- Skeleton Loader -->
							<div v-if="isLoading" class="placeholder-glow">
								<ul class="list-group list-group-flush">
									<li class="list-group-item">
										<span class="placeholder col-8"></span>
									</li>
									<li class="list-group-item">
										<span class="placeholder col-6"></span>
									</li>
									<li class="list-group-item">
										<span class="placeholder col-7"></span>
									</li>
									<li class="list-group-item">
										<span class="placeholder col-5"></span>
									</li>
								</ul>
							</div>

							<!-- No Results Found -->
							<div
								v-else-if="
									searchQuery.length > 0 &&
									results.length === 0 &&
									!isLoading
								"
								class="alert alert-warning"
							>
								No results found for "{{ searchQuery }}".
							</div>

							<!-- Display Results -->
							<div
								v-else-if="
									searchQuery.length > 0 && results.length > 0
								"
							>
								<h6 class="mb-3">
									Results for "{{ searchQuery }}":
								</h6>
								<ul class="list-group list-group-flush">
									<!-- Loop through combined results -->
									<router-link
										v-for="item in results"
										:key="item.idMeal || item.idDrink"
										:to="
											item.type === 'meal'
												? {
														name: 'RecipeDetail',
														params: {
															id: item.idMeal,
														},
												  }
												: {
														name: 'CocktailDetail',
														params: {
															id: item.idDrink,
														},
												  }
										"
										class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
										@click="closeModal"
									>
										<span>
											{{ item.strMeal || item.strDrink }}
										</span>
										<span
											:class="[
												'badge rounded-pill',
												item.type === 'meal'
													? 'text-bg-primary'
													: 'text-bg-secondary',
											]"
										>
											{{ item.type }}
										</span>
										<!-- Removed View button -->
									</router-link>
								</ul>
							</div>
							<!-- Minimum Characters Message -->
							<div
								v-else-if="
									searchQuery.length > 0 &&
									searchQuery.length < 3
								"
							>
								<p class="text-muted text-center">
									Please enter at least 3 characters.
								</p>
							</div>
							<!-- Initial Prompt -->
							<div v-else class="text-center text-muted">
								<p>
									Enter a search term above to find recipes
									and cocktails.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, inject } from "vue";
import { Modal } from "bootstrap";
import { searchMealsByName } from "@/services/mealApi";
import { searchCocktailsByName } from "@/services/cocktailApi";
import { debounce } from "lodash-es";

const props = defineProps({
	visible: Boolean,
});

const emit = defineEmits(["update:visible"]);

const modalRef = ref(null);
const bsModal = ref(null);
const searchQuery = ref("");
const isLoading = ref(false);
const results = ref([]);

// Inject the toggle function provided by App.vue
const toggleSearchModal = inject("toggleSearchModal", () => {
	console.warn("toggleSearchModal function not provided");
});

watch(
	() => props.visible,
	(newValue) => {
		if (!bsModal.value && modalRef.value) {
			bsModal.value = new Modal(modalRef.value);
		}
		if (newValue) {
			bsModal.value?.show();
		} else {
			bsModal.value?.hide();
		}
		if (!newValue) {
			// Reset state when modal hides
			searchQuery.value = "";
			results.value = [];
			isLoading.value = false;
		}
	}
);

const closeModal = () => {
	emit("update:visible", false); // Notify parent (App.vue) to update v-model
	// REMOVED: toggleSearchModal(); // Let v-model and watch handle the hiding
};

// --- Search Logic ---

const search = debounce(async () => {
	if (searchQuery.value.length < 3) {
		results.value = [];
		isLoading.value = false; // Ensure loading is false if query is too short
		return;
	}
	isLoading.value = true;
	results.value = [];
	console.log(`Searching for: "${searchQuery.value}"`);

	try {
		const [mealResults, cocktailResults] = await Promise.all([
			searchMealsByName(searchQuery.value).catch((err) => {
				console.error("Meal search failed:", err);
				return [];
			}), // Add basic error catching per promise
			searchCocktailsByName(searchQuery.value).catch((err) => {
				console.error("Cocktail search failed:", err);
				return [];
			}),
		]);

		// Add a type identifier to each result and combine
		const combinedResults = [
			...(mealResults || []).map((item) => ({ ...item, type: "meal" })),
			...(cocktailResults || []).map((item) => ({
				...item,
				type: "cocktail",
			})),
		];

		results.value = combinedResults;
		console.log("Search results:", results.value);
	} catch (error) {
		console.error("Overall search error:", error);
		results.value = []; // Clear results on error
		// Optional: Add a user-facing error message state
	} finally {
		isLoading.value = false;
	}
}, 400); // 400ms debounce

const handleInput = () => {
	// Trigger the debounced search function on input
	search();
};
</script>

<style scoped>
/* All styles are in _header.scss and _recipe-search.scss */
</style>
