<template>
  <div>
    <AppHeader />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header with Add User Button -->
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
            <p class="mt-2 text-gray-600">Manage user accounts and permissions</p>
          </div>
          <div class="mt-4 sm:mt-0">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="openCreateModal"
            >
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add User
            </button>
          </div>
        </div>

        <!-- User Statistics -->
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <UsersIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ userStats.total }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ userStats.active }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ShieldCheckIcon class="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Admins</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ userStats.admins }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <CogIcon class="h-6 w-6 text-purple-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Managers</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ userStats.managers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Search users</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search users..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <select
              v-model="roleFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="worker">Worker</option>
            </select>
          </div>
          <div>
            <select
              v-model="statusFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Users Table -->
        <div class="mt-8 flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Login
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in filteredUsers" :key="user.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <div
                              class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center"
                            >
                              <span class="text-sm font-medium text-white">
                                {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                              </span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                              {{ user.firstName }} {{ user.lastName }}
                            </div>
                            <div class="text-sm text-gray-500">{{ user.email }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="getRoleBadgeClass(user.role)"
                        >
                          {{ user.role }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          "
                        >
                          {{ user.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.lastLogin ? formatDate(user.lastLogin) : 'Never' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          class="text-indigo-600 hover:text-indigo-900 mr-3"
                          @click="editUser(user)"
                        >
                          Edit
                        </button>
                        <button
                          class="mr-3"
                          :class="
                            user.isActive
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          "
                          @click="toggleUserStatus(user)"
                        >
                          {{ user.isActive ? 'Deactivate' : 'Activate' }}
                        </button>
                        <button class="text-red-600 hover:text-red-900" @click="deleteUser(user)">
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <UserModal
      v-if="showModal"
      :user="selectedUser"
      :is-edit="isEditMode"
      @close="closeModal"
      @save="handleSaveUser"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete User"
      :message="`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-class="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  PlusIcon,
  UsersIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CogIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';
import AppHeader from '@/components/layout/AppHeader.vue';
import UserModal from '@/components/users/UserModal.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import { userService } from '@/services/crud';
import type { User } from '@/types/auth';

// Reactive state
const users = ref<User[]>([]);
const userStats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  admins: 0,
  managers: 0,
  workers: 0,
});
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref<User | null>(null);
const userToDelete = ref<User | null>(null);
const isEditMode = ref(false);
const loading = ref(false);

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter((user) => user.role === roleFilter.value);
  }

  // Status filter
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active';
    filtered = filtered.filter((user) => user.isActive === isActive);
  }

  return filtered;
});

// Methods
const loadUsers = async () => {
  try {
    loading.value = true;
    users.value = await userService.getAll();
    userStats.value = await userService.getStats();
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  selectedUser.value = null;
  isEditMode.value = false;
  showModal.value = true;
};

const editUser = (user: User) => {
  selectedUser.value = { ...user };
  isEditMode.value = true;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
};

const handleSaveUser = async (userData: Partial<User>) => {
  try {
    if (isEditMode.value && selectedUser.value) {
      await userService.update(selectedUser.value.id, userData);
    } else {
      await userService.create(userData as User);
    }
    await loadUsers();
    closeModal();
  } catch (error) {
    console.error('Failed to save user:', error);
  }
};

const toggleUserStatus = async (user: User) => {
  try {
    await userService.setActiveStatus(user.id, !user.isActive);
    await loadUsers();
  } catch (error) {
    console.error('Failed to toggle user status:', error);
  }
};

const deleteUser = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (userToDelete.value) {
    try {
      await userService.delete(userToDelete.value.id);
      await loadUsers();
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'manager':
      return 'bg-blue-100 text-blue-800';
    case 'worker':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

// Lifecycle
onMounted(loadUsers);
</script>
