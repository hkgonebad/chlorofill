<template>
	<section class="not-found-view block py-5 text-center">
		<div class="container">
			<h1 class="display-1 mb-3">404</h1>
			<h2>Oops! Page Not Found</h2>
			<p class="lead my-4">
				The page you are looking for might have been removed, had its
				name changed, or is temporarily unavailable.
			</p>
			<router-link to="/" class="btn btn-primary">
				Go to Homepage
			</router-link>
		</div>
	</section>
</template>

<script setup>
// No specific logic needed for the 404 page
</script>

<style scoped>
.not-found-view {
	min-height: 60vh; /* Ensure it takes up some vertical space */
	display: flex;
	align-items: center;
	justify-content: center;
}
.display-1 {
	font-size: 8rem;
	font-weight: bold;
	color: var(--bs-secondary-color);
}
</style>
