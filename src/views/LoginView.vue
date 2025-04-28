<template>
	<div class="authLayoutContent">
		<img
			src="/img/cf-logo-alt.png"
			alt="ChloroFill Logo"
			class="authLogo mb-4"
		/>
		<h1 class="h3 mb-3 fw-normal text-center">Please sign in</h1>

		<form @submit.prevent="handleLogin" class="authForm">
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
					placeholder="Password"
					v-model="password"
					required
					:disabled="loading"
				/>
				<label for="floatingPassword">Password</label>
			</div>

			<!-- Optional: Remember me checkbox -->
			<!-- <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> Remember me
        </label>
      </div> -->

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
				{{ loading ? "Signing in..." : "Sign in" }}
			</button>
		</form>

		<!-- Separator -->
		<div class="my-3 text-center text-muted">OR</div>

		<!-- Magic Link Form -->
		<form @submit.prevent="handleMagicLink" class="authForm">
			<div class="form-floating mb-3">
				<input
					type="email"
					class="form-control"
					id="magicLinkEmail"
					placeholder="name@example.com"
					v-model="magicLinkEmail"
					required
					:disabled="magicLoading"
				/>
				<label for="magicLinkEmail">Email for Magic Link</label>
			</div>
			<button
				class="w-100 btn btn-lg btn-secondary"
				type="submit"
				:disabled="magicLoading"
			>
				<span
					v-if="magicLoading"
					class="spinner-border spinner-border-sm"
					role="status"
					aria-hidden="true"
				></span>
				{{ magicLoading ? "Sending..." : "Send Magic Link" }}
			</button>
		</form>

		<p class="authLinks text-center">
			Don't have an account?
			<router-link :to="{ name: 'Signup' }">Sign up</router-link>
		</p>
		<!-- Optional: Forgot password link -->
		<!-- <p class="auth-links text-center">
            <a href="#">Forgot password?</a>
        </p> -->
		<p class="authLinks text-center mt-4">
			<router-link :to="{ name: 'Home' }"
				><i class="pi pi-arrow-left me-1"></i> Back to Home</router-link
			>
		</p>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { supabase } from "@/supabaseClient"; // Import your Supabase client
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const email = ref("");
const password = ref("");
const loading = ref(false);

// Refs for Magic Link
const magicLinkEmail = ref("");
const magicLoading = ref(false);

const handleLogin = async () => {
	loading.value = true;
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.value,
			password: password.value,
		});

		if (error) throw error;

		// On successful login
		// console.log("Logged in user:", data.user);
		toast.success("Successfully logged in!");
		router.push({ name: "Home" }); // Redirect to home or dashboard
	} catch (error) {
		console.error("Login error:", error.message);
		toast.error(error.message || "Failed to log in");
	} finally {
		loading.value = false;
	}
};

// Handler for Magic Link
const handleMagicLink = async () => {
	magicLoading.value = true;
	try {
		const { error } = await supabase.auth.signInWithOtp({
			email: magicLinkEmail.value,
			options: {
				// Optional: Redirect URL after clicking link
				// emailRedirectTo: window.location.origin,
			},
		});
		if (error) throw error;
		toast.info("Magic link sent! Check your email.");
		magicLinkEmail.value = ""; // Clear input on success
	} catch (error) {
		console.error("Magic link error:", error.message);
		toast.error(error.message || "Failed to send magic link");
	} finally {
		magicLoading.value = false;
	}
};
</script>
