<template>
  <div
    v-if="showMockPopup"
    id="mock-alert"
    class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-orange-900 text-white border border-orange-400 px-4 py-3 rounded-lg shadow-lg z-50 w-[90%] max-w-md"
  >
    <div class="flex justify-between items-center mb-2">
      <strong class="text-orange-300">📤 File Order Sent to Backend</strong>
      <button
        @click="showMockPopup = false"
        class="text-orange-200 hover:text-white"
      >
        ✕
      </button>
    </div>
    <pre class="whitespace-pre-wrap text-sm">{{ mockFileList }}</pre>
  </div>
  <div
    class="min-h-without-header flex flex-col items-center justify-center text-orange-400 p-4"
  >
    <h1 class="text-3xl font-bold mb-4 text-orange-300">Image Uploader 5</h1>
    <p class="mb-6 text-sm text-orange-200">
      Use this uploader to test how image order works when selecting multiple
      files.
    </p>

    <!-- Upload Box -->
    <div
      class="w-full max-w-md border-2 border-dashed border-orange-400 rounded-lg p-6 text-center cursor-pointer transition hover:bg-orange-900/20"
      @click="triggerFileSelect"
      @dragover.prevent
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'bg-orange-900/20 border-orange-300': isDragging }"
    >
      <p class="text-orange-300">
        Drag & drop image(s) here, or click to choose
      </p>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        multiple
        class="hidden"
        @change="onFilesSelected"
      />
    </div>

    <!-- Control Buttons -->
    <div
      v-if="files.length"
      class="mt-6 w-full max-w-md text-sm text-orange-300 space-y-4"
    >
      <button
        @click="sendToBackend"
        class="w-full border border-orange-400 px-4 py-1 rounded hover:bg-orange-800 text-orange-200 text-sm"
      >
        Mock Upload (View File Order)
      </button>

      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <label for="sortOption">Sort by:</label>
          <select
            id="sortOption"
            v-model="sortOption"
            class="bg-transparent border border-orange-300 px-2 py-1 rounded"
          >
            <option value="default">Default (as selected)</option>
            <option value="name">File name</option>
            <option value="size">File size</option>
            <option value="date">Last modified</option>
            <option value="manual">Manual (drag to reorder)</option>
          </select>
          <label class="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              v-model="reverseOrder"
              :disabled="sortOption === 'manual'"
            />
            Reverse
          </label>
        </div>
        <button
          @click="
            () => {
              clearAll();
              sortOption.value = 'default';
            }
          "
          class="text-orange-300 hover:text-orange-100 underline"
        >
          Clear All Images
        </button>
      </div>
    </div>

    <!-- File List -->
    <ul
      v-if="files.length"
      class="mt-4 text-sm text-orange-300 space-y-4 w-full max-w-md"
    >
      <li
        v-for="(file, index) in sortedFiles"
        :key="file.previewUrl"
        class="flex items-start gap-4 border-b pb-4 cursor-move transition-transform duration-200 hover:scale-[1.01] hover:bg-orange-900/20 rounded"
        :class="{
          'border-red-400 bg-red-900/10': file.failed,
          'border-orange-800': !file.failed,
        }"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent
        @drop="onDrop(index)"
      >
        <div
          class="shrink-0 w-16 h-16 rounded overflow-hidden border border-orange-300"
        >
          <img
            :src="file.previewUrl"
            alt="Preview"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex-1 space-y-1 text-white">
          <div class="flex justify-between">
            <span class="truncate">{{ file.name }}</span>
          </div>
          <div class="text-xs text-orange-400">{{ formatSize(file.size) }}</div>

          <!-- Failed status message goes here -->
          <div v-if="file.failed" class="text-xs text-red-400">
            ❌ Mock upload failed
          </div>

          <div class="flex gap-2 pt-1">
            <button
              @click="previewImage(index)"
              title="Preview"
              class="hover:text-orange-300"
            >
              <img
                src="@/assets/icons/eye.svg"
                alt="Preview"
                class="w-5 h-5 invert"
              />
            </button>
            <button
              @click="triggerReplace(index)"
              title="Replace"
              class="hover:text-orange-300"
            >
              <img
                src="@/assets/icons/replace.svg"
                alt="Replace"
                class="w-5 h-5 invert"
              />
            </button>
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
        </div>
      </li>
    </ul>

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
import { computed, nextTick, onMounted, ref, watch } from "vue";

const files = ref([]);
const isDragging = ref(false);
const draggingIndex = ref(null);
const replaceIndex = ref(null);
const replaceInput = ref(null);
const sortOption = ref("default");
const reverseOrder = ref(false);
const showMockPopup = ref(false);
const mockFileList = ref("");

onMounted(() => {
  // Clear stored files and previewUrls on initial load
  localStorage.removeItem("uploader_files");
  files.value = [];
});

const sortedFiles = computed(() => {
  if (sortOption.value === "manual") return files.value;
  let list = [...files.value];
  if (sortOption.value === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption.value === "size") {
    list.sort((a, b) => a.size - b.size);
  } else if (sortOption.value === "date") {
    list.sort((a, b) => a.lastModified - b.lastModified);
  }
  return reverseOrder.value ? list.reverse() : list;
});

watch(
  files,
  (val) => {
    localStorage.setItem("uploader_files", JSON.stringify(val));
  },
  { deep: true },
);

function onDragStart(index) {
  if (sortOption.value === "manual") {
    draggingIndex.value = index;
  }
}

function onDrop(index) {
  if (sortOption.value !== "manual" || draggingIndex.value === null) return;
  const draggedItem = files.value.splice(draggingIndex.value, 1)[0];
  files.value.splice(index, 0, draggedItem);
  draggingIndex.value = null;
}

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
      file.previewUrl = URL.createObjectURL(file);
      file.failed = isMockUploadFailed(file);
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
  const file = sortedFiles.value[index];
  window.open(file.previewUrl, "_blank");
}

function removeFile(index) {
  const file = sortedFiles.value[index];
  const originalIndex = files.value.findIndex(
    (f) => f.previewUrl === file.previewUrl,
  );
  if (originalIndex !== -1) {
    URL.revokeObjectURL(files.value[originalIndex].previewUrl);
    files.value.splice(originalIndex, 1);
  }
}

function clearAll() {
  files.value.forEach((file) => URL.revokeObjectURL(file.previewUrl));
  files.value = [];
  localStorage.removeItem("uploader_files");
}

function sendToBackend() {
  const result = sortedFiles.value.map((f) => {
    return f.failed ? `❌ ${f.name} (upload failed)` : `✅ ${f.name}`;
  });
  mockFileList.value = result.join("\n");
  showMockPopup.value = true;
  nextTick(() => {
    const el = document.getElementById("mock-alert");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function triggerReplace(index) {
  replaceIndex.value = index;
  replaceInput.value.click();
}

function onReplaceSelected(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    file.previewUrl = URL.createObjectURL(file);

    file.failed = isMockUploadFailed(file);

    const current = sortedFiles.value[replaceIndex.value];
    const originalIndex = files.value.findIndex(
      (f) => f.previewUrl === current.previewUrl,
    );
    if (originalIndex !== -1) {
      URL.revokeObjectURL(files.value[originalIndex].previewUrl);
      files.value[originalIndex] = file;
    }
  }
  replaceIndex.value = null;
  replaceInput.value.value = "";
}

function isMockUploadFailed(file) {
  return file.name.toLowerCase().includes("fail");
}
</script>
