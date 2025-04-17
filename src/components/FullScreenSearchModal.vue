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
				<div class="modal-body">
					<!-- Search Input -->
					<h5 class="modal-title mb-3" id="searchModalLabel">
						Search Recipes & Cocktails
					</h5>

					<div class="searchBody">
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
					</div>

					<!-- Results Area -->
					<div>
						<p v-if="!searchQuery">Enter a search term above.</p>
						<p v-else-if="isLoading">Loading results...</p>
						<p v-else-if="results.length === 0">
							No results found for "{{ searchQuery }}".
						</p>
						<div v-else>
							<!-- Result rendering will go here -->
							<p>Results for "{{ searchQuery }}":</p>
							<!-- Example: <pre>{{ results }}</pre> -->
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
// import { searchMealsByName } from '@/services/mealApi'; // Future
// import { searchCocktailsByName } from '@/services/cocktailApi'; // Future
// import { debounce } from 'lodash-es'; // Future

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
	}
);

const closeModal = () => {
	emit("update:visible", false); // Notify parent (App.vue)
	toggleSearchModal(); // Also call the injected toggle function
};

// Placeholder for search logic (to be implemented with debouncing and API calls)
const handleInput = () => {
	// Basic debounce idea
	// Needs proper implementation
	// search();
	console.log("Input:", searchQuery.value);
};

// Placeholder Search Function
// const search = debounce(async () => {
//   if (searchQuery.value.length < 3) {
//     results.value = [];
//     return;
//   }
//   isLoading.value = true;
//   results.value = [];
//   try {
//     // Fetch meals and cocktails
//     const [mealResults, cocktailResults] = await Promise.all([
//       searchMealsByName(searchQuery.value),
//       searchCocktailsByName(searchQuery.value)
//     ]);
//     // Combine/process results
//     results.value = [...(mealResults || []), ...(cocktailResults || [])];
//   } catch (error) {
//     console.error("Search error:", error);
//     // Handle error state
//   } finally {
//     isLoading.value = false;
//   }
// }, 400);
</script>

<style scoped>
/* All styles are in _header.scss and _recipe-search.scss */
</style>
