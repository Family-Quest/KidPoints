<template>
  <div class="bg-white shadow rounded-2xl p-6">
    <!-- Titre section -->
    <h2 class="text-xl font-bold text-purple-700 mb-6">
      {{ $t('parent.children') }}
    </h2>

    <!-- Chargement -->
    <div
      v-if="isLoading"
      class="text-gray-500 text-center py-10"
    >
      {{ $t('dashboard.loading') }}
    </div>

    <!-- Liste des cartes -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ChildUpdateCard
        v-for="child in childrens"
        :key="child.id"
        :child="child"
      />

      <!-- Bouton d'ajout -->
      <button
        class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-xl transition-colors text-gray-500 hover:text-purple-600 text-sm font-medium focus:outline-none"
        :disabled="isPending"
        @click="onAddChild"
      >
        <span class="text-3xl font-bold mb-1">+</span>
        <span>{{ $t('onboarding.addChild') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { useAddChildMutation, useChildrenQuery } = useChild()
const user = useSupabaseUser()

const { data: childrens, isLoading } = useChildrenQuery(user)
const { mutate: addChild, isPending } = useAddChildMutation(user)

const onAddChild = () => {
  if (!user.value?.id) return
  addChild({
    user_id: user.value.id,
  })
}
</script>
