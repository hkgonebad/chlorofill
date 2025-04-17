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

const app = createApp(App);
const head = createHead();

app.use(router); // Tell Vue to use the router
app.use(head); // Use @vueuse/head for meta management

app.mount("#app");
