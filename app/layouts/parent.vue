<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <AppHeader />

    <main class="flex-1 p-6 max-w-5xl mx-auto w-full">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
