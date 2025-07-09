<!-- components/children/ChildrenList.vue -->
<template>
  <section>
    <h2 class="text-2xl font-semibold mb-4 border-b-2 border-purple-400 pb-2">
      👦👧 {{ $t('child.list.title') }}
    </h2>

    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="animate-pulse bg-gray-100 rounded-xl h-40"
      />
    </div>

    <div
      v-else-if="children?.length === 0"
      class="text-gray-400 italic text-center py-8"
    >
      {{ $t('child.list.no_children_found') }}
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ChildCard
        v-for="child in children"
        :key="child.id"
        :child="child"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const { useChildrenQuery } = useChild()
const user = useSupabaseUser()

const { data: children, isLoading } = useChildrenQuery(user)
</script>
