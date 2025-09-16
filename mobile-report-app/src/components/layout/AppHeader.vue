<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-indigo-600">Mobile Report</h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/dashboard"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.name === 'dashboard' }"
            >
              Dashboard
            </router-link>
            <router-link
              to="/orders"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.name === 'orders' }"
            >
              Orders
            </router-link>
            <router-link
              to="/time-tracking"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.name === 'time-tracking' }"
            >
              Time Tracking
            </router-link>
            <router-link
              to="/reports"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.name === 'reports' }"
            >
              Reports
            </router-link>
            <router-link
              v-if="authStore.hasRole('admin')"
              to="/users"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.name === 'users' }"
            >
              Users
            </router-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button
                id="user-menu-button"
                type="button"
                class="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-expanded="false"
                aria-haspopup="true"
                @click="showDropdown = !showDropdown"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {{ authStore.user?.firstName?.charAt(0)
                    }}{{ authStore.user?.lastName?.charAt(0) }}
                  </span>
                </div>
              </button>
            </div>

            <!-- Dropdown menu -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showDropdown"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  <div class="font-medium">{{ authStore.fullName }}</div>
                  <div class="text-gray-500">{{ authStore.userRole }}</div>
                </div>
                <router-link
                  id="user-menu-item-0"
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  @click="showDropdown = false"
                >
                  Your Profile
                </router-link>
                <button
                  id="user-menu-item-2"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  @click="handleLogout"
                >
                  Sign out
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="-mr-2 flex items-center sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="showMobileMenu = !showMobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed -->
            <svg
              class="block h-6 w-6"
              :class="{ hidden: showMobileMenu, block: !showMobileMenu }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Icon when menu is open -->
            <svg
              class="h-6 w-6"
              :class="{ block: showMobileMenu, hidden: !showMobileMenu }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      id="mobile-menu"
      class="sm:hidden"
      :class="{ block: showMobileMenu, hidden: !showMobileMenu }"
    >
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/dashboard"
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'dashboard' }"
          @click="showMobileMenu = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/orders"
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'orders' }"
          @click="showMobileMenu = false"
        >
          Orders
        </router-link>
        <router-link
          to="/time-tracking"
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{
            'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'time-tracking',
          }"
          @click="showMobileMenu = false"
        >
          Time Tracking
        </router-link>
        <router-link
          to="/reports"
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'reports' }"
          @click="showMobileMenu = false"
        >
          Reports
        </router-link>
        <router-link
          v-if="authStore.hasRole('admin')"
          to="/users"
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'users' }"
          @click="showMobileMenu = false"
        >
          Users
        </router-link>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
              </span>
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ authStore.fullName }}</div>
            <div class="text-sm font-medium text-gray-500">{{ authStore.userRole }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <router-link
            to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            Your Profile
          </router-link>
          <button
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click="handleLogout"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const showDropdown = ref(false);
const showMobileMenu = ref(false);

const handleLogout = async () => {
  showDropdown.value = false;
  showMobileMenu.value = false;

  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>
