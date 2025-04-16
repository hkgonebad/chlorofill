<template>
	<div class="category-carousel-wrapper">
		<!-- Loading State with Placeholders -->
		<div v-if="loading" class="d-flex overflow-hidden placeholder-glow">
			<div
				v-for="n in 8"
				:key="'sk-cat-' + n"
				class="text-center me-3 category-item-placeholder"
			>
				<span class="placeholder category-image-placeholder"></span>
				<span class="placeholder category-name-placeholder"></span>
			</div>
		</div>
		<!-- Error State -->
		<ErrorMessage v-else-if="error" :message="error" />
		<!-- Swiper Content -->
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

<style scoped>
.category-item-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 70px;
}
.category-image-placeholder {
	display: inline-block;
	width: 60px;
	height: 60px;
	background-color: var(--bs-secondary-bg);
	border-radius: 50%;
	margin-bottom: 0.5rem;
}
.category-name-placeholder {
	display: inline-block;
	height: 0.75rem;
	width: 50px;
}

.category-item {
	display: block;
	color: var(--bs-body-color);
}
</style>
