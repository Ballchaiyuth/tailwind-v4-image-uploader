<template>
  <div
    class="w-full p-4 rounded-xl border border-gray-300 bg-white/10 backdrop-blur-md text-gray-800 shadow-md transition"
    @dragover.prevent
    @dragenter.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    :class="{ 'bg-blue-100/30 border-blue-400': isDragging }"
  >
    <!-- Dropzone -->
    <div
      class="border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center justify-center space-y-2 hover:bg-gray-100 transition cursor-pointer"
      @click="fileInput.click()"
    >
      <img
        src="@/assets/icons/icon-upload.svg"
        alt="Upload Icon"
        class="h-8 w-8 opacity-60"
      />
      <p class="text-sm text-gray-500">Upload</p>
    </div>

    <!-- Inputs -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="onFilesSelected"
    />
    <input
      ref="replaceInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onReplaceSelected"
    />

    <!-- Previews -->
    <div
      v-if="images.length"
      class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6"
    >
      <div
        v-for="(img, i) in images"
        :key="i"
        class="flex flex-col items-center gap-1 transition-transform duration-200 cursor-move"
        draggable="true"
        @dragstart="onDragStart(i)"
        @dragover.prevent
        @drop="onDrop(i)"
      >
        <ImagePreview
          :url="img.url"
          @view="viewImage(img.url)"
          @replace="() => triggerReplace(i)"
          @remove="() => removeImage(i)"
        />
        <div
          class="text-[12px] text-center text-gray-500 w-full max-w-full px-1"
        >
          <p
            class="truncate w-full max-w-full overflow-hidden whitespace-nowrap"
          >
            {{ img.name }}
          </p>
          <p>{{ formatSize(img.size) }}</p>
        </div>
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
const replaceIndex = ref(null);
const isDragging = ref(false);
const images = ref([]);

watch(
  () => props.clear,
  () => {
    images.value = [];
    emit("update", []);
  },
);

function onFilesSelected(event) {
  handleFiles(event.target.files);
  fileInput.value.value = "";
}

function handleDrop(event) {
  handleFiles(event.dataTransfer.files);
  isDragging.value = false;
}

function handleFiles(fileList) {
  for (const file of fileList) {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      images.value.push({ name: file.name, size: file.size, url, file });
    }
  }
  emit("update", images.value);
}

function onReplaceSelected(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith("image/") || replaceIndex.value === null)
    return;

  const url = URL.createObjectURL(file);
  images.value.splice(replaceIndex.value, 1, {
    name: file.name,
    size: file.size,
    url,
    file,
  });
  emit("update", images.value);

  replaceInput.value.value = "";
  replaceIndex.value = null;
}

function viewImage(url) {
  window.open(url, "_blank");
}

function triggerReplace(index) {
  replaceIndex.value = index;
  replaceInput.value?.click();
}

function removeImage(index) {
  images.value.splice(index, 1);
  emit("update", images.value);
}

function formatSize(bytes) {
  if (bytes > 1048576) return (bytes / 1048576).toFixed(2) + " MB";
  if (bytes > 1024) return (bytes / 1024).toFixed(1) + " KB";
  return `${bytes} B`;
}

const draggingIndex = ref(null);

function onDragStart(index) {
  draggingIndex.value = index;
}

function onDrop(index) {
  if (draggingIndex.value === null || draggingIndex.value === index) return;

  const movedItem = images.value.splice(draggingIndex.value, 1)[0];
  images.value.splice(index, 0, movedItem);
  draggingIndex.value = null;

  emit("update", images.value);
}
</script>
