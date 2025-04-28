<template>
	<div class="col">
		<div
			class="card item-card h-100 text-start shadow-sm"
			@click="navigateToDetail"
			style="cursor: pointer"
		>
			<div class="card-image-wrapper position-relative">
				<img
					:src="imageUrl"
					class="card-img-top item-thumb"
					:alt="title"
				/>
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
			<div class="card-body d-flex flex-column">
				<h5 class="card-title mb-1">{{ title }}</h5>
				<p
					v-if="descriptionText"
					class="card-description small text-muted mb-0"
				>
					{{ descriptionText }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
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
	descriptionText: {
		type: String,
		default: "",
	},
	linkTo: {
		// Can be a string path or a route object
		type: [String, Object],
		required: true,
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
const router = useRouter();

// --- Event Handlers ---
const toggleFavorite = () => {
	if (!props.itemId || !props.itemType) {
		return;
	}
	emit("toggle-favorite", { id: props.itemId, type: props.itemType });
};

const shareItem = () => {
	if (!props.itemId || !props.itemType) {
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

// --- Navigation Handler ---
const navigateToDetail = () => {
	if (props.linkTo) {
		router.push(props.linkTo);
	}
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
	padding: 0.75rem; /* Adjust padding if needed */
	position: relative;
	z-index: 1;
}

.card-title {
	font-size: 0.9rem;
	font-weight: 600;
}

.card-description {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 0.8rem;
	line-height: 1.4;
	/* min-height needed to prevent layout shift if description is short/missing? */
	min-height: calc(2 * 0.8rem * 1.4); /* lines * font-size * line-height */
}
</style>
