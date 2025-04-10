<template>
  <div
    class="w-full"
    @dragover.prevent
    @dragenter.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <!-- Upload Box -->
    <div
      class="border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center justify-center space-y-2 hover:bg-gray-100 transition cursor-pointer"
      @click="triggerFileInput"
      :class="{ 'bg-blue-100/30 border-blue-400': isDragging }"
    >
      <img
        src="@/assets/icons/icon-upload.svg"
        alt="Upload Icon"
        class="h-8 w-8 opacity-60"
      />
      <p class="text-sm text-gray-500">Upload</p>
    </div>

    <!-- Hidden Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />
    <input
      ref="replaceInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onReplaceSelected"
    />

    <!-- Preview -->
    <div v-if="preview" class="mt-6">
      <ImagePreview
        :url="preview.url"
        @view="viewImage(preview.url)"
        @replace="triggerReplace"
        @remove="removeImage"
      />
      <div class="text-[12px] text-center text-gray-500 mt-1">
        <p class="truncate">{{ preview.name }}</p>
        <p>{{ formatSize(preview.size) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ImagePreview from "@/components/ImagePreview.vue";
import { ref, watch } from "vue";

const props = defineProps({ clear: Number });
const emit = defineEmits(["update"]);

const fileInput = ref(null);
const replaceInput = ref(null);
const isDragging = ref(false);
const preview = ref(null);

watch(
  () => props.clear,
  () => {
    preview.value = null;
    emit("update", null);
  },
);

function triggerFileInput() {
  fileInput.value?.click();
}

function onFileChange(event) {
  const file = event.target.files[0];
  processFile(file);
  fileInput.value.value = "";
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0];
  processFile(file);
  isDragging.value = false;
}

function processFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const url = URL.createObjectURL(file);
  preview.value = {
    name: file.name,
    size: file.size,
    url,
    file,
  };
  emit("update", url);
}

function viewImage(url) {
  window.open(url, "_blank");
}

function triggerReplace() {
  replaceInput.value?.click();
}

function onReplaceSelected(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;
  processFile(file);
  replaceInput.value.value = "";
}

function removeImage() {
  preview.value = null;
  emit("update", null);
}

function formatSize(bytes) {
  if (bytes > 1048576) return (bytes / 1048576).toFixed(2) + " MB";
  if (bytes > 1024) return (bytes / 1024).toFixed(1) + " KB";
  return `${bytes} B`;
}
</script>
