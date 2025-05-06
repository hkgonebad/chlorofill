// Vite entry point
// console.log("Vite + Vanilla JS loaded"); // Optional: keep or remove

import { createApp } from "vue";
import App from "../src/App.vue";
// Import Bootstrap JS (bundle includes Popper)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Bootstrap SCSS will be imported within main.scss
// import 'bootstrap/scss/bootstrap.scss';

// Import your custom main SCSS file (which now imports partials like _dark-mode.scss)
import "../scss/main.scss";

// Import the router
import router from "../src/router"; // Path relative to main.js

// Import and setup unhead with the correct import and configuration
import { createHead } from "@unhead/vue/client";

// Import Toast notifications
import Toast from "vue-toastification";
// Import the CSS or use your own! Adjust path if needed.
import "vue-toastification/dist/index.css";

const app = createApp(App);

// console.log("[DEBUG] About to create head instance");
// Create head with DOM update enabled
const head = createHead({
	// Ensure unhead can manipulate the DOM and override static tags
	document: window.document,
	domDelayFn: (fn) => setTimeout(fn, 10), // small delay to let Vue render first
	// Key tags by name/property for better deduplication
	tagKeyMap: { meta: ["name", "property", "charset"] },
});
// console.log("[DEBUG] head instance:", head);

app.use(router); // Tell Vue to use the router
app.use(head); // Use unhead for meta management

// Configure Toast
const options = {
	// Optional default options here
	// See https://vue-toastification.maronato.dev/ for config options
	position: "bottom-right",
	timeout: 5000,
	closeOnClick: true,
	pauseOnFocusLoss: true,
	pauseOnHover: true,
	draggable: true,
	draggablePercent: 0.6,
	showCloseButtonOnHover: false,
	hideProgressBar: false,
	closeButton: "button",
	icon: true,
	rtl: false,
};
app.use(Toast, options);

app.mount("#app");

// After the app is mounted, wait a short time to ensure everything is rendered
// before dispatching the event for prerendering
setTimeout(() => {
	document.dispatchEvent(new Event("app.rendered"));
	console.log("[PRERENDER] Dispatched app.rendered event");
}, 1000); // Adjust timeout as needed
