<template>
	<div class="col">
		<div class="card item-card h-100 text-center shadow-sm">
			<div class="card-image-wrapper position-relative">
				<router-link :to="linkTo" class="card-link-wrapper">
					<img
						:src="imageUrl"
						class="card-img-top item-thumb"
						:alt="title"
					/>
				</router-link>
				<div
					v-if="showActions"
					class="card-actions-overlay position-absolute top-0 end-0 p-2"
				>
					<button
						v-if="itemId"
						@click.stop.prevent="toggleFavorite"
						class="btn btn-sm btn-light rounded-circle me-1 action-icon favorite-icon"
						:class="{ active: isFavorite }"
						:title="
							isFavorite
								? 'Remove from Favorites'
								: 'Add to Favorites'
						"
						:aria-label="
							isFavorite
								? 'Remove from Favorites'
								: 'Add to Favorites'
						"
					>
						<i
							:class="
								isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'
							"
						></i>
					</button>
					<button
						v-if="itemId"
						@click.stop.prevent="shareItem"
						class="btn btn-sm btn-light rounded-circle action-icon share-icon"
						title="Share"
						aria-label="Share"
					>
						<i class="pi pi-share-alt"></i>
					</button>
				</div>
			</div>
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
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import ShareButtons from "./ShareButtons.vue";

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
	// New props for actions
	itemId: {
		type: String,
		default: null,
	},
	itemType: {
		type: String,
		validator: (value) => ["meal", "cocktail", null, ""].includes(value),
		default: null,
	},
	isFavorite: {
		type: Boolean,
		default: false,
	},
	showActions: {
		type: Boolean,
		default: true, // Show actions by default
	},
});

const emit = defineEmits(["toggle-favorite", "share-item"]);

// Truncate subtitle if it exceeds the specified length
const truncatedSubtitle = computed(() => {
	if (props.subtitle && props.subtitle.length > props.subtitleLength) {
		return props.subtitle.substring(0, props.subtitleLength) + "...";
	}
	return props.subtitle;
});

// --- Event Handlers ---
const toggleFavorite = () => {
	if (!props.itemId || !props.itemType) {
		console.warn("ItemCard: itemId or itemType missing for toggleFavorite");
		return;
	}
	emit("toggle-favorite", { id: props.itemId, type: props.itemType });
};

const shareItem = () => {
	if (!props.itemId || !props.itemType) {
		console.warn("ItemCard: itemId or itemType missing for shareItem");
		return;
	}
	// Construct the canonical URL for sharing
	const baseUrl = window.location.origin;
	const path =
		typeof props.linkTo === "string" ? props.linkTo : props.linkTo.path;
	const fullUrl = path
		? `${baseUrl}${path}`
		: `${baseUrl}/${props.itemType}/${props.itemId}`; // Fallback if linkTo isn't helpful

	emit("share-item", {
		title: props.title,
		// text: props.subtitle, // Optional: Add subtitle or other text if needed
		url: fullUrl,
	});
};
</script>

<style scoped>
/* Add styling for the overlay and icons */
.card-image-wrapper {
	/* Ensure image fills this container if needed, or set aspect ratio */
	overflow: hidden; /* Prevents icons spilling out if image isn't loaded? */
}

.card-actions-overlay {
	z-index: 10;
	/* Background for better visibility, adjust as needed */
	/* background-color: rgba(255, 255, 255, 0.7); */
	/* border-bottom-left-radius: 0.25rem; */
}

.action-icon {
	/* Style the buttons */
	background-color: rgba(255, 255, 255, 0.8);
	border: none;
	transition: background-color 0.2s ease;
}

.action-icon:hover {
	background-color: rgba(255, 255, 255, 1);
}

.action-icon.favorite-icon.active i {
	color: var(--bs-danger);
}

/* Dark mode adjustments for card overlay icons */
[data-bs-theme="dark"] .action-icon {
	background-color: rgba(var(--bs-tertiary-bg-rgb), 0.8);
	/* Use a tertiary background or similar variable */
	color: var(--bs-light);
}

[data-bs-theme="dark"] .action-icon:hover {
	background-color: rgba(var(--bs-tertiary-bg-rgb), 1);
}

[data-bs-theme="dark"] .action-icon.favorite-icon.active i {
	color: var(--bs-danger); /* Keep danger color for active favorite */
}

/* Ensure card body content doesn't overlap if actions are complex */
.card-body {
	position: relative;
	z-index: 1; /* Ensure body content is below overlay */
}
</style>
