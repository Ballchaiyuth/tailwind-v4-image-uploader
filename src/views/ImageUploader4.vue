<template>
  <div
    :class="['min-h-without-header', isDark ? 'bg-gray-900' : 'bg-gray-100']"
    class="text-gray-800 flex flex-col relative transition-colors duration-300"
  >
    <!-- Header -->
    <UploaderHeader
      :is-dark="isDark"
      @preview="handlePreview"
      @clear="handleClear"
      @save="handleSave"
    />

    <!-- Content Body -->
    <div class="flex-1 flex gap-4 p-6">
      <!-- Left: Form -->
      <UploaderForm
        ref="formRef"
        :is-dark="isDark"
        :clear-trigger="clearSignal"
        @update-preview="updatePreviewData"
        @preview="handleFormPreview"
      />

      <!-- Right: Mobile Preview -->
      <MobilePreview :data="previewData" :is-dark="isDark" />
    </div>

    <!-- Theme Switch Toggle -->
    <div
      class="absolute bottom-6 right-6 flex items-center gap-2 cursor-pointer select-none"
      @click="isDark = !isDark"
    >
      <div
        class="w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300"
      >
        <div
          class="bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center"
          :class="{ 'translate-x-6': isDark }"
        >
          <img
            v-if="isDark"
            src="@/assets/icons/moon.svg"
            alt="Moon"
            class="w-4 h-4 filter brightness-0"
          />
          <img
            v-else
            src="@/assets/icons/sun.svg"
            alt="Sun"
            class="w-4 h-4 text-yellow-400"
          />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showSaveModal"
      id="save-popup"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 border border-yellow-400 px-4 py-3 rounded-lg shadow-lg z-50 w-[90%] max-w-md"
    >
      <div class="flex justify-between items-center mb-2">
        <strong class="text-yellow-700">📝 Image Order Sent</strong>
        <button
          @click="showSaveModal = false"
          class="text-yellow-500 hover:text-yellow-800"
        >
          ✕
        </button>
      </div>
      <pre class="whitespace-pre-wrap text-sm font-mono">{{
        orderedImageNames.join("\n")
      }}</pre>
    </div>
  </div>
</template>

<script setup>
import MobilePreview from "@/components/MobilePreview.vue";
import UploaderForm from "@/components/UploaderForm.vue";
import UploaderHeader from "@/components/UploaderHeader.vue";
import { nextTick, ref } from "vue";

const formRef = ref(null);
const previewData = ref({});
const formDraft = ref({
  cover: null,
  images: [],
  title: "",
  description: "",
});
const clearSignal = ref(0);
const isDark = ref(false);

const showSaveModal = ref(false);
const orderedImageNames = ref([]);

function handlePreview() {
  formRef.value?.handlePreview();
}

function handleFormPreview(data) {
  previewData.value = { ...data };
}

function updatePreviewData(newData) {
  formDraft.value = { ...formDraft.value, ...newData };
}

function handleSave() {
  const images = formRef.value?.getImageList?.() || [];
  orderedImageNames.value = images.map(
    (img, i) => `${i + 1}. ${img.name || "Unnamed Image"}`,
  );
  showSaveModal.value = true;

  nextTick(() => {
    document
      .getElementById("save-popup")
      ?.scrollIntoView({ behavior: "smooth" });
  });
}

function handleClear() {
  previewData.value = {};
  formDraft.value = {
    cover: null,
    images: [],
    title: "",
    description: "",
  };
  clearSignal.value++;
}
</script>
