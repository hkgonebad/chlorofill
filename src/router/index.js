import { createRouter, createWebHistory } from "vue-router";

// Import view components (we will create these soon)
// import HomeView from '../views/HomeView.vue';
// import AboutView from '../views/AboutView.vue';
// import CategoriesView from '../views/CategoriesView.vue';
// import OffersView from '../views/OffersView.vue';

const routes = [
	{
		path: "/",
		name: "Home",
		// component: HomeView // Add component later
		component: () => import("../views/HomeView.vue"), // Lazy load example
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (About.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import("../views/AboutView.vue"),
	},
	{
		path: "/categories",
		name: "Categories",
		component: () => import("../views/CategoriesView.vue"),
	},
	{
		path: "/offers",
		name: "Offers",
		component: () => import("../views/OffersView.vue"),
	},
	// Add other routes as needed
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL), // Use history mode
	routes,
	linkActiveClass: "active", // Optional: class for active links (matches existing CSS)
	linkExactActiveClass: "exact-active", // Optional: class for exact active links
});

export default router;
