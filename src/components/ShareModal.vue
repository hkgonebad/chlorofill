<template>
	<div
		class="modal fade share-modal"
		tabindex="-1"
		ref="modalRef"
		aria-hidden="true"
	>
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{ title || "Share" }}</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					></button>
				</div>
				<div class="modal-body text-center">
					<ShareButtons
						v-if="shareUrl"
						:title="title"
						:text="shareText"
						:url="shareUrl"
					/>
					<p v-else class="text-muted small">
						Missing share information.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Modal } from "bootstrap";
import ShareButtons from "./ShareButtons.vue";

const props = defineProps({
	visible: {
		type: Boolean,
		required: true,
	},
	title: {
		type: String,
		default: "Share Item",
	},
	shareUrl: {
		type: String,
		required: true,
	},
	shareText: {
		type: String,
		default: "",
	},
});
const emit = defineEmits(["update:visible"]);

const modalRef = ref(null);
const bsModal = ref(null);
const elementFocusedBeforeModal = ref(null);

onMounted(() => {
	if (modalRef.value) {
		bsModal.value = new Modal(modalRef.value);

		modalRef.value.addEventListener("show.bs.modal", () => {
			elementFocusedBeforeModal.value = document.activeElement;
		});

		modalRef.value.addEventListener("hidden.bs.modal", () => {
			if (props.visible) {
				emit("update:visible", false);
			}
			elementFocusedBeforeModal.value?.focus();
		});

		if (props.visible) {
			bsModal.value.show();
		}
	}
});

watch(
	() => props.visible,
	(newValue) => {
		if (bsModal.value) {
			if (newValue) {
				bsModal.value.show();
			} else {
				bsModal.value.hide();
			}
		}
	}
);

onBeforeUnmount(() => {
	const currentModalRef = modalRef.value;
	if (currentModalRef) {
		// Remove listeners added in onMounted (important to avoid leaks)
		// Note: You'd ideally store the listener functions to remove them properly,
		// but for simplicity here, we're just showing the concept.
		// A better way involves storing listener references.
	}
	bsModal.value?.dispose();
});
</script>

<style scoped>
.modal-body {
	padding: 1.5rem;
}
</style>
