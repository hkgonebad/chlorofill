<template>
	<header>
		<div class="topHeader">
			<div class="container">
				<nav class="navbar navbar-light">
					<button
						class="navbar-toggler"
						type="button"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasNavbar"
						aria-controls="offcanvasNavbar"
					>
						<i class="fa fa-bars"></i>
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

				<!-- Remove Store Locator button for now -->
				<!-- <div class="extras">
          <a href="store-locator.html" class="btn"><i class="fa fa-map-marker-alt"></i><span>Store Locator</span></a>
        </div> -->
			</div>
		</div>
	</header>
</template>

<script setup>
import { RouterLink } from "vue-router";
// No specific script logic needed for header yet
</script>

<style scoped>
/* Add component-specific styles if needed */
.nav-link.active {
	/* Add styles for active link if Bootstrap defaults aren't enough */
	font-weight: bold;
}
</style>
