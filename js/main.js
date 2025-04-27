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
import { createHead } from "@vueuse/head";

// Import Toast notifications
import Toast from "vue-toastification";
// Import the CSS or use your own! Adjust path if needed.
import "vue-toastification/dist/index.css";

const app = createApp(App);
const head = createHead();

app.use(router); // Tell Vue to use the router
app.use(head); // Use @vueuse/head for meta management

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
