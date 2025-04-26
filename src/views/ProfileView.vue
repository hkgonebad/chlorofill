<template>
	<div class="profile-view container py-4">
		<h2 class="section-title mb-4">My Profile</h2>

		<div v-if="authLoading" class="text-center">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>

		<div v-else-if="user" class="card">
			<div class="card-body">
				<h5 class="card-title">User Information</h5>
				<p class="card-text">
					<strong>Email:</strong> {{ user.email }}
				</p>
				<p v-if="profile" class="card-text">
					<strong>Username:</strong>
					{{ profile.username || "Not set" }}
				</p>
				<!-- Add more profile fields here later (e.g., Full Name, Avatar update) -->
				<button
					@click="handleLogout"
					class="btn btn-danger"
					:disabled="logoutLoading"
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

		<div v-else class="alert alert-warning">
			You must be logged in to view your profile.
			<router-link :to="{ name: 'Login' }" class="alert-link"
				>Login here</router-link
			>.
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthUser } from "@/composables/useAuthUser";
import { supabase } from "@/supabaseClient";
import { useToast } from "vue-toastification";

const { user, profile, loading: authLoading } = useAuthUser();
const router = useRouter();
const toast = useToast();
const logoutLoading = ref(false);

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
</style>
