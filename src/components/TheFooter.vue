<template>
	<nav class="bottom-nav fixed-bottom border-top">
		<div
			class="container-fluid d-flex justify-content-around align-items-center h-100"
		>
			<router-link to="/" class="nav-item" active-class="active">
				<!-- <i class="fas fa-home fa-fw"></i> -->
				<i class="pi pi-home" style="font-size: 1.3rem"></i>
				<span class="nav-text d-none d-sm-block">Home</span>
			</router-link>

			<router-link
				:to="{ name: 'Browse' }"
				class="nav-item"
				active-class="active"
			>
				<!-- <i class="fas fa-th-large fa-fw"></i> -->
				<i class="pi pi-th-large" style="font-size: 1.3rem"></i>
				<span class="nav-text d-none d-sm-block">Browse All</span>
			</router-link>

			<!-- Add Favorites Link -->
			<router-link
				:to="{ name: 'Favorites' }"
				class="nav-item"
				active-class="active"
			>
				<i class="pi pi-heart" style="font-size: 1.3rem"></i>
				<span class="nav-text d-none d-sm-block">Favorites</span>
			</router-link>

			<router-link
				:to="{ name: 'Offers' }"
				class="nav-item"
				active-class="active"
			>
				<!-- <i class="fas fa-tags fa-fw"></i> -->
				<i class="pi pi-tags" style="font-size: 1.3rem"></i>
				<span class="nav-text d-none d-sm-block">Offers</span>
			</router-link>

			<!-- Move dark mode toggle elsewhere (e.g., header or settings page) -->
			<!-- <button @click="toggleDarkMode" class="btn btn-sm btn-secondary">Toggle Dark Mode</button> -->
		</div>
	</nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
// REMOVE: import { useAuthUser } from "@/composables/useAuthUser";

// REMOVE: // Get auth state
// REMOVE: const { user, loading: authLoading } = useAuthUser();
</script>

<style scoped>
/* Styles are in _footer.scss */
</style>
