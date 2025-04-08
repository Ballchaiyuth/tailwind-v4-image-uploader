<template>
  <div
    class="min-h-without-header w-full bg-gray-900 text-white flex flex-col items-center justify-center text-center px-4 py-10"
  >
    <img
      alt="Upload illustration"
      src="@/assets/icons/upload-image.svg"
      class="w-40 sm:w-52 mb-6 drop-shadow-md"
    />

    <h1 class="text-3xl sm:text-4xl font-bold text-white mb-4">
      Welcome to the Vue 3 + Tailwind Image Uploader Showcase
    </h1>

    <p class="text-gray-300 max-w-xl mb-8">
      This is a simple demo built with Vite, Vue 3, and Tailwind CSS v4. It
      showcases three different image uploader interfaces — featuring
      drag-and-drop support, previews, and other basic frontend-only features.
    </p>

    <router-link
      to="/upload1"
      class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-xs transition"
    >
      Start Exploring Uploaders
    </router-link>
  </div>
</template>
