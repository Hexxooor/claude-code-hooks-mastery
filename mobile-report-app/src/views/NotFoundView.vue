<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-gray-400">404</h1>
          <h2 class="mt-4 text-xl font-bold text-gray-900">Page Not Found</h2>
          <p class="mt-2 text-sm text-gray-600">The page you're looking for doesn't exist.</p>
          <router-link
            to="/"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
