<template>
	<section class="block categories-view">
		<div class="container">
			<h1 class="section-title">ChloroFill Recipe Categories</h1>

			<h2>Recipe Categories</h2>

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

			<!-- Categories List -->
			<div
				v-else-if="categories.length > 0"
				class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
			>
				<ItemCard
					v-for="category in categories"
					:key="category.idCategory"
					:image-url="category.strCategoryThumb"
					:title="category.strCategory"
					:subtitle="category.strCategoryDescription"
					:link-to="{
						name: 'CategoryRecipes',
						params: { categoryName: category.strCategory },
					}"
				>
					<!-- Override default button text using the slot -->
					<template #actions>
						<router-link
							:to="{
								name: 'CategoryRecipes',
								params: { categoryName: category.strCategory },
							}"
							class="btn btn-sm btn-outline-primary"
							>View Recipes</router-link
						>
					</template>
				</ItemCard>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router"; // Import RouterLink if using it in the template
// Import API service
import { getCategories } from "@/services/mealApi.js"; // <-- Import from service
// Import reusable components
import ItemCard from "../components/ItemCard.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import SkeletonCard from "../components/SkeletonCard.vue"; // <-- Import SkeletonCard

const categories = ref([]); // Holds the array of category objects
const loading = ref(false);
const error = ref(null);

// No longer need the local fetchCategories function
// const fetchCategories = async () => { ... };

// Fetch categories when the component is mounted
onMounted(async () => {
	loading.value = true;
	error.value = null;
	try {
		categories.value = await getCategories(); // <-- Use the imported service function
	} catch (e) {
		console.error("Error in CategoriesView:", e); // Log the error caught from the service
		error.value = e.message || "An unexpected error occurred."; // Use the error message from the service
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
.category-thumb {
	max-height: 150px;
	object-fit: contain; /* Use contain to show the whole image */
}
.card {
	/* Add transition or other styling */
}
</style>
