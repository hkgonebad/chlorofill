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
								<li class="nav-item dropdown">
									<a
										class="nav-link dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
										>Category</a
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
									</ul>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										:to="{ name: 'Areas' }"
										@click="closeOffcanvas"
										>Browse by Area</router-link
									>
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
								<!-- Random Recipe Button keeps data-bs-dismiss -->
								<li class="nav-item">
									<a
										@click.prevent="goToRandomRecipe"
										class="nav-link"
										:disabled="loadingRandom"
										style="cursor: pointer"
										data-bs-dismiss="offcanvas"
									>
										<span
											v-if="loadingRandom"
											class="spinner-border spinner-border-sm"
											role="status"
											aria-hidden="true"
										></span>
										Random Recipe
									</a>
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

const router = useRouter();
const route = useRoute();
const loadingRandom = ref(false);

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
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/random.php`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.meals && data.meals.length > 0) {
			const mealId = data.meals[0].idMeal;
			console.log(`goToRandomRecipe: Navigating to recipe ${mealId}...`);
			router.push({ name: "RecipeDetail", params: { id: mealId } });
		} else {
			throw new Error("No random meal found.");
		}
	} catch (error) {
		console.error("Error fetching random recipe:", error);
		alert("Failed to load a random recipe. Please try again.");
	} finally {
		loadingRandom.value = false;
		console.log("goToRandomRecipe END");
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
