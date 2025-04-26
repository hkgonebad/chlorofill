<template>
	<div class="share-buttons d-flex flex-wrap justify-content-center gap-2">
		<!-- Native Share Button (if available) -->
		<button
			@click="shareNative"
			class="btn btn-primary share-btn native-share"
			title="Share via device options"
			v-if="canShareNative"
		>
			<i class="pi pi-share-alt me-1"></i>
			<span>Share</span>
		</button>

		<!-- Fallback Links/Buttons (Always present for consistency, hidden if native used potentially?) -->
		<!-- Consider only showing fallbacks if !canShareNative or making native the first button -->
		<a
			:href="twitterShareUrl"
			target="_blank"
			rel="noopener noreferrer"
			class="btn btn-light share-btn fallback-share"
			title="Share on Twitter"
		>
			<i class="pi pi-twitter"></i>
			<span class="visually-hidden">Share on Twitter</span>
		</a>
		<a
			:href="facebookShareUrl"
			target="_blank"
			rel="noopener noreferrer"
			class="btn btn-light share-btn fallback-share"
			title="Share on Facebook"
		>
			<i class="pi pi-facebook"></i>
			<span class="visually-hidden">Share on Facebook</span>
		</a>
		<a
			:href="whatsappShareUrl"
			data-action="share/whatsapp/share"
			target="_blank"
			rel="noopener noreferrer"
			class="btn btn-light share-btn fallback-share"
			title="Share via WhatsApp"
		>
			<i class="pi pi-whatsapp"></i>
			<span class="visually-hidden">Share via WhatsApp</span>
		</a>
		<button
			@click="copyLink"
			class="btn btn-light share-btn fallback-share"
			:title="copyTitle"
			:class="{ copied: copied }"
		>
			<i :class="copyIcon"></i>
			<span class="visually-hidden">{{ copyTitle }}</span>
		</button>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		default: "",
	},
	url: {
		type: String,
		required: true,
	},
});

const canShareNative = ref(false);
const copied = ref(false);
const copyTimeout = ref(null);

onMounted(() => {
	// Check for Web Share API support *after* component mounts (window context)
	if (navigator.share) {
		canShareNative.value = true;
	}
});

const shareNative = async () => {
	if (!navigator.share) return; // Guard clause

	try {
		await navigator.share({
			title: props.title,
			text: props.text,
			url: props.url,
		});
		console.log("Content shared successfully");
	} catch (error) {
		console.error("Error sharing:", error);
		// Optionally, you could force fallbacks to show if native fails
		// canShareNative.value = false; // Example: Force fallbacks
	}
};

const twitterShareUrl = computed(() => {
	const intentUrl = new URL("https://twitter.com/intent/tweet");
	intentUrl.searchParams.set("url", props.url);
	if (props.text) {
		// Construct text - Twitter counts URLs differently, often good to have text first
		const tweetText = `${props.text.substring(0, 100)}...`; // Keep it concise
		intentUrl.searchParams.set("text", tweetText);
	}
	// Add via handle if desired
	// intentUrl.searchParams.set('via', 'YourTwitterHandle');
	return intentUrl.toString();
});

const facebookShareUrl = computed(() => {
	const fbUrl = new URL("https://www.facebook.com/sharer/sharer.php");
	fbUrl.searchParams.set("u", props.url);
	// Facebook uses the OG tags from the URL, so title/text here aren't usually needed
	return fbUrl.toString();
});

const whatsappShareUrl = computed(() => {
	const waUrl = new URL("https://api.whatsapp.com/send");
	// Include title and URL in the text body
	const shareText = `${props.title}\n${
		props.text ? props.text.substring(0, 100) + "..." : ""
	}\n${props.url}`;
	waUrl.searchParams.set("text", shareText);
	return waUrl.toString();
});

const copyLink = async () => {
	if (copied.value) return; // Prevent rapid clicks

	try {
		await navigator.clipboard.writeText(props.url);
		copied.value = true;
		clearTimeout(copyTimeout.value); // Clear previous timeout if any
		copyTimeout.value = setTimeout(() => {
			copied.value = false;
		}, 2000); // Reset icon after 2 seconds
	} catch (err) {
		console.error("Failed to copy: ", err);
		alert("Failed to copy link."); // Basic fallback alert
	}
};

const copyIcon = computed(() => (copied.value ? "pi pi-check" : "pi pi-copy"));
const copyTitle = computed(() => (copied.value ? "Link Copied!" : "Copy Link"));
</script>

<style scoped>
.share-buttons {
	/* Container styling if needed */
}
.share-btn {
	/* Consistent styling for all buttons */
	padding: 0.5rem 0.75rem;
	font-size: 1rem;
	line-height: 1;
	border-radius: 50px; /* Rounded pills */
	flex: 0 1 auto; /* Allow shrinking but not growing */
}

.share-btn.native-share {
	/* Specific style for native button */
	padding: 0.5rem 1rem;
}

.share-btn i {
	font-size: 1.1em;
}

.share-btn.copied {
	/* Style feedback for copied button */
	border-color: var(--bs-success);
}

/* Dark mode adjustments for btn-light inside modal */
[data-bs-theme="dark"] .share-btn.btn-light {
	background-color: var(--bs-gray-600);
	border-color: var(--bs-gray-700);
	color: var(--bs-light);
}

[data-bs-theme="dark"] .share-btn.btn-light:hover {
	background-color: var(--bs-gray-500);
	border-color: var(--bs-gray-600);
}

[data-bs-theme="dark"] .share-btn.btn-light.copied {
	border-color: var(--bs-success);
}
</style>
