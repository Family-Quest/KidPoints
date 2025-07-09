<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <AppHeader />

    <!-- Centrage vertical sans min-h-screen ici -->
    <div class="flex-grow flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>

    <AppFooter />
  </div>
</template>
