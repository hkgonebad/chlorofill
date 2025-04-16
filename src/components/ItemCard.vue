<template>
	<div class="col">
		<div class="card item-card h-100 text-center shadow-sm">
			<router-link :to="linkTo" class="card-link-wrapper">
				<img
					:src="imageUrl"
					class="card-img-top item-thumb p-3"
					:alt="title"
				/>
			</router-link>
			<div class="card-body d-flex flex-column justify-content-between">
				<h5 class="card-title">{{ title }}</h5>
				<p
					v-if="subtitle"
					class="card-text small text-muted flex-grow-1"
				>
					{{ truncatedSubtitle }}
				</p>
				<!-- Optional slot for buttons or extra info -->
				<div class="mt-auto">
					<slot name="actions">
						<!-- Default action if slot not provided -->
						<router-link
							:to="linkTo"
							class="btn btn-sm btn-outline-primary"
							>View Details</router-link
						>
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
	imageUrl: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		default: "",
	},
	linkTo: {
		// Can be a string path or a route object
		type: [String, Object],
		required: true,
	},
	subtitleLength: {
		type: Number,
		default: 100, // Max length for subtitle before truncating
	},
});

// Truncate subtitle if it exceeds the specified length
const truncatedSubtitle = computed(() => {
	if (props.subtitle && props.subtitle.length > props.subtitleLength) {
		return props.subtitle.substring(0, props.subtitleLength) + "...";
	}
	return props.subtitle;
});
</script>

<style scoped>
.item-card {
	border: none; /* Remove default border */
	border-radius: 15px; /* More rounded corners like design */
	background-color: var(
		--bs-card-bg,
		var(--bs-body-bg)
	); /* Use CSS var for background */
	transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
	overflow: hidden; /* Ensure content respects border-radius */
}
.item-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important; /* Softer shadow */
}

.item-thumb {
	max-height: 160px; /* Adjust height */
	object-fit: cover; /* Cover the area, might crop */
	border-radius: 0; /* Remove radius if image goes edge-to-edge */
	padding: 0 !important; /* Remove padding if edge-to-edge */
}

.card-link-wrapper {
	display: block; /* Make the image link clickable */
	text-decoration: none;
	color: inherit;
}

.card-body {
	padding: 0.8rem 1rem; /* Adjust padding */
}

.card-title {
	font-weight: 600; /* Slightly bolder title */
	font-size: 1rem; /* Adjust font size */
	margin-bottom: 0.25rem;
}

.card-text.small {
	font-size: 0.8rem; /* Adjust subtitle size */
	line-height: 1.3;
}
</style>
