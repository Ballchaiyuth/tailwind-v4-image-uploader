<template>
  <div class="flex flex-col min-h-screen w-full">
    <!-- Navigation Header -->
    <header class="bg-gray-800 text-white shadow">
      <nav
        class="max-w-5xl mx-auto px-4 py-4 flex justify-center gap-4 text-base"
      >
        <RouterLink
          to="/"
          class="px-3 py-1 rounded font-medium transition hover:bg-gray-700"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/upload1"
          class="px-3 py-1 rounded font-medium transition hover:bg-gray-700"
        >
          Uploader 1
        </RouterLink>
        <RouterLink
          to="/upload2"
          class="px-3 py-1 rounded font-medium transition hover:bg-gray-700"
        >
          Uploader 2
        </RouterLink>
        <RouterLink
          to="/upload3"
          class="px-3 py-1 rounded font-medium transition hover:bg-gray-700"
        >
          Uploader 3
        </RouterLink>
        <RouterLink
          to="/upload4"
          class="px-3 py-1 rounded font-medium transition hover:bg-gray-700"
        >
          Uploader 4
        </RouterLink>
      </nav>
    </header>

    <!-- Routed Content (fills remaining space) -->
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>
