<template>
	<div class="col">
		<div class="card h-100 border-0 item-card-skeleton">
			<!-- Image Placeholder -->
			<div class="placeholder-glow card-img-top-placeholder">
				<span class="placeholder w-100 h-100"></span>
			</div>
			<div class="card-body">
				<!-- Title Placeholder -->
				<h5 class="card-title placeholder-glow">
					<span class="placeholder col-8"></span>
				</h5>
				<!-- Optional Subtitle/Text Placeholder -->
				<p class="card-text placeholder-glow">
					<span class="placeholder col-6"></span>
					<span class="placeholder col-4"></span>
				</p>
				<!-- Button Placeholder -->
				<span class="btn btn-primary disabled placeholder col-4"></span>
			</div>
		</div>
	</div>
</template>

<script setup>
// No script needed for a purely visual skeleton
</script>

<style scoped>
/* Mimic aspect ratio or height of the real card image */
.card-img-top-placeholder {
	height: 150px; /* Adjust to match ItemCard image height approx */
	background-color: var(--bs-secondary-bg);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--bs-card-inner-border-radius)
		var(--bs-card-inner-border-radius) 0 0;
}

.card-img-top-placeholder .placeholder {
	border-radius: inherit; /* Match parent rounding */
}

.item-card-skeleton {
	background-color: var(--bs-card-bg);
}

/* Ensure consistent height with real cards if needed */
/* .card.item-card-skeleton { ... } */
</style>
