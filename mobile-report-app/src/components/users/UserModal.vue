<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit User' : 'Create New User' }}
          </h3>
          <button
            class="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="closeModal"
          >
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username *
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.username }"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Email * </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password (only for new users) -->
          <div v-if="!isEdit">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.password }"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p class="mt-1 text-sm text-gray-500">
              Minimum 8 characters with at least one uppercase, one lowercase, and one number
            </p>
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700"> Role * </label>
            <select
              id="role"
              v-model="form.role"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.role }"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="worker">Worker</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              id="isActive"
              v-model="form.isActive"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-900"> Active User </label>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import type { User } from '@/types/auth';
import { userService } from '@/services/crud';

interface Props {
  user?: User | null;
  isEdit?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', userData: Partial<User>): void;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  isEdit: false,
});

const emit = defineEmits<Emits>();

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: '' as 'admin' | 'manager' | 'worker' | '',
  isActive: true,
});

const errors = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: '',
});

const loading = ref(false);

// Define utility functions first
const clearErrors = () => {
  errors.firstName = '';
  errors.lastName = '';
  errors.username = '';
  errors.email = '';
  errors.password = '';
  errors.role = '';
};

const resetForm = () => {
  form.firstName = '';
  form.lastName = '';
  form.username = '';
  form.email = '';
  form.password = '';
  form.role = '';
  form.isActive = true;
  clearErrors();
};

// Watch for user prop changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.firstName = newUser.firstName;
      form.lastName = newUser.lastName;
      form.username = newUser.username;
      form.email = newUser.email;
      form.role = newUser.role;
      form.isActive = newUser.isActive;
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const validateForm = async (): Promise<boolean> => {
  clearErrors();
  let isValid = true;

  // Required field validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required';
    isValid = false;
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required';
    isValid = false;
  }

  if (!form.username.trim()) {
    errors.username = 'Username is required';
    isValid = false;
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
    isValid = false;
  } else {
    // Check username availability
    const isAvailable = await userService.isUsernameAvailable(
      form.username,
      props.isEdit ? props.user?.id : undefined
    );
    if (!isAvailable) {
      errors.username = 'Username is already taken';
      isValid = false;
    }
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  } else {
    // Check email availability
    const isAvailable = await userService.isEmailAvailable(
      form.email,
      props.isEdit ? props.user?.id : undefined
    );
    if (!isAvailable) {
      errors.email = 'Email is already taken';
      isValid = false;
    }
  }

  if (!props.isEdit) {
    if (!form.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      isValid = false;
    }
  }

  if (!form.role) {
    errors.role = 'Role is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  try {
    loading.value = true;

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    const userData: Partial<User> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      role: form.role as 'admin' | 'manager' | 'worker',
      isActive: form.isActive,
    };

    if (!props.isEdit) {
      userData.id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      userData.createdAt = new Date();
      // Note: password would be hashed in a real application
      (userData as any).password = form.password;
    }

    emit('save', userData);
  } catch (error) {
    console.error('Failed to validate form:', error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};
</script>
