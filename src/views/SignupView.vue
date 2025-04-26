<template>
	<div class="auth-layout-content">
		<img
			src="/img/cf-logo-alt.png"
			alt="ChloroFill Logo"
			width="72"
			class="auth-logo mb-4"
		/>
		<h1 class="h3 mb-3 fw-normal text-center">Create your account</h1>

		<form @submit.prevent="handleSignup" class="auth-form">
			<!-- Optional: Add username input if desired -->
			<div class="form-floating mb-3">
				<input
					type="text"
					class="form-control"
					id="floatingUsername"
					placeholder="Choose a username"
					v-model="username"
					required
					minlength="3"
					:disabled="loading"
				/>
				<label for="floatingUsername">Username</label>
			</div>

			<div class="form-floating mb-3">
				<input
					type="email"
					class="form-control"
					id="floatingInput"
					placeholder="name@example.com"
					v-model="email"
					required
					:disabled="loading"
				/>
				<label for="floatingInput">Email address</label>
			</div>
			<div class="form-floating mb-3">
				<input
					type="password"
					class="form-control"
					id="floatingPassword"
					placeholder="Password (6+ characters)"
					v-model="password"
					required
					minlength="6"
					:disabled="loading"
				/>
				<label for="floatingPassword">Password</label>
			</div>

			<button
				class="w-100 btn btn-lg btn-primary mt-4"
				type="submit"
				:disabled="loading"
			>
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm"
					role="status"
					aria-hidden="true"
				></span>
				{{ loading ? "Creating account..." : "Sign up" }}
			</button>
		</form>

		<p class="auth-links text-center">
			Already have an account?
			<router-link :to="{ name: 'Login' }">Sign in</router-link>
		</p>
		<p class="auth-links text-center mt-4">
			<router-link :to="{ name: 'Home' }"
				><i class="pi pi-arrow-left me-1"></i> Back to Home</router-link
			>
		</p>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { supabase } from "@/supabaseClient";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const email = ref("");
const password = ref("");
const username = ref(""); // Added username ref
const loading = ref(false);

const handleSignup = async () => {
	loading.value = true;
	try {
		const { data, error } = await supabase.auth.signUp({
			email: email.value,
			password: password.value,
			options: {
				// Include username in metadata for the trigger to pick up
				data: {
					username: username.value,
				},
			},
		});

		if (error) throw error;

		// Check if user object exists and email confirmation might be needed
		if (data.user) {
			// Our trigger handles profile creation
			toast.success(
				"Account created! Please check your email for verification if required."
			);
			// Redirect to login or home after signup
			router.push({ name: "Login" });
		} else {
			// Handle cases where signup might succeed but user is null (e.g., email confirmation required but not enabled?)
			toast.info("Signup request sent. Please check your email.");
			router.push({ name: "Login" }); // Go to login even if confirmation needed
		}
	} catch (error) {
		console.error("Signup error:", error.message);
		toast.error(error.message || "Failed to sign up");
	} finally {
		loading.value = false;
	}
};
</script>
