import Home from "@/views/Home.vue";
import ImageUploader1 from "@/views/ImageUploader1.vue";
import ImageUploader2 from "@/views/ImageUploader2.vue";
import ImageUploader3 from "@/views/ImageUploader3.vue";
import ImageUploader4 from "@/views/ImageUploader4.vue";
import ImageUploader5 from "@/views/ImageUploader5.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/upload1", component: ImageUploader1 },
  { path: "/upload2", component: ImageUploader2 },
  { path: "/upload3", component: ImageUploader3 },
  { path: "/upload4", component: ImageUploader4 },
  { path: "/upload5", component: ImageUploader5 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
