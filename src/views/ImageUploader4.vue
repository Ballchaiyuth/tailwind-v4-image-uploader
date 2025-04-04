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
  </div>
</template>

<script setup>
import { ref } from "vue";
import MobilePreview from "@/components/MobilePreview.vue";
import UploaderForm from "@/components/UploaderForm.vue";
import UploaderHeader from "@/components/UploaderHeader.vue";

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

function handlePreview() {
  formRef.value?.handlePreview();
}

function handleFormPreview(data) {
  previewData.value = { ...data };
}

function updatePreviewData(newData) {
  formDraft.value = { ...formDraft.value, ...newData };
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
