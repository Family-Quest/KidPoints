<template>
  <div class="max-w-3xl mx-auto mt-16 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-3xl font-bold text-purple-600 text-center">
      {{ $t('about.title') }}
    </h1>

    <p class="text-gray-700 text-lg leading-relaxed">
      {{ $t('about.description') }}
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
      <div class="bg-purple-100 p-4 rounded-lg">
        <h2 class="text-xl font-semibold text-purple-700">
          {{ $t('about.missionTitle') }}
        </h2>
        <p class="text-gray-700 mt-2">
          {{ $t('about.missionContent') }}
        </p>
      </div>

      <div class="bg-yellow-100 p-4 rounded-lg">
        <h2 class="text-xl font-semibold text-yellow-700">
          {{ $t('about.featuresTitle') }}
        </h2>
        <ul class="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>{{ $t('about.features.chores') }}</li>
          <li>{{ $t('about.features.rewards') }}</li>
          <li>{{ $t('about.features.levels') }}</li>
          <li>{{ $t('about.features.family') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'parent' })
</script>
