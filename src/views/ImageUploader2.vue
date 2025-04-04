<template>
  <div
    class="min-h-without-header flex flex-col items-center justify-center text-green-400 p-4"
  >
    <h1 class="text-3xl font-bold mb-4">Image Uploader 2</h1>
    <p class="mb-6 text-green-300 text-sm">
      A styled uploader inspired by
      <a
        href="https://www.creative-tim.com/twcomponents/component/file-upload-with-drop-on-and-preview"
        target="_blank"
        class="underline hover:text-green-200 transition"
      >
        Creative Tim’s example
      </a>
      — includes drag-and-drop, previews, file details, and removal.
    </p>

    <!-- Dropzone -->
    <div
      class="w-full max-w-2xl border-2 border-dashed border-green-400 rounded-xl p-6 bg-white/10 backdrop-blur-md text-white transition relative"
      @dragover.prevent
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'bg-green-400/10': isDragging }"
    >
      <p class="text-center text-green-200 mb-3">Drag & drop images here or</p>
      <div class="flex justify-center">
        <button
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          @click="triggerFileSelect"
        >
          Browse Files
        </button>
      </div>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/*"
        multiple
        @change="onFilesSelected"
      />
    </div>

    <!-- Previews -->
    <div
      v-if="images.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 max-w-6xl w-full"
    >
      <div
        v-for="(img, index) in images"
        :key="index"
        class="relative group overflow-hidden rounded-md shadow-xs aspect-2/1"
      >
        <img
          :src="img.url"
          :alt="img.name"
          class="w-full h-full object-cover rounded-md"
        />

        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2 text-sm"
        >
          <!-- Top row: File name -->
          <div
            class="text-left text-white text-sm font-medium leading-snug overflow-hidden"
            style="
              line-clamp: 3;
              -webkit-line-clamp: 3;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            "
          >
            {{ img.name }}
          </div>

          <!-- Bottom row: File size + Delete -->
          <div class="flex items-end justify-between mt-auto text-xs">
            <span class="text-white">{{ formatSize(img.size) }}</span>
            <button
              @click="removeImage(index)"
              title="Remove"
              class="rounded-full p-1 bg-white/50 hover:bg-white/20 transition"
            >
              <img
                src="@/assets/icons/delete.svg"
                alt="Delete"
                class="w-5 h-5 text-white"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const fileInput = ref(null);
const isDragging = ref(false);
const images = ref([]);

function triggerFileSelect() {
  fileInput.value.click();
}

function onFilesSelected(event) {
  const files = event.target.files;
  handleFiles(files);
}

function handleDrop(event) {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  handleFiles(files);
}

function handleFiles(fileList) {
  for (const file of fileList) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        images.value.push({
          name: file.name,
          size: file.size,
          url: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }
}

function removeImage(index) {
  images.value.splice(index, 1);
}

function formatSize(bytes) {
  if (bytes > 1048576) return (bytes / 1048576).toFixed(2) + " MB";
  if (bytes > 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}
</script>
