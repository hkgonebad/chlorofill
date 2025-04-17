<template>
	<header>
		<div class="topHeader fixed-top">
			<div class="container">
				<nav class="navbar navbar-light">
					<button
						class="navbar-toggler"
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
										>Home</router-link
									>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/about"
										@click="closeOffcanvas"
										>About Us</router-link
									>
								</li>

								<!-- Recipes Dropdown -->
								<li class="nav-item dropdown">
									<a
										class="nav-link dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
										>Recipes</a
									>
									<ul
										class="dropdown-menu"
										aria-labelledby="offcanvasNavbarDropdown"
									>
										<li>
											<router-link
												class="dropdown-item"
												to="/categories"
												@click="closeOffcanvas"
												>All Categories</router-link
											>
										</li>
										<li>
											<router-link
												class="dropdown-item"
												:to="{ name: 'Areas' }"
												@click="closeOffcanvas"
												>Browse by Area</router-link
											>
										</li>
										<li><hr class="dropdown-divider" /></li>
										<li>
											<a
												@click.prevent="
													goToRandomRecipe
												"
												class="dropdown-item"
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
												Random Recipe
											</a>
										</li>
									</ul>
								</li>

								<!-- Cocktails Dropdown -->
								<li class="nav-item dropdown">
									<a
										class="nav-link dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
										>Cocktails</a
									>
									<ul
										class="dropdown-menu"
										aria-labelledby="offcanvasNavbarDropdown"
									>
										<li>
											<router-link
												class="dropdown-item"
												:to="{ name: 'Cocktails' }"
												@click="closeOffcanvas"
												>Browse Filters</router-link
											>
										</li>
										<li><hr class="dropdown-divider" /></li>
										<li>
											<a
												@click.prevent="
													goToRandomCocktail
												"
												class="dropdown-item"
												:disabled="
													loadingRandomCocktail
												"
												style="cursor: pointer"
												data-bs-dismiss="offcanvas"
											>
												<span
													v-if="loadingRandomCocktail"
													class="spinner-border spinner-border-sm me-1"
													role="status"
													aria-hidden="true"
												></span>
												Random Cocktail
											</a>
										</li>
									</ul>
								</li>

								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/offers"
										@click="closeOffcanvas"
										>Offers</router-link
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
						class="btn btn-sm btn-outline-secondary me-2 theme-toggle-btn"
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
						class="btn btn-sm btn-outline-secondary me-2"
						aria-label="Open search modal"
						title="Search Recipes & Cocktails"
					>
						<i class="pi pi-search"></i>
					</button>

					<!-- Placeholder for Search/Profile Icon -->
					<!-- <a href="#" class="btn p-1"><i class="fas fa-search"></i></a> -->
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter, RouterLink, useRoute } from "vue-router";
import { getRandomCocktail } from "@/services/cocktailApi.js";
import { getRandomMeal } from "@/services/mealApi.js";
import { useTheme } from "@/composables/useTheme.js";

import cfLogoLight from "/img/cf-logo-light.png";
import cfLogoDark from "/img/cf-logo-dark.png";
import cfLogoAlt from "/img/cf-logo-alt.png";

const router = useRouter();
const route = useRoute();
const loadingRandom = ref(false);
const loadingRandomCocktail = ref(false);

// Use the theme composable
const { toggleTheme, isDarkMode } = useTheme();

// Inject the toggle function from App.vue
const toggleSearchModal = inject("toggleSearchModal", () => {
	console.warn("toggleSearchModal function not provided in Header");
});

// Function to programmatically click the close button
const closeOffcanvas = () => {
	const closeButton = document.querySelector("#offcanvasNavbar .btn-close");
	if (closeButton) {
		closeButton.click();
	}
};

const goToRandomRecipe = async () => {
	loadingRandom.value = true;
	console.log("goToRandomRecipe START");
	try {
		const meal = await getRandomMeal();

		if (meal && meal.idMeal) {
			console.log(
				`goToRandomRecipe: Navigating to recipe ${meal.idMeal}...`
			);
			router.push({ name: "RecipeDetail", params: { id: meal.idMeal } });
		} else {
			throw new Error("No random meal found or meal has no ID.");
		}
	} catch (error) {
		console.error("Error fetching random recipe:", error);
		alert("Failed to load a random recipe. Please try again.");
	} finally {
		loadingRandom.value = false;
		console.log("goToRandomRecipe END");
	}
};

const goToRandomCocktail = async () => {
	loadingRandomCocktail.value = true;
	console.log("goToRandomCocktail START");
	try {
		const cocktail = await getRandomCocktail();
		if (cocktail && cocktail.idDrink) {
			console.log(
				`goToRandomCocktail: Navigating to cocktail ${cocktail.idDrink}...`
			);
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
</script>
