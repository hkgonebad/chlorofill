import { createRouter, createWebHistory } from "vue-router";

// Import view components (we will create these soon)
// import HomeView from '../views/HomeView.vue';
// import AboutView from '../views/AboutView.vue';
// import CategoriesView from '../views/CategoriesView.vue';
// import OffersView from '../views/OffersView.vue';

// Lazy-load imports
const HomeView = () => import("../views/HomeView.vue");
const AboutView = () => import("../views/AboutView.vue");
const CategoriesView = () => import("../views/CategoriesView.vue");
const OffersView = () => import("../views/OffersView.vue");
const CategoryRecipesView = () => import("../views/CategoryRecipesView.vue");
const RecipeDetailView = () => import("../views/RecipeDetailView.vue");
const AreasView = () => import("../views/AreasView.vue"); // <-- Import AreasView
const AreaRecipesView = () => import("../views/AreaRecipesView.vue"); // <-- Import AreaRecipesView
const FavoritesView = () => import("../views/FavoritesView.vue"); // <-- Import FavoritesView
const CocktailsView = () => import("../views/CocktailsView.vue"); // <-- Import CocktailsView
const CocktailListView = () => import("../views/CocktailListView.vue"); // <-- Import CocktailListView
const CocktailDetailView = () => import("../views/CocktailDetailView.vue"); // <-- Import CocktailDetailView
const BrowseView = () => import("../views/BrowseView.vue"); // <-- Import BrowseView
const NotFoundView = () => import("../views/NotFoundView.vue"); // <-- Import NotFoundView

const routes = [
	{
		path: "/",
		name: "Home",
		component: HomeView,
		meta: { title: "" },
	},
	{
		path: "/about",
		name: "About",
		component: AboutView,
		meta: { title: "About Us" },
	},
	{
		path: "/categories",
		name: "Categories",
		component: CategoriesView,
		meta: { title: "Meal Categories" },
	},
	{
		path: "/offers",
		name: "Offers",
		component: OffersView,
		meta: { title: "Offers & Deals" },
	},
	// Route for recipes by category
	{
		path: "/category/:categoryName",
		name: "CategoryRecipes",
		component: CategoryRecipesView,
		props: true,
		meta: { title: "Category Recipes" },
	},
	// Route for list of areas
	{
		path: "/areas",
		name: "Areas",
		component: AreasView,
		meta: { title: "Browse by Area" },
	},
	// Route for recipes by area
	{
		path: "/areas/:areaName", // Dynamic segment for area name
		name: "AreaRecipes", // Name used in <router-link>
		component: AreaRecipesView,
		props: true, // Pass route params as props to the component
		meta: { title: "Area Recipes" },
	},
	// Route for individual recipe details
	{
		path: "/recipe/:id",
		name: "RecipeDetail",
		component: RecipeDetailView,
		props: true,
		meta: { title: "Recipe Details" },
	},
	// Route for Favorites page
	{
		path: "/favorites",
		name: "Favorites",
		component: FavoritesView,
		meta: { title: "My Favorites" },
	},
	// Route for Cocktails listing/filters page
	{
		path: "/cocktails",
		name: "Cocktails",
		component: CocktailsView,
		meta: { title: "Cocktail Filters" },
	},
	// Route for list of cocktails by filter
	{
		path: "/cocktails/filter/:filterType/:filterValue", // e.g., /cocktails/filter/a/Alcoholic
		name: "CocktailList",
		component: CocktailListView,
		props: true, // Pass filterType and filterValue as props
		meta: { title: "Filtered Cocktails" },
	},
	// Route for individual cocktail details
	{
		path: "/cocktail/:id",
		name: "CocktailDetail",
		component: CocktailDetailView,
		props: true, // Pass id as prop
		meta: { title: "Cocktail Details" },
	},
	// Route for Browse view
	{
		path: "/browse",
		name: "Browse",
		component: BrowseView,
		meta: { title: "Browse All" },
	},
	// Add other routes as needed
	{
		path: "/:pathMatch(.*)*",
		name: "NotFound",
		component: NotFoundView,
		meta: { title: "Page Not Found" },
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	linkActiveClass: "active",
	linkExactActiveClass: "exact-active",
	scrollBehavior(to, from, savedPosition) {
		// always scroll to top
		return { top: 0 };
	},
});

export default router;
