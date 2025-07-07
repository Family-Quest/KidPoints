<template>
  <div class="p-4">
    <form @submit.prevent="handleLogin" class="space-y-4">
      <input v-model="email" placeholder="Email" type="email" class="border p-2 w-full" />
      <input v-model="password" placeholder="Mot de passe" type="password" class="border p-2 w-full" />
      <button class="bg-blue-500 text-white px-4 py-2 rounded">Connexion</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const { login } = useAuth() 

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    navigateTo('/')
  } catch (err) {
    console.error(err)
  }
}
</script>