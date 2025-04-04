<template>
  <div
    class="px-6 py-4 shadow-2xs flex justify-between items-center transition-colors duration-300"
    :class="
      isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b'
    "
  >
    <h2 class="text-lg font-semibold">
      Content
      <span class="text-sm text-gray-500 ml-2">(In Draft)</span>
    </h2>

    <div class="flex gap-2">
      <button
        type="button"
        class="border border-gray-300 px-4 py-1 rounded-xs hover:bg-gray-100"
        @click="$emit('preview')"
      >
        Preview
      </button>

      <button
        type="button"
        class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-xs"
      >
        Save
      </button>

      <button
        type="button"
        @click="$emit('clear')"
        class="border border-gray-300 px-3 py-1 rounded-xs hover:bg-gray-100"
        title="Clear Form"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isDark: Boolean,
});
defineEmits(["preview", "clear"]);
</script>
