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
							<!-- Use router-link for navigation -->
							<ul class="navbar-nav flex-grow-1">
								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/"
										>Home</router-link
									>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/about"
										>About Us</router-link
									>
								</li>
								<!-- <li class="nav-item">
                  <a class="nav-link" href="#">Contact</a>
                </li> -->
								<li class="nav-item dropdown">
									<a
										class="nav-link dropdown-toggle"
										href="#"
										id="offcanvasNavbarDropdown"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										Category
									</a>
									<!-- Static categories for now - replace with dynamic later -->
									<ul
										class="dropdown-menu"
										aria-labelledby="offcanvasNavbarDropdown"
									>
										<li>
											<router-link
												class="dropdown-item"
												to="/categories"
												>All Categories</router-link
											>
										</li>
										<!-- Add specific category links later if needed -->
										<!-- <li><a class="dropdown-item" href="#">Fresh Produce</a></li> ... -->
									</ul>
								</li>
								<li class="nav-item">
									<router-link
										class="nav-link"
										active-class="active"
										to="/offers"
										>Offers</router-link
									>
								</li>
								<!-- Remove Store Locator for now -->
								<!-- <li class="nav-item">
                  <router-link class="nav-link" active-class="active" to="/store-locator">Store Locator</router-link>
                </li> -->
							</ul>
						</div>
					</div>
				</nav>

				<!-- Update logo path and alt text later -->
				<router-link to="/" class="logo"
					><img src="/img/logo.png" alt="ChloroFill Logo"
				/></router-link>

				<div class="extras d-flex align-items-center">
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
import { RouterLink } from "vue-router";

// Dark mode toggle logic
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
