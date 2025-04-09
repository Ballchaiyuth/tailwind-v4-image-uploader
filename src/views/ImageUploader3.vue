<template>
  <div
    class="min-h-without-header flex flex-col items-center justify-center text-purple-400 p-4"
  >
    <h1 class="text-3xl font-bold mb-4">Image Uploader 3</h1>
    <p class="mb-6 text-purple-300">
      A full-featured uploader with modal preview, zoom, navigation,
      drag-and-drop, and image management.
    </p>

    <!-- Alerts -->
    <div v-if="alertMessages.length" class="mb-4 w-full max-w-2xl space-y-2">
      <div
        v-for="alert in alertMessages"
        :key="alert.id"
        class="bg-yellow-100 text-yellow-800 px-4 py-2 border border-yellow-300 rounded-sm text-sm shadow-sm"
      >
        {{ alert.message }}
      </div>
    </div>

    <!-- Config Inputs -->
    <div class="flex gap-4 items-center mb-4 pr-4">
      <!-- Max Size -->
      <label class="text-sm flex items-center gap-1">
        Max Size (KB):
        <div
          class="flex h-[40px] items-center border border-gray-600 rounded-md bg-gray-800 focus-within:ring-2 focus-within:ring-purple-500"
        >
          <input
            v-model.number="maxSizeKB"
            type="text"
            class="w-24 px-2 py-1 text-purple-200 bg-transparent outline-none"
          />
          <div class="flex flex-col">
            <button
              @click="maxSizeKB++"
              class="text-xs px-1 py-0.5 hover:bg-gray-700 text-purple-300 rounded-tr-md"
            >
              ▲
            </button>
            <button
              @click="maxSizeKB = Math.max(0, maxSizeKB - 1)"
              class="text-xs px-1 py-0.5 hover:bg-gray-700 text-purple-300 rounded-br-md"
            >
              ▼
            </button>
          </div>
        </div>
      </label>

      <!-- Ratio -->
      <label class="text-sm">
        Ratio (e.g. 16:9):
        <input
          v-model="ratioText"
          type="text"
          class="w-24 h-[40px] px-2 py-1 rounded-md bg-gray-800 text-purple-200 border border-gray-600 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </label>
    </div>

    <!-- Upload Box -->
    <div
      class="w-full max-w-2xl p-6 rounded-xl border border-purple-400 bg-white/10 backdrop-blur-md text-white shadow-md transition"
      @dragover.prevent
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'bg-purple-400/10': isDragging }"
    >
      <p class="text-center text-sm text-purple-400 mb-4">
        Drag & Drop images into the box or use the button below:
      </p>

      <!-- Drag-and-drop zone -->
      <div
        class="border-2 border-dashed border-purple-400 rounded-md p-6 flex flex-col items-center justify-center space-y-4 hover:bg-purple-200/10 transition cursor-pointer"
        @click="fileInput.click()"
      >
        <img
          src="@/assets/icons/icon-upload.svg"
          alt="Upload Icon"
          class="h-10 w-10 opacity-80"
        />
        <span class="text-sm text-purple-400">
          Click to upload or drop files here
        </span>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/png"
        multiple
        class="hidden"
        @change="onFilesSelected"
      />

      <input
        ref="replaceInput"
        type="file"
        accept="image/png"
        class="hidden"
        @change="onReplaceSelected"
      />

      <div
        v-if="images.length"
        class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6"
      >
        <div
          v-for="(img, i) in images"
          :key="i"
          class="relative group border rounded-md shadow-xs hover:shadow-lg overflow-hidden"
        >
          <img
            :src="img.url"
            :alt="img.name"
            class="object-cover w-full h-40 cursor-pointer"
            @click="openModal(i)"
          />

          <!-- Controls Overlay -->
          <div
            class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
          >
            <div class="flex gap-4">
              <!-- Preview -->
              <button
                @click.stop="openModal(i)"
                title="Preview"
                class="rounded-full p-1 bg-white hover:bg-white/80 transition"
              >
                <img
                  src="@/assets/icons/eye.svg"
                  alt="Preview"
                  class="w-5 h-5"
                />
              </button>

              <!-- Replace -->
              <button
                @click.stop="triggerReplace(i)"
                title="Replace"
                class="rounded-full p-1 bg-white hover:bg-white/80 transition"
              >
                <img
                  src="@/assets/icons/replace.svg"
                  alt="Replace"
                  class="w-5 h-5"
                />
              </button>

              <!-- Delete -->
              <button
                @click.stop="removeImage(i)"
                title="Delete"
                class="rounded-full p-1 bg-white hover:bg-white/80 transition"
              >
                <img
                  src="@/assets/icons/delete.svg"
                  alt="Delete"
                  class="w-5 h-5"
                />
              </button>
            </div>
          </div>

          <div class="text-[12px] text-center p-2 text-gray-400">
            <p class="truncate">{{ img.name }}</p>
            <p>{{ formatSize(img.size) }}</p>
            <p v-if="img.invalidRatio" class="text-red-400 text-xs mt-1">
              Invalid image ratio
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Preview -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <!-- Inner white modal box -->
      <div
        class="relative bg-white rounded-xl p-4 w-[90vw] max-w-4xl h-[80vh] mx-auto flex flex-col items-center"
      >
        <!-- Image Preview Area -->
        <div
          class="flex-1 w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing relative border-[3px] border-gray-300 rounded-md"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
        >
          <img
            :src="currentImage.url"
            :alt="currentImage.name"
            class="h-full w-full object-contain transition-transform"
            :style="zoomedStyle"
            draggable="false"
            @wheel="onWheelZoom"
          />

          <!-- Navigation Buttons Centered Vertically on Sides -->
          <button
            @click.stop="prevImage"
            class="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-400/60 hover:bg-purple-600/60 text-white px-3 py-2 rounded-full shadow-md z-10"
          >
            ←
          </button>
          <button
            @click.stop="nextImage"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-400/60 hover:bg-purple-600/60 text-white px-3 py-2 rounded-full shadow-md z-10"
          >
            →
          </button>
        </div>

        <!-- Footer Section -->
        <div
          class="mt-4 flex flex-col sm:flex-row sm:justify-between items-center gap-3 text-sm text-gray-600 px-4 w-full"
        >
          <!-- Left: File Info -->
          <div class="text-center sm:text-left w-full sm:w-auto">
            <p class="truncate max-w-xs">
              <strong>{{ currentImage.name }}</strong>
            </p>
            <p>{{ formatSize(currentImage.size) }}</p>
          </div>

          <!-- Right: Zoom + Controls -->
          <div class="flex gap-2 flex-wrap justify-center">
            <button
              @click="zoomIn"
              class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-xs"
            >
              +
            </button>
            <button
              @click="zoomOut"
              class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-xs"
            >
              −
            </button>
            <button
              @click="resetZoom"
              class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-xs"
            >
              100%
            </button>
            <a
              :href="currentImage.url"
              target="_blank"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xs"
            >
              Open Image in New Tab</a
            >
            <button
              @click="closeModal"
              class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const fileInput = ref(null);
const replaceInput = ref(null);
const replaceIndex = ref(null);

const images = ref([]);
const isDragging = ref(false);
const alertMessages = ref([]);

const showModal = ref(false);
const currentIndex = ref(null);

const zoom = ref(1);
const isDraggingImage = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const dragOffset = ref({ x: 0, y: 0 });

const maxSizeKB = ref(500);
const ratioText = ref("16:9");

const currentImage = computed(() => images.value[currentIndex.value] || {});
const zoomedStyle = computed(() => ({
  transform: `scale(${zoom.value}) translate(${dragOffset.value.x}px, ${dragOffset.value.y}px)`,
  transition: isDraggingImage.value ? "none" : "transform 0.3s",
}));

function showAlert(message) {
  const id = Date.now() + Math.random();
  alertMessages.value.push({ id, message });
  setTimeout(() => {
    alertMessages.value = alertMessages.value.filter((a) => a.id !== id);
  }, 5000);
}

function onFilesSelected(event) {
  const files = Array.from(event.target.files);
  handleFiles(files);
  fileInput.value.value = "";
}

function handleDrop(event) {
  const files = event.dataTransfer.files;
  handleFiles(files);
}

function parseRatio(text) {
  const [w, h] = text.split(":").map(Number);
  return h ? w / h : 16 / 9;
}

function handleFiles(fileList) {
  const existingNames = new Set(images.value.map((img) => img.name));
  const expectedRatio = parseRatio(ratioText.value);
  const loadPromises = [];

  for (const file of fileList) {
    if (!file.type.startsWith("image/")) continue;

    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB.value) {
      showAlert(
        `File "${file.name}" is too large. Max allowed is ${maxSizeKB.value}KB.`,
      );
      continue;
    }

    if (existingNames.has(file.name)) {
      showAlert(`File name "${file.name}" already exists.`);
      continue;
    }

    const url = URL.createObjectURL(file);

    const promise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        const isValidRatio = Math.abs(ratio - expectedRatio) < 0.1;

        resolve({
          name: file.name,
          size: file.size,
          url,
          objectUrl: url,
          invalidRatio: !isValidRatio,
        });
      };
      img.onerror = () => {
        showAlert(`Failed to load image "${file.name}".`);
        resolve(null);
      };
      img.src = url;
    });

    loadPromises.push(promise);
  }

  Promise.all(loadPromises).then((results) => {
    for (const img of results) {
      if (img) images.value.push(img);
    }
  });
}

function removeImage(index) {
  const removed = images.value.splice(index, 1)[0];
  URL.revokeObjectURL(removed?.objectUrl);
  if (index === currentIndex.value) closeModal();
}

function triggerReplace(index) {
  replaceIndex.value = index;
  replaceInput.value?.click();
}

function onReplaceSelected(event) {
  const file = event.target.files[0];
  const expectedRatio = parseRatio(ratioText.value);
  const existingNames = new Set(
    images.value.map((img, idx) => idx !== replaceIndex.value && img.name),
  );

  if (file && file.type.startsWith("image/") && replaceIndex.value !== null) {
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB.value) {
      showAlert(
        `File "${file.name}" is too large. Max allowed is ${maxSizeKB.value}KB.`,
      );
      resetReplaceInput();
      return;
    }

    if (existingNames.has(file.name)) {
      showAlert(`File name "${file.name}" already exists.`);
      resetReplaceInput();
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const ratio = img.width / img.height;
      const isValidRatio = Math.abs(ratio - expectedRatio) < 0.1;

      const old = images.value[replaceIndex.value];
      URL.revokeObjectURL(old?.objectUrl);

      images.value[replaceIndex.value] = {
        name: file.name,
        size: file.size,
        url,
        objectUrl: url,
        invalidRatio: !isValidRatio,
      };

      resetReplaceInput();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      showAlert(`Failed to load image "${file.name}".`);
      resetReplaceInput();
    };

    img.src = url;
  } else {
    resetReplaceInput();
  }
}

function resetReplaceInput() {
  replaceInput.value.value = "";
  replaceIndex.value = null;
}

function formatSize(bytes) {
  if (bytes > 1048576) return (bytes / 1048576).toFixed(2) + " MB";
  if (bytes > 1024) return (bytes / 1024).toFixed(1) + " KB";
  return `${bytes} B`;
}

function openModal(index) {
  currentIndex.value = index;
  resetZoom();
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  resetZoom();
}

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.2;

function zoomIn() {
  zoom.value = Math.min(zoom.value + ZOOM_STEP, ZOOM_MAX);
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - ZOOM_STEP, ZOOM_MIN);
}

function resetZoom() {
  zoom.value = 1;
  dragOffset.value = { x: 0, y: 0 };
}

function startDrag(e) {
  if (zoom.value <= 1) return;
  isDraggingImage.value = true;
  dragStart.value = { x: e.clientX, y: e.clientY };
}

function onDrag(e) {
  if (!isDraggingImage.value) return;
  const dx = e.clientX - dragStart.value.x;
  const dy = e.clientY - dragStart.value.y;
  dragOffset.value.x += dx;
  dragOffset.value.y += dy;
  dragStart.value = { x: e.clientX, y: e.clientY };
}

function endDrag() {
  isDraggingImage.value = false;
}

function onWheelZoom(e) {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

function prevImage() {
  if (images.value.length < 2) return;
  currentIndex.value =
    (currentIndex.value - 1 + images.value.length) % images.value.length;
  resetZoom();
}

function nextImage() {
  if (images.value.length < 2) return;
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
  resetZoom();
}

function handleKeyDown(e) {
  if (!showModal.value) return;
  if (e.key === "Escape") {
    closeModal();
  } else if (e.key === "ArrowLeft") {
    prevImage();
  } else if (e.key === "ArrowRight") {
    nextImage();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
