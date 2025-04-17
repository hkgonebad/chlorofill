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
							<!-- Update title later -->
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
				<router-link to="/" class="logo"
					><img src="/img/logo.png" alt="ChloroFill Logo"
				/></router-link>

				<div class="extras d-flex align-items-center">
					<!-- Conditionally render Search Input -->
					<RecipeSearch v-if="route.name !== 'Home'" class="me-2" />

					<!-- Dark Mode Toggle Button -->
					<button
						@click="toggleDarkMode"
						class="btn btn-sm btn-outline-secondary p-1 me-2 theme-toggle-btn"
						aria-label="Toggle theme"
					>
						<i class="pi pi-moon d-none d-theme-dark"></i>
						<i class="pi pi-sun d-theme-light"></i>
					</button>
					<!-- Placeholder for Search/Profile Icon -->
					<!-- <a href="#" class="btn p-1"><i class="fas fa-search"></i></a> -->
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink, useRoute } from "vue-router";
import RecipeSearch from "./RecipeSearch.vue";
import { getRandomCocktail } from "@/services/cocktailApi.js";
import { getRandomMeal } from "@/services/mealApi.js";

const router = useRouter();
const route = useRoute();
const loadingRandom = ref(false);
const loadingRandomCocktail = ref(false);

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
		console.log("goToRandomCocktail END");
	}
};

const toggleDarkMode = () => {
	console.log("Theme toggle clicked!");
	const htmlElement = document.documentElement;
	const currentTheme = htmlElement.getAttribute("data-bs-theme") || "light";
	htmlElement.setAttribute(
		"data-bs-theme",
		currentTheme === "dark" ? "light" : "dark"
	);
};
</script>
