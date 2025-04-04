import App from "@/App.vue";
import "@/assets/css/global.css";
import router from "@/router";
import { createApp } from "vue";

createApp(App).use(router).mount("#app");
