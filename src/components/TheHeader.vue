<template>
	<header class="sticky-top">
		<div class="topHeader">
			<div class="container">
				<nav class="navbar navbar-light">
					<button
						class="navbar-toggler btn-outline-secondary rounded-circle me-2"
						type="button"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasNavbar"
						aria-controls="offcanvasNavbar"
						aria-label="Toggle navigation menu"
					>
						<i class="pi pi-bars"></i>
					</button>
					<div
						class="offcanvas offcanvas-start"
						tabindex="-1"
						id="offcanvasNavbar"
						aria-labelledby="offcanvasNavbarLabel"
					>
						<div class="offcanvas-header">
							<h5
								class="offcanvas-title"
								id="offcanvasNavbarLabel"
							>
								ChloroFill Menu
							</h5>
							<button
								type="button"
								class="btn-close text-reset"
								data-bs-dismiss="offcanvas"
								aria-label="Close"
								ref="closeButtonRef"
							></button>
						</div>
						<div class="offcanvas-body">
							<ul class="navbar-nav flex-grow-1">
								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/"
										@click="closeOffcanvas"
									>
										<i class="pi pi-home"></i>
										Home</router-link
									>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/about"
										@click="closeOffcanvas"
									>
										<i class="pi pi-info-circle"></i>
										About Us</router-link
									>
								</li>

								<!-- Recipes Section (No longer Dropdown) -->
								<li class="nav-item">
									<span
										class="nav-link disabled text-uppercase fw-bold pe-none"
									>
										<i class="pi pi-list"></i>
										Recipes</span
									>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link ps-4"
										to="/categories"
										@click="closeOffcanvas"
									>
										<i class="pi pi-angle-right"></i>
										All Categories</router-link
									>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link ps-4"
										:to="{ name: 'Areas' }"
										@click="closeOffcanvas"
									>
										<i class="pi pi-angle-right"></i>
										Browse by Area</router-link
									>
								</li>
								<li class="nav-item">
									<a
										@click.prevent="goToRandomRecipe"
										class="nav-link ps-4"
										:disabled="loadingRandom"
										style="cursor: pointer"
										data-bs-dismiss="offcanvas"
									>
										<span
											v-if="loadingRandom"
											class="spinner-border spinner-border-sm me-1"
											role="status"
											aria-hidden="true"
										></span>
										<i class="pi pi-angle-right"></i>
										Random Recipe
									</a>
								</li>

								<!-- Cocktails Section (No longer Dropdown) -->
								<li class="nav-item">
									<span
										class="nav-link disabled text-uppercase fw-bold pe-none"
									>
										<i class="pi pi-filter"></i>
										Cocktails</span
									>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link ps-4"
										:to="{ name: 'Cocktails' }"
										@click="closeOffcanvas"
									>
										<i class="pi pi-angle-right"></i>
										Browse Filters</router-link
									>
								</li>
								<li class="nav-item">
									<a
										@click.prevent="goToRandomCocktail"
										class="nav-link ps-4"
										:disabled="loadingRandomCocktail"
										style="cursor: pointer"
										data-bs-dismiss="offcanvas"
									>
										<span
											v-if="loadingRandomCocktail"
											class="spinner-border spinner-border-sm me-1"
											role="status"
											aria-hidden="true"
										></span>
										<i class="pi pi-angle-right"></i>
										Random Cocktail
									</a>
								</li>

								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/offers"
										@click="closeOffcanvas"
									>
										<i class="pi pi-tag"></i>
										Offers</router-link
									>
								</li>

								<li class="nav-item mt-3 pt-3 border-top">
									<router-link
										class="nav-link"
										to="/favorites"
										@click="closeOffcanvas"
									>
										<i class="pi pi-heart"></i>
										My Favorites</router-link
									>
								</li>

								<!-- Auth Links (Conditional) -->
								<li
									v-if="!user && !authLoading"
									class="nav-item mt-3 pt-3 border-top"
								>
									<router-link
										class="nav-link"
										to="/login"
										@click="closeOffcanvas"
									>
										<i class="pi pi-sign-in"></i>
										Login</router-link
									>
								</li>
								<li
									v-if="!user && !authLoading"
									class="nav-item"
								>
									<router-link
										class="nav-link"
										to="/signup"
										@click="closeOffcanvas"
									>
										<i class="pi pi-user-plus"></i>
										Sign Up</router-link
									>
								</li>

								<!-- User Info & Logout (Conditional) -->
								<li
									v-if="user"
									class="nav-item mt-3 pt-3 border-top"
								>
									<span class="nav-link disabled pe-none">
										<i class="pi pi-user"></i>
										Signed in as:
										{{ profile?.username || user.email }}
									</span>
								</li>
								<li v-if="user" class="nav-item">
									<a
										href="#"
										@click.prevent="handleLogout"
										class="nav-link text-danger"
										:disabled="logoutLoading"
									>
										<span
											v-if="logoutLoading"
											class="spinner-border spinner-border-sm me-1"
											role="status"
											aria-hidden="true"
										></span>
										<i class="pi pi-sign-out"></i>
										Logout</a
									>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<!-- Update logo path and alt text later -->
				<router-link to="/" class="logo">
					<img
						:src="isDarkMode ? cfLogoDark : cfLogoAlt"
						alt="ChloroFill Logo"
						aria-label="Toggle theme"
					/>
				</router-link>
				<div class="extras d-flex align-items-center">
					<!-- Dark Mode Toggle Button -->
					<button
						@click="toggleTheme"
						class="btn btn-sm btn-outline-secondary me-2 theme-toggle-btn rounded-circle"
						:aria-label="
							isDarkMode
								? 'Activate light mode'
								: 'Activate dark mode'
						"
						title="Toggle light & dark theme"
					>
						<!-- Replace old icons with SVG -->
						<!-- <i class="pi pi-moon d-none d-theme-dark"></i> -->
						<!-- <i class="pi pi-sun d-theme-light"></i>   -->
						<svg
							class="sun-and-moon"
							aria-hidden="true"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<mask class="moon" id="moon-mask">
								<rect
									x="0"
									y="0"
									width="100%"
									height="100%"
									fill="white"
								/>
								<circle cx="24" cy="10" r="6" fill="black" />
							</mask>
							<circle
								class="sun"
								cx="12"
								cy="12"
								r="6"
								mask="url(#moon-mask)"
								fill="currentColor"
							/>
							<g class="sun-beams" stroke="currentColor">
								<line x1="12" y1="1" x2="12" y2="3" />
								<line x1="12" y1="21" x2="12" y2="23" />
								<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
								<line
									x1="18.36"
									y1="18.36"
									x2="19.78"
									y2="19.78"
								/>
								<line x1="1" y1="12" x2="3" y2="12" />
								<line x1="21" y1="12" x2="23" y2="12" />
								<line
									x1="4.22"
									y1="19.78"
									x2="5.64"
									y2="18.36"
								/>
								<line
									x1="18.36"
									y1="5.64"
									x2="19.78"
									y2="4.22"
								/>
							</g>
						</svg>
					</button>

					<!-- Search Icon Button (Not on Home) -->
					<button
						v-if="route.name !== 'Home'"
						@click="openSearchModal"
						class="btn btn-sm btn-outline-secondary me-2 rounded-circle"
						aria-label="Open search modal"
						title="Search Recipes & Cocktails"
					>
						<i class="pi pi-search"></i>
					</button>

					<!-- User/Auth Button (Conditional) -->
					<template v-if="authLoading">
						<button
							class="btn btn-sm btn-outline-secondary rounded-circle"
							disabled
						>
							<span
								class="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
							></span>
						</button>
					</template>
					<template v-else-if="user">
						<!-- Simple Logout for now, can be dropdown later -->
						<button
							@click="handleLogout"
							class="btn btn-sm btn-outline-danger rounded-circle"
							:disabled="logoutLoading"
							title="Logout"
							aria-label="Logout"
						>
							<i class="pi pi-sign-out"></i>
						</button>
					</template>
					<template v-else>
						<router-link
							:to="{ name: 'Login' }"
							class="btn btn-sm btn-outline-secondary rounded-circle"
							title="Login or Sign Up"
							aria-label="Login or Sign Up"
						>
							<i class="pi pi-user"></i>
						</router-link>
					</template>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { useRouter, RouterLink, useRoute } from "vue-router";
import { getRandomCocktail } from "@/services/cocktailApi.js";
import { getRandomMeal } from "@/services/mealApi.js";
import { useTheme } from "@/composables/useTheme.js";
import { Offcanvas } from "bootstrap";

import cfLogoLight from "/img/cf-logo-light.png";
import cfLogoDark from "/img/cf-logo-dark.png";
import cfLogoAlt from "/img/cf-logo-alt.png";

import { useAuthUser } from "@/composables/useAuthUser";
import { supabase } from "@/supabaseClient";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const loadingRandom = ref(false);
const loadingRandomCocktail = ref(false);
const toast = useToast();

// Auth state
const { user, profile, loading: authLoading } = useAuthUser();
const logoutLoading = ref(false);

// Inject the search modal toggle function
const toggleSearchModal = inject("toggleSearchModal", () => {
	console.warn("toggleSearchModal function not provided in Header");
});

// Use the theme composable
const { toggleTheme, isDarkMode } = useTheme();

// Function to programmatically click the close button (Reverted to this method)
const closeButtonRef = ref(null);
const closeOffcanvas = () => {
	if (closeButtonRef.value) {
		closeButtonRef.value.click();
	}
	// console.log("Attempting to close offcanvas via button click");
};

const goToRandomRecipe = async () => {
	loadingRandom.value = true;
	// console.log("goToRandomRecipe START");
	try {
		const meal = await getRandomMeal();

		if (meal && meal.idMeal) {
			// console.log(
			// 	`goToRandomRecipe: Navigating to recipe ${meal.idMeal}...`
			// );
			router.push({ name: "RecipeDetail", params: { id: meal.idMeal } });
		} else {
			throw new Error("No random meal found or meal has no ID.");
		}
	} catch (error) {
		console.error("Error fetching random recipe:", error);
		alert("Failed to load a random recipe. Please try again.");
	} finally {
		loadingRandom.value = false;
		// console.log("goToRandomRecipe END");
	}
};

const goToRandomCocktail = async () => {
	loadingRandomCocktail.value = true;
	// console.log("goToRandomCocktail START");
	try {
		const cocktail = await getRandomCocktail();
		if (cocktail && cocktail.idDrink) {
			// console.log(
			// 	`goToRandomCocktail: Navigating to cocktail ${cocktail.idDrink}...`
			// );
			router.push({
				name: "CocktailDetail",
				params: { id: cocktail.idDrink },
			});
		} else {
			throw new Error("No random cocktail found or cocktail has no ID.");
		}
	} catch (error) {
		console.error("Error fetching random cocktail:", error);
		alert("Failed to load a random cocktail. Please try again.");
	} finally {
		loadingRandomCocktail.value = false;
		// console.log("goToRandomCocktail END");
	}
};

// Function to call the injected toggle
const openSearchModal = () => {
	toggleSearchModal();
};

// Logout Handler
const handleLogout = async () => {
	logoutLoading.value = true;
	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		toast.info("You have been logged out.");
		closeOffcanvas(); // Close offcanvas if open
		router.push({ name: "Home" }); // Redirect to home after logout
	} catch (error) {
		console.error("Logout error:", error.message);
		toast.error(error.message || "Failed to log out.");
	} finally {
		logoutLoading.value = false;
	}
};
</script>
