<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import seedService from '@/services/seed.service';

const authStore = useAuthStore();

// Initialize app on mount
onMounted(async () => {
  // Initialize auth
  authStore.initializeAuth();

  // Seed database if needed (development only)
  if (import.meta.env.DEV) {
    try {
      await seedService.seedAll();
      console.log('Database initialization complete');
    } catch (error) {
      console.error('Failed to seed database:', error);
    }
  }
});
</script>

<template>
  <router-view />
</template>
