<template>
  <div class="w-2/3 bg-white rounded-lg shadow-xs p-6">
    <h3 class="text-base font-semibold mb-4">Main Information</h3>

    <!-- Mock Inputs -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Type</label>
        <select
          class="w-full border rounded-xs px-3 py-2 text-sm bg-gray-100 text-gray-700"
          disabled
        >
          <option selected>2</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1"
          >Highlight</label
        >
        <select
          class="w-full border rounded-xs px-3 py-2 text-sm bg-gray-100 text-gray-700"
          disabled
        >
          <option selected>Not a highlight</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1"
          >Category</label
        >
        <select
          class="w-full border rounded-xs px-3 py-2 text-sm bg-gray-100 text-gray-700"
          disabled
        >
          <option selected>2</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Tags</label>
        <select
          class="w-full border rounded-xs px-3 py-2 text-sm bg-gray-100 text-gray-700"
          disabled
        >
          <option selected>-</option>
        </select>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1"
        >Banner Title</label
      >
      <input
        type="text"
        class="w-full border rounded-xs px-3 py-2 text-sm"
        placeholder="Please input field"
      />
    </div>

    <!-- Title -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1">Title</label>
      <input
        v-model="title"
        type="text"
        class="w-full border rounded-xs px-3 py-2 text-sm"
        placeholder="Please input title"
      />
    </div>

    <!-- Uploaders -->
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-3">
        <label class="block text-sm font-medium text-gray-600 mb-1"
          >Cover Image</label
        >
        <div
          class="w-full p-4 rounded-xl border border-gray-300 bg-white/10 backdrop-blur-md text-gray-800 shadow-md transition"
        >
          <CoverUploader @update="onCoverUpdate" :clear="coverReset" />
        </div>
      </div>
      <div class="col-span-9">
        <label class="block text-sm font-medium text-gray-600 mb-1"
          >Article Image</label
        >
        <ArticleUploader @update="onArticleUpdate" :clear="articleReset" />
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1"
        >Footer Banner</label
      >
      <input
        type="text"
        class="w-full border rounded-xs px-3 py-2 text-sm"
        placeholder="DLD"
      />
    </div>

    <!-- Description -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1"
        >Description</label
      >
      <textarea
        v-model="description"
        class="w-full border rounded-xs px-3 py-2 text-sm"
        placeholder="Please input description"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1"
        >Custom Field</label
      >
      <input type="text" class="w-full border rounded-xs px-3 py-2 text-sm" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import ArticleUploader from "./ArticleUploader.vue";
import CoverUploader from "./CoverUploader.vue";

const emit = defineEmits(["update-preview", "preview"]);
const props = defineProps({
  clearTrigger: Number,
});

const title = ref("");
const description = ref("");
const coverReset = ref(0);
const articleReset = ref(0);
const cover = ref(null);
const images = ref([]);

watch(
  () => props.clearTrigger,
  () => {
    document.querySelectorAll("input[type='text'], textarea").forEach((el) => {
      el.value = "";
    });
    title.value = "";
    description.value = "";
    cover.value = null;
    images.value = [];
    emit("update-preview", {
      cover: null,
      images: [],
      title: "",
      description: "",
    });
    coverReset.value++;
    articleReset.value++;
  },
);

function onCoverUpdate(url) {
  cover.value = url;
}

function onArticleUpdate(imgs) {
  images.value = imgs;
}

function handlePreview() {
  const preview = {
    title: title.value,
    description: description.value,
    cover: cover.value,
    images: images.value,
    likeCount: 999,
    shareCount: 100,
  };
  emit("preview", preview);
  emit("update-preview", preview);
}

defineExpose({
  handlePreview,
});
</script>
