<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

// Initialize auth on app mount
onMounted(() => {
  authStore.initializeAuth();
});
</script>

<template>
  <router-view />
</template>
