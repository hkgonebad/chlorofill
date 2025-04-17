<template>
	<div id="app-wrapper">
		<TheHeader />
		<main>
			<!-- Router view will render the current page component -->
			<router-view />
		</main>
		<TheFooter />
		<!-- Render the search modal, binding its visibility -->
		<FullScreenSearchModal v-model:visible="isSearchModalVisible" />
	</div>
</template>

<script setup>
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";
import { RouterView, useRoute } from "vue-router";
import { initializeTheme } from "@/composables/useTheme.js";
import FullScreenSearchModal from "@/components/FullScreenSearchModal.vue";
import { ref, provide, computed } from "vue";
import { useHead } from "@vueuse/head";

// Apply theme on initial load
initializeTheme();

// State for search modal visibility
const isSearchModalVisible = ref(false);

// Function to toggle the modal visibility
const toggleSearchModal = () => {
	isSearchModalVisible.value = !isSearchModalVisible.value;
	// console.log("Search Modal Toggled:", isSearchModalVisible.value);
};

// Provide the state and the toggle function to descendants
provide("isSearchModalVisible", isSearchModalVisible);
provide("toggleSearchModal", toggleSearchModal);

// --- Meta tags integration ---
const route = useRoute();

// Use @vueuse/head for meta management
useHead(
	computed(() => {
		const baseMeta = [
			{
				name: "description",
				content:
					"Discover delicious meal and cocktail recipes on ChloroFill. Browse by category, area, type, or search for your favorites.",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0",
			},
		];

		// Safely access route meta with optional chaining and fallback
		const routeTitle = route?.meta?.title || "ChloroFill";

		return {
			title: routeTitle,
			titleTemplate: "%s | ChloroFill 🍴🍹 - A Vue Recipe",
			htmlAttrs: {
				lang: "en",
				amp: false,
			},
			meta: baseMeta,
		};
	})
);
</script>
