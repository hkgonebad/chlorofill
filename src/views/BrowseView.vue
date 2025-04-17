<template>
	<div class="browse-view container py-4">
		<div class="view-header mb-4 d-flex align-items-center">
			<BackButton class="me-3" />
			<h2 class="section-title mb-0">Browse Recipes & Cocktails</h2>
		</div>

		<div class="row g-4">
			<!-- Link to Meal Categories -->
			<div class="col-md-6">
				<div class="card h-100 text-center shadow-sm">
					<div
						class="card-body d-flex flex-column justify-content-center"
					>
						<i
							class="pi pi-book mb-3"
							style="font-size: 2.5rem; color: var(--bs-primary)"
						></i>
						<h5 class="card-title">Recipe Categories</h5>
						<p class="card-text text-muted small">
							Explore recipes by category (e.g., Dessert,
							Seafood).
						</p>
						<router-link
							:to="{ name: 'Categories' }"
							class="btn btn-primary mt-3 stretched-link"
							>View Recipe Categories</router-link
						>
					</div>
				</div>
			</div>

			<!-- Link to Cocktail Filters -->
			<div class="col-md-6">
				<div class="card h-100 text-center shadow-sm">
					<div
						class="card-body d-flex flex-column justify-content-center"
					>
						<i
							class="pi pi-filter mb-3"
							style="
								font-size: 2.5rem;
								color: var(--bs-secondary);
							"
						></i>
						<h5 class="card-title">Cocktail Filters</h5>
						<p class="card-text text-muted small">
							Explore cocktails by type or glass.
						</p>
						<router-link
							:to="{ name: 'Cocktails' }"
							class="btn btn-secondary mt-3 stretched-link"
							>View Cocktail Filters</router-link
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import BackButton from "../components/BackButton.vue";
</script>

<style scoped>
/* Add styling if needed, but Bootstrap cards should provide a decent base */
.card i {
	display: block;
}
</style>
