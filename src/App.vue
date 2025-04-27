<template>
	<div id="app-wrapper">
		<!-- Conditionally render header and footer -->
		<TheHeader v-if="!isAuthRoute" />
		<main :class="{ 'auth-content': isAuthRoute }">
			<!-- Router view will render the current page component -->
			<router-view />
		</main>
		<TheFooter v-if="!isAuthRoute" />
		<!-- Render the search modal, binding its visibility -->
		<FullScreenSearchModal v-model:visible="isSearchModalVisible" />
		<!-- Render the global Share Modal -->
		<ShareModal
			v-model:visible="isShareModalVisible"
			:title="shareModalTitle"
			:share-url="shareModalUrl"
			:share-text="shareModalText"
		/>
	</div>
</template>

<script setup>
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";
import { RouterView, useRoute } from "vue-router";
import { initializeTheme } from "@/composables/useTheme.js";
import FullScreenSearchModal from "@/components/FullScreenSearchModal.vue";
import { ref, provide, computed, readonly } from "vue";
import { useHead } from "@vueuse/head";
import ShareModal from "@/components/ShareModal.vue";

// Apply theme on initial load
initializeTheme();

const route = useRoute();

// Computed property to check if the current route is an auth route
const isAuthRoute = computed(() => {
	// Check if the route's meta field indicates it's an auth layout
	return route.meta?.layout === "AuthLayout";
});

// State for search modal visibility
const isSearchModalVisible = ref(false);

// Function to toggle the modal visibility
const toggleSearchModal = () => {
	isSearchModalVisible.value = !isSearchModalVisible.value;
	// console.log("Search Modal Toggled:", isSearchModalVisible.value);
};

// Provide the state and the toggle function to descendants
provide("isSearchModalVisible", readonly(isSearchModalVisible));
provide("toggleSearchModal", toggleSearchModal);

// === Global Share Modal State ===
const isShareModalVisible = ref(false);
const shareModalTitle = ref("");
const shareModalUrl = ref("");
const shareModalText = ref("");

// Function to open the share modal
const openShareModal = (payload) => {
	// console.log("Opening share modal with payload:", payload);
	shareModalTitle.value = payload.title ? `Share: ${payload.title}` : "Share";
	shareModalUrl.value = payload.url || "";
	shareModalText.value =
		payload.text || `Check out this link: ${payload.url}`;
	isShareModalVisible.value = true;
};

// Provide share modal state (readonly) and open function
provide("isShareModalVisible", readonly(isShareModalVisible));
provide("openShareModal", openShareModal);
// === End Global Share Modal State ===

// --- Meta tags integration ---
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
		const routeTitle =
			route?.meta?.title || "ChloroFill 🍴🍹 - A Vue Recipe";
		const isHome = route?.name === "Home";

		return {
			title: isHome ? routeTitle : routeTitle,
			titleTemplate: isHome
				? "%s"
				: "%s | ChloroFill 🍴🍹 - A Vue Recipe",
			htmlAttrs: {
				lang: "en",
				amp: false,
			},
			meta: baseMeta,
		};
	})
);
</script>

<style lang="scss">
/* Global styles can be imported here or managed via main.scss */

/* Example: Ensure main content area pushes footer down */
main:not(.auth-content) {
	/* Apply min-height only when header/footer are present */
	min-height: calc(
		100vh - var(--header-height, 60px) - var(--footer-height, 50px)
	);
	/* Define --header-height and --footer-height in your variables or here */
}

/* Styles specific to the auth layout can go here or in a dedicated file */
main.auth-content {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	/* The styling from AuthLayout.vue will handle the form container */
}

/* Ensure router-view takes available space if needed */
/* .router-view-wrapper { flex-grow: 1; } */
</style>
