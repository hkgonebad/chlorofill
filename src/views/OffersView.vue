<template>
	<div class="offers-view container py-4">
		<!-- <h1 class="mb-4">ChloroFill Offers & Tools</h1> -->

		<!-- Section: Current Deals -->
		<section class="offer-section mb-5 block">
			<h2 class="section-title mb-3">Today's Kitchen & Home Deals</h2>
			<div class="row row-cols-1 row-cols-md-2 g-4">
				<div
					class="col"
					v-for="(deal, index) in amazonDeals"
					:key="`deal-${index}`"
				>
					<div class="card h-100 shadow-sm">
						<!-- Image Wrapper for Badge Positioning -->
						<div class="card-img-wrapper">
							<img
								v-if="deal.imageUrl"
								:src="deal.imageUrl"
								class="card-img-top"
								:alt="deal.name"
								style="height: 180px; object-fit: cover"
							/>
							<span
								v-if="deal.offerText"
								class="badge offer-badge bg-danger"
								>{{ deal.offerText }}</span
							>
						</div>
						<div class="card-body d-flex flex-column">
							<h5 class="card-title">{{ deal.name }}</h5>
							<p
								v-if="deal.description"
								class="card-text small text-muted flex-grow-1"
							>
								{{ deal.description }}
							</p>
							<div>
								<!-- Wrapper div for button alignment -->
								<a
									:href="getAmazonSearchUrl(deal.searchTerm)"
									class="btn btn-sm btn-primary mt-auto"
									target="_blank"
									rel="noopener noreferrer"
									>View Deal</a
								>
							</div>
						</div>
					</div>
					<!-- End card -->
				</div>
				<!-- End col -->
			</div>
			<!-- End row -->
		</section>
		<!-- End Deals Section -->

		<!-- Section: Featured Kitchen Tools -->
		<section class="offer-section mb-5 block">
			<h2 class="section-title mb-3">Featured Kitchen Tools</h2>
			<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
				<div
					class="col"
					v-for="(tool, index) in kitchenTools"
					:key="`tool-${index}`"
				>
					<div class="card h-100 shadow-sm">
						<div class="card-img-wrapper">
							<img
								v-if="tool.imageUrl"
								:src="tool.imageUrl"
								class="card-img-top"
								:alt="tool.name"
								style="height: 180px; object-fit: cover"
							/>
							<span
								v-if="tool.offerText"
								class="badge offer-badge bg-success"
								>{{ tool.offerText }}</span
							>
						</div>
						<div class="card-body d-flex flex-column">
							<h5 class="card-title">{{ tool.name }}</h5>
							<p
								v-if="tool.description"
								class="card-text small text-muted flex-grow-1"
							>
								{{ tool.description }}
							</p>
							<div>
								<a
									:href="getAmazonSearchUrl(tool.searchTerm)"
									class="btn btn-sm btn-secondary mt-auto"
									target="_blank"
									rel="noopener noreferrer"
									>Check Price</a
								>
							</div>
						</div>
					</div>
					<!-- End card -->
				</div>
				<!-- End col -->
			</div>
			<!-- End row -->
		</section>
		<!-- End Tools Section -->

		<!-- Section: Cookbook Corner -->
		<section class="offer-section mb-5 block">
			<h2 class="section-title mb-3">Cookbook Corner</h2>
			<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
				<div
					class="col"
					v-for="(book, index) in cookbooks"
					:key="`book-${index}`"
				>
					<div class="card h-100 shadow-sm">
						<div class="card-img-wrapper">
							<img
								v-if="book.imageUrl"
								:src="book.imageUrl"
								class="card-img-top"
								:alt="book.name"
								style="height: 180px; object-fit: cover"
							/>
							<span
								v-if="book.offerText"
								class="badge offer-badge bg-info"
								>{{ book.offerText }}</span
							>
						</div>
						<div class="card-body d-flex flex-column">
							<h5 class="card-title">{{ book.name }}</h5>
							<p
								v-if="book.description"
								class="card-text small text-muted flex-grow-1"
							>
								{{ book.description }}
							</p>
							<div>
								<a
									:href="getAmazonSearchUrl(book.searchTerm)"
									class="btn btn-sm btn-info text-white mt-auto"
									target="_blank"
									rel="noopener noreferrer"
									>Discover Books</a
								>
							</div>
						</div>
					</div>
					<!-- End card -->
				</div>
				<!-- End col -->
			</div>
			<!-- End row -->
		</section>
		<!-- End Books Section -->
	</div>
	<!-- End container -->
</template>

<script setup>
import { ref } from "vue";

// Import images
import appliancesImg from "/img/offers/appliances.jpg";
import cookwareImg from "/img/offers/cookware.jpg";
import toolsImg from "/img/offers/tools.jpg";
import dealsImg from "/img/offers/deals.jpg";
import cookbooksImg from "/img/offers/cookbooks.jpg";

// --- START AFFILIATE LINK CONFIG ---
const AMAZON_AFFILIATE_TAG = "awzdigital00-21"; // Your Amazon affiliate tag
const AMAZON_BASE_URL = "https://www.amazon.in/s";

const getAmazonSearchUrl = (searchTerm) => {
	if (!searchTerm) return "#"; // Return a harmless link if search term is empty
	const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
	return `${AMAZON_BASE_URL}?k=${encodedSearchTerm}&tag=${AMAZON_AFFILIATE_TAG}`;
};
// --- END AFFILIATE LINK CONFIG ---

// --- START SAMPLE OFFER DATA ---

// Sample data for Amazon Deals (using search terms)
const amazonDeals = ref([
	{
		name: "Kitchen Appliance Deals",
		searchTerm: "kitchen appliance deals",
		description: "Find discounts on mixers, blenders, and more.",
		imageUrl: appliancesImg,
		offerText: "Up to 40% Off",
	},
	{
		name: "Cookware Savings",
		searchTerm: "cookware set deals",
		description: "Save on pots, pans, and baking dishes.",
		imageUrl: cookwareImg,
		offerText: "Flash Sale",
	},
	{
		name: "Cutlery & Gadgets",
		searchTerm: "kitchen knife set deals",
		description: "Sharp deals on knife sets and essential gadgets.",
		imageUrl: toolsImg,
	},
	{
		name: "General Home Deals",
		searchTerm: "home kitchen deals",
		description: "Check out offers on various home & kitchen items.",
		imageUrl: dealsImg,
		offerText: "Limited Time",
	},
]);

// Sample data for Featured Kitchen Tools
const kitchenTools = ref([
	{
		name: "Quality Chef's Knife",
		searchTerm: "chef knife 8 inch",
		description: "An essential tool for any kitchen.",
		imageUrl: toolsImg,
		offerText: "Best Seller",
	},
	{
		name: "Non-Stick Frying Pan",
		searchTerm: "non-stick frying pan 10 inch",
		description: "Perfect for eggs, pancakes, and sauteing.",
		imageUrl: cookwareImg,
	},
	{
		name: "Stand Mixer",
		searchTerm: "stand mixer kitchen",
		description: "For baking bread, cakes, and whipping cream.",
		imageUrl: appliancesImg,
		offerText: "Top Rated",
	},
	{
		name: "High-Speed Blender",
		searchTerm: "high speed blender smoothie",
		description: "Great for smoothies, soups, and sauces.",
		imageUrl: appliancesImg,
	},
	{
		name: "Instant Pot / Multicooker",
		searchTerm: "instant pot multi cooker",
		description: "Versatile cooking with pressure and slow cooking.",
		imageUrl: appliancesImg,
	},
	{
		name: "Digital Kitchen Scale",
		searchTerm: "digital kitchen scale food",
		description: "Accurate measurements for baking and cooking.",
		imageUrl: toolsImg,
		offerText: "Essential",
	},
]);

// Sample data for Cookbooks
const cookbooks = ref([
	{
		name: "Italian Cuisine",
		searchTerm: "italian cookbook best seller",
		description: "Master pasta, pizza, and classic Italian dishes.",
		imageUrl: cookbooksImg,
		offerText: "Classic Recipes",
	},
	{
		name: "Indian Cooking Guides",
		searchTerm: "indian cookbook authentic",
		description: "Explore the rich flavors of Indian cooking.",
		imageUrl: cookbooksImg,
	},
	{
		name: "Baking Essentials",
		searchTerm: "baking cookbook for beginners",
		description:
			"Learn the fundamentals of baking bread, cakes, and pastries.",
		imageUrl: cookbooksImg,
		offerText: "Beginner Friendly",
	},
	{
		name: "Healthy Eating Recipes",
		searchTerm: "healthy cookbook quick easy",
		description: "Find nutritious and delicious meal ideas.",
		imageUrl: cookbooksImg,
	},
	{
		name: "Vegetarian Favorites",
		searchTerm: "vegetarian cookbook modern",
		description: "Discover creative and satisfying vegetarian meals.",
		imageUrl: cookbooksImg,
	},
	{
		name: "World Cuisine",
		searchTerm: "world cuisine cookbook",
		description: "Travel the globe through your kitchen.",
		imageUrl: cookbooksImg,
		offerText: "Explore Flavors",
	},
]);

// --- END SAMPLE OFFER DATA ---
</script>

<style scoped lang="scss">
.offer-section .card {
	border: 1px solid var(--bs-border-color-translucent);
}

.card-img-wrapper {
	position: relative; // Context for absolute positioning

	.offer-badge {
		position: absolute;
		top: 0.75rem; // Adjust as needed
		right: 0.75rem; // Adjust as needed
		z-index: 1; // Ensure badge is above the image
		font-size: 0.75em; // Slightly smaller badge text
		padding: 0.3em 0.5em;
	}
}

// Ensure buttons align at the bottom even if content height varies
.card-body {
	.btn {
		margin-top: auto; // Pushes the button to the bottom of the flex container
	}
}
</style>
