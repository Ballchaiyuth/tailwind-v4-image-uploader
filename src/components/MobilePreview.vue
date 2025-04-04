<template>
  <div class="w-1/3 flex flex-col items-center">
    <h3 class="text-base font-semibold mb-4">Preview</h3>

    <!-- Phone Frame -->
    <div
      class="w-[320px] h-[640px] border-[12px] border-black rounded-[2rem] bg-white shadow-inner flex flex-col overflow-hidden relative"
    >
      <!-- Status Bar -->
      <div
        class="h-6 bg-black text-white text-xs flex justify-between items-center px-3"
      >
        <span>9:41</span>
        <div class="flex gap-1">
          <div class="w-4 h-2 bg-white rounded-xs"></div>
          <div class="w-3 h-2 bg-white rounded-xs"></div>
          <div class="w-2 h-2 bg-white rounded-xs"></div>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="bg-gray-800 text-white text-sm h-10 flex items-center px-4">
        <span class="mr-2">←</span>
        <span class="font-semibold">Auto Guru</span>
      </div>

      <!-- Content Area -->
      <div class="flex-1 p-4 flex flex-col gap-2 bg-gray-50">
        <!-- Image Carousel -->
        <div class="relative w-full h-40 rounded-xs overflow-hidden">
          <div
            class="w-full h-full flex transition-transform duration-500 ease-in-out"
            :style="`transform: translateX(-${currentIndex * 100}%);`"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          >
            <div
              v-for="(img, i) in imageList"
              :key="i"
              class="w-full h-full shrink-0"
            >
              <img
                :src="img.url || img"
                class="w-full h-full object-cover"
                :alt="img.name || `Image ${i + 1}`"
              />
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button
            v-if="imageList.length > 1"
            @click="prev"
            class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black px-2 py-1 rounded-full shadow-sm"
          >
            ←
          </button>
          <button
            v-if="imageList.length > 1"
            @click="next"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black px-2 py-1 rounded-full shadow-sm"
          >
            →
          </button>

          <!-- Dots -->
          <div
            v-if="imageList.length > 1"
            class="absolute bottom-1 left-0 right-0 flex justify-center gap-1"
          >
            <span
              v-for="(img, i) in imageList"
              :key="i"
              class="w-2 h-2 rounded-full"
              :class="i === currentIndex ? 'bg-black' : 'bg-gray-400'"
            ></span>
          </div>
        </div>

        <!-- Title -->
        <h4 class="text-sm font-semibold mt-1">
          {{ data?.title || "No title provided" }}
        </h4>

        <!-- Like & Share Row -->
        <div class="bg-gray-200 rounded-md py-2 px-4">
          <div class="flex justify-between max-w-full">
            <div class="w-1/3 flex justify-center items-center gap-1 text-sm">
              <img src="@/assets/icons/like.svg" alt="Like" class="w-5 h-5" />
              <span>{{ data?.likeCount || 0 }}</span>
            </div>
            <div class="w-1/3"></div>
            <div class="w-1/3 flex justify-center items-center gap-1 text-sm">
              <img src="@/assets/icons/share.svg" alt="Share" class="w-5 h-5" />
              <span>{{ data?.shareCount || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-xs text-gray-500 whitespace-pre-wrap">
          {{ data?.description || "No description provided" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import placeholder from "@/assets/images/go-placeholder.png";

const props = defineProps({
  data: Object,
});

const currentIndex = ref(0);
let timer;

const imageList = computed(() => {
  return props.data?.images?.length
    ? props.data.images
    : [props.data?.cover || placeholder];
});

function next() {
  currentIndex.value = (currentIndex.value + 1) % imageList.value.length;
}

function prev() {
  currentIndex.value =
    (currentIndex.value - 1 + imageList.value.length) % imageList.value.length;
}

function autoSlide() {
  timer = setInterval(() => {
    next();
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(timer);
}

let touchStartX = 0;

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  stopAutoSlide();
}

function onTouchMove(e) {
  const deltaX = e.touches[0].clientX - touchStartX;
  if (Math.abs(deltaX) > 50) {
    deltaX > 0 ? prev() : next();
    touchStartX = e.touches[0].clientX;
  }
}

function onTouchEnd() {
  autoSlide();
}

onMounted(autoSlide);
onBeforeUnmount(stopAutoSlide);
</script>
