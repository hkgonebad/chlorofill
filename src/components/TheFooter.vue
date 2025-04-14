<template>
	<footer>
		<div class="stickyFooter">
			<div class="container">
				<!-- Simplified footer - adapt links as needed -->
				<ul class="list-unstyled listFooter">
					<li>
						<router-link to="/offers">
							<img src="/img/icons/offerfootericon.jpg" alt="" />
							Offers
						</router-link>
					</li>
					<li>
						<router-link to="/about">
							<img
								src="/img/icons/aboutusfootericon.jpg"
								alt=""
							/>
							About Us
						</router-link>
					</li>
					<!-- Remove Store Locator for now -->
					<!-- <li>
            <router-link to="/store-locator">
              <img src="/img/icons/storefootericon.jpg" alt=""> Store Locator
            </router-link>
          </li> -->
					<li>
						<!-- Placeholder for Dark Mode Toggle -->
						<button
							@click="toggleDarkMode"
							class="btn btn-sm btn-secondary"
						>
							Toggle Dark Mode
						</button>
					</li>
				</ul>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { RouterLink } from "vue-router";

// Basic dark mode toggle logic using data-bs-theme
const toggleDarkMode = () => {
	const htmlElement = document.documentElement;
	const currentTheme = htmlElement.getAttribute("data-bs-theme");
	if (currentTheme === "dark") {
		htmlElement.setAttribute("data-bs-theme", "light");
	} else {
		htmlElement.setAttribute("data-bs-theme", "dark");
	}
};
</script>

<style scoped>
/* Add component-specific styles if needed */
.listFooter {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 10px 0;
}
.listFooter li a img {
	margin-right: 5px;
}
</style>
