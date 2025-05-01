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
const ProfileView = () => import("../views/ProfileView.vue"); // Import ProfileView

// New imports for Auth
// const AuthLayout = () => import("../layouts/AuthLayout.vue"); // No longer needed here
const LoginView = () => import("../views/LoginView.vue");
const SignupView = () => import("../views/SignupView.vue");

// Default meta tags that will be used as fallback
const defaultMetaTags = {
	title: "ChloroFill 🍴🍹 - A Vue Recipe",
	description:
		"Discover and explore delicious recipes and cocktails with ChloroFill 🍴🍹",
	image: "https://chlorofill.vercel.app/img/og-default.jpg",
	url: "https://chlorofill.vercel.app",
};

const routes = [
	{
		// Default Layout Routes (implicitly handled by App.vue)
		path: "/",
		// component: App, // Not needed
		children: [
			{
				path: "", // Use empty path for the root / home
				name: "Home",
				component: HomeView,
				meta: {
					title: defaultMetaTags.title,
					metaTags: [
						{
							name: "description",
							content: defaultMetaTags.description,
						},
						{
							property: "og:title",
							content: defaultMetaTags.title,
						},
						{
							property: "og:description",
							content: defaultMetaTags.description,
						},
						{
							property: "og:image",
							content: defaultMetaTags.image,
						},
						{
							property: "og:url",
							content: defaultMetaTags.url,
						},
						{
							name: "twitter:card",
							content: "summary_large_image",
						},
					],
				},
			},
			{
				path: "about",
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
				meta: {
					title: "Recipe Details",
					dynamicMetaTags: true, // Flag to indicate this route needs dynamic meta tags
				},
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
				props: true,
				meta: {
					title: "Cocktail Details",
					dynamicMetaTags: true, // Flag to indicate this route needs dynamic meta tags
				},
			},
			// Route for Browse view
			{
				path: "browse",
				name: "Browse",
				component: BrowseView,
				meta: { title: "Browse All" },
			},
			// Add Profile route under default layout
			{
				path: "profile", // Define the path for the profile page
				name: "Profile",
				component: ProfileView,
				meta: { title: "My Profile", requiresAuth: true }, // Add requiresAuth meta if needed later
			},
		],
	},
	{
		// Auth Layout Routes
		path: "/login",
		name: "Login",
		component: LoginView,
		meta: { title: "Login", layout: "AuthLayout" }, // Add layout meta
	},
	{
		path: "/signup",
		name: "Signup",
		component: SignupView,
		meta: { title: "Sign Up", layout: "AuthLayout" }, // Add layout meta
	},

	// Catch-all 404 route (should be last)
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

// Navigation guard to update meta tags
router.beforeEach((to, from, next) => {
	// Update meta tags
	const nearestWithTitle = to.matched
		.slice()
		.reverse()
		.find((r) => r.meta && r.meta.title);

	const nearestWithMeta = to.matched
		.slice()
		.reverse()
		.find((r) => r.meta && r.meta.metaTags);

	// Set default title if none found
	if (nearestWithTitle) {
		document.title = nearestWithTitle.meta.title;
	} else {
		document.title = defaultMetaTags.title;
	}

	// Remove any stale meta tags from the document head
	Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
		(el) => el.parentNode.removeChild(el)
	);

	// Add default meta tags if no specific ones are defined
	if (!nearestWithMeta) {
		const tags = [
			{
				name: "description",
				content: defaultMetaTags.description,
			},
			{
				property: "og:title",
				content: defaultMetaTags.title,
			},
			{
				property: "og:description",
				content: defaultMetaTags.description,
			},
			{
				property: "og:image",
				content: defaultMetaTags.image,
			},
			{
				property: "og:url",
				content: window.location.href,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
		];

		tags.forEach((tagDef) => {
			const tag = document.createElement("meta");
			Object.keys(tagDef).forEach((key) => {
				tag.setAttribute(key, tagDef[key]);
			});
			tag.setAttribute("data-vue-router-controlled", "");
			document.head.appendChild(tag);
		});
	}

	next();
});

export default router;
