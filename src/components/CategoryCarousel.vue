<template>
	<div class="category-carousel-wrapper">
		<LoadingSpinner v-if="loading" />
		<ErrorMessage v-else-if="error" :message="error" />
		<swiper
			v-else
			:slides-per-view="6"
			:space-between="15"
			:free-mode="true"
			:modules="modules"
			class="category-swiper"
			:breakpoints="{
				375: { slidesPerView: 3.5 },
				576: { slidesPerView: 4.5 },
				768: { slidesPerView: 5.5 },
				992: { slidesPerView: 7.5 },
			}"
		>
			<swiper-slide
				v-for="category in categories"
				:key="category.idCategory"
			>
				<router-link
					:to="{
						name: 'CategoryRecipes',
						params: { categoryName: category.strCategory },
					}"
					class="category-item text-center text-decoration-none"
				>
					<img
						:src="category.strCategoryThumb"
						:alt="category.strCategory"
						class="category-image img-fluid mb-2"
					/>
					<span class="category-name d-block small fw-medium">{{
						category.strCategory
					}}</span>
				</router-link>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
// import required modules
import { FreeMode } from "swiper/modules";

// Import reusable components
import LoadingSpinner from "./LoadingSpinner.vue";
import ErrorMessage from "./ErrorMessage.vue";

const modules = [FreeMode];

const categories = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchCategories = async () => {
	loading.value = true;
	error.value = null;
	try {
		const response = await fetch(
			"https://www.themealdb.com/api/json/v1/1/categories.php"
		);
		if (!response.ok)
			throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();
		categories.value = data.categories || [];
	} catch (e) {
		console.error("Error fetching categories for carousel:", e);
		error.value = `Failed to load categories: ${e.message}`;
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchCategories();
});
</script>
