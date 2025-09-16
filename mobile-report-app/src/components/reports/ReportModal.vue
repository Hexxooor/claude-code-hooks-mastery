<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div
      class="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white"
      @click.stop
    >
      <div class="mt-3">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit Report' : 'Create New Report' }}
          </h3>
          <button
            class="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="closeModal"
          >
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <form class="mt-6 space-y-6" @submit.prevent="handleSubmit">
          <!-- Order Selection -->
          <div>
            <label for="orderId" class="block text-sm font-medium text-gray-700">
              Link to Order *
            </label>
            <select
              id="orderId"
              v-model="form.orderId"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.orderId }"
              :disabled="orders.length === 0"
            >
              <option value="">
                {{ orders.length === 0 ? 'No orders available' : 'Select an Order' }}
              </option>
              <option v-for="order in orders" :key="order.id" :value="order.id">
                {{ order.orderNumber }} - {{ order.customerName }}
                <span class="text-gray-500">({{ order.status }})</span>
              </option>
            </select>
            <p v-if="errors.orderId" class="mt-1 text-sm text-red-600">{{ errors.orderId }}</p>
            <p v-if="orders.length === 0" class="mt-1 text-sm text-amber-600">
              No orders available. Please create some orders first to link reports.
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">
              Select the work order this report belongs to
            </p>
          </div>

          <!-- Report Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Report Title *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              placeholder="e.g., HVAC Installation Completion Report"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.title }"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- Report Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              placeholder="Describe the work completed, findings, or notes..."
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.description }"
            />
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">
              {{ errors.description }}
            </p>
          </div>

          <!-- Report Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700"> Status * </label>
            <select
              id="status"
              v-model="form.status"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.status }"
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
            <p class="mt-1 text-sm text-gray-500">
              Draft reports can be edited later. Submitted reports are ready for review.
            </p>
          </div>

          <!-- Customer Information (for signature later) -->
          <div v-if="form.status !== 'draft'">
            <label for="customerName" class="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              id="customerName"
              v-model="form.customerName"
              type="text"
              placeholder="Customer name for signature"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': errors.customerName }"
            />
            <p v-if="errors.customerName" class="mt-1 text-sm text-red-600">
              {{ errors.customerName }}
            </p>
          </div>

          <!-- Help Text -->
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <InformationCircleIcon class="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  <strong>After creating:</strong> You can add photos, materials, and time entries
                  to this report. Customer signatures can be collected for submitted reports.
                </p>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
              {{ loading ? 'Creating...' : isEdit ? 'Update Report' : 'Create Report' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import type { Report, Order } from '@/types/database';
import { orderService } from '@/services/crud';
import { useAuthStore } from '@/stores/auth.store';

interface Props {
  report?: Report | null;
  isEdit?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', reportData: Partial<Report>): void;
}

const props = withDefaults(defineProps<Props>(), {
  report: null,
  isEdit: false,
});

const emit = defineEmits<Emits>();
const authStore = useAuthStore();

// Form state
const form = reactive({
  orderId: '',
  title: '',
  description: '',
  status: 'draft' as 'draft' | 'submitted' | 'approved',
  customerName: '',
});

const errors = reactive({
  orderId: '',
  title: '',
  description: '',
  status: '',
  customerName: '',
});

const loading = ref(false);
const orders = ref<Order[]>([]);

// Load orders on mount
onMounted(async () => {
  try {
    // Load active orders that can have reports
    const allOrders = await orderService.getAll();
    orders.value = allOrders
      .filter((order) => order.status === 'in_progress' || order.status === 'completed')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Failed to load orders:', error);
  }
});

// Watch for report prop changes
watch(
  () => props.report,
  (newReport) => {
    if (newReport) {
      form.orderId = newReport.orderId;
      form.title = newReport.title;
      form.description = newReport.description;
      form.status = newReport.status;
      form.customerName = newReport.customerName || '';
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const resetForm = () => {
  form.orderId = '';
  form.title = '';
  form.description = '';
  form.status = 'draft';
  form.customerName = '';
  clearErrors();
};

const clearErrors = () => {
  errors.orderId = '';
  errors.title = '';
  errors.description = '';
  errors.status = '';
  errors.customerName = '';
};

const validateForm = (): boolean => {
  clearErrors();
  let isValid = true;

  // Required field validation
  if (!form.orderId) {
    errors.orderId = 'Please select an order';
    isValid = false;
  }

  if (!form.title.trim()) {
    errors.title = 'Report title is required';
    isValid = false;
  } else if (form.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
    isValid = false;
  }

  if (!form.status) {
    errors.status = 'Status is required';
    isValid = false;
  }

  // Validate customer name for non-draft reports
  if (form.status !== 'draft' && !form.customerName.trim()) {
    errors.customerName = 'Customer name is required for submitted/approved reports';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  try {
    loading.value = true;

    if (!validateForm()) {
      return;
    }

    const currentUser = authStore.user;
    if (!currentUser) {
      errors.orderId = 'User not authenticated';
      return;
    }

    const reportData: Partial<Report> = {
      orderId: form.orderId,
      userId: currentUser.id,
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      customerName: form.customerName.trim() || undefined,
    };

    if (!props.isEdit) {
      // Set default values for new reports
      reportData.id = `report-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      reportData.createdAt = new Date();
      reportData.updatedAt = new Date();
      reportData.photos = [];
      reportData.materials = [];
      reportData.timeEntries = [];
    }

    emit('save', reportData);
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
