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
</script>

<style>
/* Global styles can remain in main.css or be added here if needed */
/* Ensure main content area has some basic structure */
main {
	/* Add padding or other styles as needed to prevent overlap with sticky footer */
	padding-bottom: 60px; /* Adjust based on footer height */
	min-height: calc(
		100vh - 120px
	); /* Example: Adjust based on header/footer height */
}
</style>
