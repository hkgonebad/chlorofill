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
import { RouterView } from "vue-router";
import { initializeTheme } from "@/composables/useTheme.js";
import FullScreenSearchModal from "@/components/FullScreenSearchModal.vue";
import { ref, provide } from "vue";

// Apply theme on initial load
initializeTheme();

// State for search modal visibility
const isSearchModalVisible = ref(false);

// Function to toggle the modal visibility
const toggleSearchModal = () => {
	isSearchModalVisible.value = !isSearchModalVisible.value;
	console.log("Search Modal Toggled:", isSearchModalVisible.value);
};

// Provide the state and the toggle function to descendants
provide("isSearchModalVisible", isSearchModalVisible);
provide("toggleSearchModal", toggleSearchModal);
</script>
