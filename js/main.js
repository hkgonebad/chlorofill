// Vite entry point
// console.log("Vite + Vanilla JS loaded"); // Optional: keep or remove

// We will add TheMealDB API fetching logic here later

// OLD JQUERY CODE REMOVED

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

const app = createApp(App);

app.use(router); // Tell Vue to use the router

app.mount("#app");
