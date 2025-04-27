<template>
	<div class="profile-view container py-4">
		<h2 class="section-title mb-4">My Profile</h2>

		<div v-if="authLoading" class="text-center">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>

		<div v-else-if="user && profileData" class="card">
			<div class="card-body">
				<div class="row">
					<div class="col-md-4 text-center mb-3 mb-md-0">
						<img
							:src="
								profileData.avatar_url ||
								'/img/avatar-placeholder.png'
							"
							alt="User Avatar"
							class="img-thumbnail rounded-circle profile-avatar mb-2"
							width="150"
							height="150"
						/>
						<div class="mt-2">
							<label
								for="avatarUpload"
								class="btn btn-sm btn-outline-secondary"
							>
								{{
									avatarUploading
										? "Uploading..."
										: "Change Avatar"
								}}
							</label>
							<input
								type="file"
								id="avatarUpload"
								accept="image/png, image/jpeg, image/gif"
								@change="handleAvatarUpload"
								:disabled="avatarUploading"
								hidden
							/>
							<div class="form-text">Max 1MB (JPG, PNG, GIF)</div>
						</div>
						<div
							v-if="avatarUploading"
							class="progress mt-2"
							style="height: 5px"
						>
							<div
								class="progress-bar"
								role="progressbar"
								:style="{ width: uploadProgress + '%' }"
								:aria-valuenow="uploadProgress"
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div>
					</div>
					<div class="col-md-8">
						<h5 class="card-title">User Information</h5>
						<form @submit.prevent="handleUpdateProfile">
							<div class="mb-3">
								<label for="email" class="form-label"
									>Email</label
								>
								<input
									type="email"
									id="email"
									class="form-control"
									:value="user.email"
									disabled
									readonly
								/>
							</div>
							<div class="mb-3">
								<label for="username" class="form-label"
									>Username</label
								>
								<input
									type="text"
									id="username"
									class="form-control"
									v-model="profileData.username"
									required
									minlength="3"
									:disabled="updateLoading || avatarUploading"
								/>
							</div>
							<div class="mb-3">
								<label for="fullName" class="form-label"
									>Full Name</label
								>
								<input
									type="text"
									id="fullName"
									class="form-control"
									v-model="profileData.full_name"
									:disabled="updateLoading || avatarUploading"
								/>
								<div class="form-text">Optional</div>
							</div>

							<button
								type="submit"
								class="btn btn-primary me-2"
								:disabled="
									updateLoading ||
									avatarUploading ||
									!isProfileChanged
								"
							>
								<span
									v-if="updateLoading"
									class="spinner-border spinner-border-sm me-1"
									role="status"
									aria-hidden="true"
								></span>
								{{
									updateLoading ? "Saving..." : "Save Changes"
								}}
							</button>
							<button
								type="button"
								@click="resetForm"
								class="btn btn-secondary me-2"
								:disabled="
									updateLoading ||
									avatarUploading ||
									!isProfileChanged
								"
							>
								Cancel
							</button>
						</form>

						<hr class="my-4" />

						<button
							@click="handleLogout"
							class="btn btn-danger"
							:disabled="logoutLoading || avatarUploading"
						>
							<span
								v-if="logoutLoading"
								class="spinner-border spinner-border-sm me-1"
								role="status"
								aria-hidden="true"
							></span>
							Logout
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="alert alert-warning">
			You must be logged in to view your profile.
			<router-link :to="{ name: 'Login' }" class="alert-link"
				>Login here</router-link
			>.
		</div>
	</div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthUser } from "@/composables/useAuthUser";
import { supabase } from "@/supabaseClient";
import { useToast } from "vue-toastification";

const { user, profile, loading: authLoading, fetchSession } = useAuthUser();
const router = useRouter();
const toast = useToast();
const logoutLoading = ref(false);
const updateLoading = ref(false);
const avatarUploading = ref(false);
const uploadProgress = ref(0);

// Local reactive state for the form, initialized once profile loads
const profileData = ref({ username: "", full_name: "", avatar_url: "" });

// Watch for the profile data from the composable to initialize the form
onMounted(() => {
	watch(
		profile,
		(newProfile) => {
			if (newProfile) {
				// Initialize form only if profile exists
				profileData.value = {
					username: newProfile.username || "",
					full_name: newProfile.full_name || "",
					avatar_url: newProfile.avatar_url || "",
				};
			}
		},
		{ immediate: true }
	); // immediate: true to run on mount if profile is already loaded
});

// Computed property to check if form data differs from original profile
const isProfileChanged = computed(() => {
	if (!profile.value || !profileData.value) return false;
	return (
		profileData.value.username !== (profile.value.username || "") ||
		profileData.value.full_name !== (profile.value.full_name || "")
	);
});

// Reset form data to match the original profile from the composable
const resetForm = () => {
	if (profile.value) {
		profileData.value = {
			username: profile.value.username || "",
			full_name: profile.value.full_name || "",
			avatar_url: profile.value.avatar_url || "",
		};
	}
};

// Handle Avatar Upload
const handleAvatarUpload = async (event) => {
	const file = event.target.files?.[0];
	if (!file || !user.value) return;

	// Basic validation
	const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
	const maxSize = 1 * 1024 * 1024; // 1MB
	if (!allowedTypes.includes(file.type)) {
		toast.error("Invalid file type. Only JPG, PNG, GIF allowed.");
		return;
	}
	if (file.size > maxSize) {
		toast.error("File size exceeds 1MB limit.");
		return;
	}

	avatarUploading.value = true;
	uploadProgress.value = 0;
	const fileExt = file.name.split(".").pop();
	const filePath = `${user.value.id}/${Date.now()}.${fileExt}`; // Unique path per user

	try {
		// Upload file to Supabase Storage
		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: true, // Overwrite if file exists
				contentType: file.type,
			}); // Removed onProgress for simplicity, can be added back

		if (uploadError) throw uploadError;

		// Get public URL
		const { data: urlData } = supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

		const newAvatarUrl = urlData?.publicUrl;
		if (!newAvatarUrl) {
			throw new Error("Could not get public URL for avatar.");
		}

		// Update profiles table
		const updates = {
			id: user.value.id,
			avatar_url: newAvatarUrl,
			updated_at: new Date(),
		};
		const { error: profileUpdateError } = await supabase
			.from("profiles")
			.upsert(updates);
		if (profileUpdateError) throw profileUpdateError;

		// Update local state immediately
		profileData.value.avatar_url = newAvatarUrl;
		// Refresh profile in composable to ensure consistency (optional but good practice)
		await fetchSession();

		toast.success("Avatar updated successfully!");
	} catch (error) {
		console.error("Avatar upload error:", error.message);
		toast.error(error.message || "Failed to upload avatar");
	} finally {
		avatarUploading.value = false;
		uploadProgress.value = 0;
		// Reset the file input if needed (might require extra logic)
		const input = document.getElementById("avatarUpload");
		if (input) input.value = "";
	}
};

const handleUpdateProfile = async () => {
	if (!user.value || !isProfileChanged.value) return;
	updateLoading.value = true;
	try {
		const updates = {
			id: user.value.id,
			username: profileData.value.username.trim(),
			full_name: profileData.value.full_name.trim(),
			updated_at: new Date(),
		};

		const { error } = await supabase.from("profiles").upsert(updates);

		if (error) throw error;

		toast.success("Profile updated successfully!");
		// Refresh the profile data in the composable
		await fetchSession();
		// Note: Form fields will automatically update because they watch `profile`
	} catch (error) {
		console.error("Profile update error:", error.message);
		toast.error(error.message || "Failed to update profile");
	} finally {
		updateLoading.value = false;
	}
};

const handleLogout = async () => {
	logoutLoading.value = true;
	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		toast.info("You have been logged out.");
		router.push({ name: "Home" }); // Redirect to home after logout
	} catch (error) {
		console.error("Logout error:", error.message);
		toast.error(error.message || "Failed to log out.");
	} finally {
		logoutLoading.value = false;
	}
};

// Maybe add logic here later to update profile
</script>

<style scoped>
/* Add specific profile styles if needed */
.card {
	max-width: 600px;
	margin: auto;
}
.profile-avatar {
	object-fit: cover; /* Ensure avatar covers the area nicely */
	border: 3px solid var(--bs-border-color-translucent);
}
</style>
