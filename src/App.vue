<template>
	<div id="app-wrapper">
		<TheHeader />
		<main>
			<!-- Router view will render the current page component -->
			<router-view />
		</main>
		<TheFooter />
	</div>
</template>

<script setup>
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";
import { RouterView } from "vue-router";
import { initializeTheme } from "@/composables/useTheme.js";

// Apply theme on initial load
initializeTheme();
</script>
