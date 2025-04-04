<template>
  <div
    class="relative group border rounded-md shadow-xs hover:shadow-lg overflow-hidden w-full"
  >
    <!-- Dark overlay during upload -->
    <div
      v-if="showProgress"
      class="absolute inset-0 bg-black/30 z-10 flex items-center justify-center"
    >
      <div class="text-white text-xs flex flex-col items-center gap-2">
        <div
          class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></div>
        <span>Uploading...</span>
      </div>
    </div>

    <img
      :src="url"
      class="object-cover w-full h-32 cursor-pointer"
      @click="$emit('view')"
    />

    <!-- Upload Progress Bar -->
    <div
      v-if="showProgress"
      class="absolute bottom-0 left-0 w-full h-1 bg-gray-200 z-20"
    >
      <div
        class="h-full bg-yellow-400 transition-all duration-300"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <!-- Action Buttons -->
    <div
      class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-30"
    >
      <div class="flex gap-2">
        <button
          @click.stop="$emit('view')"
          title="Preview"
          class="p-1 bg-white rounded-full hover:bg-white/80"
        >
          <img src="@/assets/icons/eye.svg" alt="View" class="w-5 h-5" />
        </button>
        <button
          @click.stop="triggerReplace"
          title="Replace"
          class="p-1 bg-white rounded-full hover:bg-white/80"
        >
          <img src="@/assets/icons/replace.svg" alt="Replace" class="w-5 h-5" />
        </button>
        <button
          @click.stop="$emit('remove')"
          title="Delete"
          class="p-1 bg-white rounded-full hover:bg-white/80"
        >
          <img src="@/assets/icons/delete.svg" alt="Delete" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  url: String,
});

const emit = defineEmits(["view", "replace", "remove"]);

const progress = ref(0);
const showProgress = ref(false);

function startUpload() {
  showProgress.value = true;
  progress.value = 0;

  const interval = setInterval(() => {
    if (progress.value >= 100) {
      showProgress.value = false;
      clearInterval(interval);
    } else {
      progress.value += 10;
    }
  }, 150);
}

onMounted(() => {
  startUpload();
});

defineExpose({ startUpload });

function triggerReplace() {
  emit("replace");
}
</script>
