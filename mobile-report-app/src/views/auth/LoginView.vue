<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Mobile Report App - Field Operations Management
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" :value="form.rememberMe" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.username }"
              placeholder="Username"
              @blur="validateField('username')"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">
              {{ errors.username }}
            </p>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Password"
              @blur="validateField('password')"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div v-if="authError" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ authError }}</h3>
            </div>
          </div>
        </div>

        <!-- Demo credentials info -->
        <div class="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 class="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</h4>
          <div class="space-y-1 text-sm text-blue-800">
            <p><span class="font-medium">Admin:</span> admin / Admin123!</p>
            <p><span class="font-medium">Manager:</span> manager / Manager123!</p>
            <p><span class="font-medium">Worker:</span> worker / Worker123!</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginCredentials } from '@/types/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Form data
const form = ref<LoginCredentials>({
  username: '',
  password: '',
  rememberMe: false,
});

// Form errors
const errors = ref<Partial<Record<keyof LoginCredentials, string>>>({});

// Loading state
const isLoading = ref(false);

// Auth error from store
const authError = computed(() => authStore.error);

// Form validation
const isFormValid = computed(() => {
  return (
    form.value.username.length > 0 &&
    form.value.password.length > 0 &&
    Object.keys(errors.value).length === 0
  );
});

// Validate individual field
const validateField = (field: keyof LoginCredentials) => {
  delete errors.value[field];

  switch (field) {
    case 'username':
      if (!form.value.username) {
        errors.value.username = 'Username is required';
      } else if (form.value.username.length < 3) {
        errors.value.username = 'Username must be at least 3 characters';
      }
      break;
    case 'password':
      if (!form.value.password) {
        errors.value.password = 'Password is required';
      } else if (form.value.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters';
      }
      break;
  }
};

// Validate all fields
const validateForm = (): boolean => {
  errors.value = {};

  validateField('username');
  validateField('password');

  return Object.keys(errors.value).length === 0;
};

// Handle login
const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  authStore.clearError();

  try {
    await authStore.login(form.value);

    // Setup token refresh
    authStore.setupTokenRefresh();

    // Redirect to intended page or dashboard
    const redirect = (route.query.redirect as string) || '/dashboard';
    router.push(redirect);
  } catch (error) {
    console.error('Login failed:', error);
    // Error is handled by the store
  } finally {
    isLoading.value = false;
  }
};
</script>
