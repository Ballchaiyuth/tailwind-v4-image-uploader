<template>
  <div
    class="min-h-without-header flex flex-col items-center justify-center text-blue-400 p-4"
  >
    <h1 class="text-3xl font-bold mb-4">Image Uploader 1</h1>
    <p class="mb-6 text-sm text-blue-300">
      A minimal uploader with multi-file support and basic actions like preview,
      replace, and delete.
    </p>

    <!-- Upload Box -->
    <div
      class="w-full max-w-md border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer transition hover:bg-blue-900/20"
      @click="triggerFileSelect"
      @dragover.prevent
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'bg-blue-900/20 border-blue-300': isDragging }"
    >
      <p class="text-blue-300">Drag & drop image(s) here, or click to choose</p>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        multiple
        class="hidden"
        @change="onFilesSelected"
      />
    </div>

    <!-- File List -->
    <ul
      v-if="files.length"
      class="mt-6 text-sm text-blue-300 space-y-2 w-full max-w-md"
    >
      <li
        v-for="(file, index) in files"
        :key="index"
        class="flex justify-between items-center border-b border-blue-800 pb-2"
      >
        <!-- File Info -->
        <div class="truncate max-w-[250px] text-white">
          <div class="truncate">{{ file.name }}</div>
          <div class="text-xs text-blue-400">{{ formatSize(file.size) }}</div>
        </div>

        <!-- Controls -->
        <div class="flex gap-2 items-center text-white">
          <!-- Preview -->
          <button
            @click="previewImage(index)"
            title="Preview"
            class="hover:text-blue-300"
          >
            <img
              src="@/assets/icons/eye.svg"
              alt="Preview"
              class="w-5 h-5 invert"
            />
          </button>

          <!-- Replace -->
          <button
            @click="triggerReplace(index)"
            title="Replace"
            class="hover:text-blue-300"
          >
            <img
              src="@/assets/icons/replace.svg"
              alt="Replace"
              class="w-5 h-5 invert"
            />
          </button>

          <!-- Delete -->
          <button
            @click="removeFile(index)"
            title="Delete"
            class="hover:text-red-400"
          >
            <img
              src="@/assets/icons/delete.svg"
              alt="Delete"
              class="w-5 h-5 invert"
            />
          </button>
        </div>
      </li>
    </ul>

    <!-- Hidden input for replacing -->
    <input
      ref="replaceInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onReplaceSelected"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const files = ref([]);
const isDragging = ref(false);
const replaceIndex = ref(null);
const replaceInput = ref(null);

function triggerFileSelect() {
  document.getElementById("fileInput").click();
}

function onFilesSelected(event) {
  handleFiles(event.target.files);
}

function handleDrop(event) {
  isDragging.value = false;
  handleFiles(event.dataTransfer.files);
}

function handleFiles(fileList) {
  for (const file of fileList) {
    if (file.type.startsWith("image/")) {
      files.value.push(file);
    }
  }
}

function formatSize(bytes) {
  if (typeof bytes !== "number") return "0 B";
  if (bytes > 1048576) return (bytes / 1048576).toFixed(2) + " MB";
  if (bytes > 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

function previewImage(index) {
  const file = files.value[index];
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
}

function removeFile(index) {
  files.value.splice(index, 1);
}

function triggerReplace(index) {
  replaceIndex.value = index;
  replaceInput.value.click();
}

function onReplaceSelected(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    files.value[replaceIndex.value] = file;
  }
  replaceIndex.value = null;
  replaceInput.value.value = "";
}
</script>
