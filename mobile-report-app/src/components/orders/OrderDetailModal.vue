<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div
      class="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white"
      @click.stop
    >
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-medium text-gray-900">Order Details</h3>
            <p class="text-sm text-gray-500 mt-1">{{ order.orderNumber }}</p>
          </div>
          <button
            class="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="closeModal"
          >
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <!-- Status and Priority Bar -->
        <div class="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Status:</span>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusColor(order.status)"
            >
              {{ formatStatus(order.status) }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Priority:</span>
            <div class="flex items-center space-x-2">
              <div
                class="h-6 w-6 rounded-full flex items-center justify-center"
                :class="getPriorityColor(order.priority)"
              >
                <span class="text-xs font-medium text-white">
                  {{ order.priority.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-sm font-medium text-gray-900 capitalize">{{ order.priority }}</span>
            </div>
          </div>
          <div v-if="isOverdue" class="flex items-center space-x-1 text-red-600">
            <ExclamationTriangleIcon class="h-5 w-5" />
            <span class="text-sm font-medium">Overdue</span>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Customer Information -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserIcon class="h-5 w-5 mr-2 text-gray-400" />
                Customer Information
              </h4>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="text-sm text-gray-900">{{ order.customerName }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Address</dt>
                  <dd class="text-sm text-gray-900">{{ order.customerAddress }}</dd>
                </div>
              </dl>
            </div>

            <!-- Order Description -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon class="h-5 w-5 mr-2 text-gray-400" />
                Description
              </h4>
              <p class="text-sm text-gray-700 leading-relaxed">{{ order.description }}</p>
            </div>

            <!-- Assigned Users -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UsersIcon class="h-5 w-5 mr-2 text-gray-400" />
                Assigned Workers
              </h4>
              <div v-if="assignedUsers.length > 0" class="space-y-2">
                <div
                  v-for="user in assignedUsers"
                  :key="user.id"
                  class="flex items-center space-x-3"
                >
                  <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-800">
                      {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">No workers assigned</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Schedule Information -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ClockIcon class="h-5 w-5 mr-2 text-gray-400" />
                Schedule
              </h4>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Created</dt>
                  <dd class="text-sm text-gray-900">{{ formatDateTime(order.createdAt) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd class="text-sm text-gray-900">{{ formatDateTime(order.dueDate) }}</dd>
                </div>
                <div v-if="order.completedAt">
                  <dt class="text-sm font-medium text-gray-500">Completed</dt>
                  <dd class="text-sm text-gray-900">{{ formatDateTime(order.completedAt) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Estimated Hours</dt>
                  <dd class="text-sm text-gray-900">{{ order.estimatedHours }}h</dd>
                </div>
              </dl>
            </div>

            <!-- Related Reports -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DocumentChartBarIcon class="h-5 w-5 mr-2 text-gray-400" />
                Related Reports
              </h4>
              <div v-if="loading.reports" class="flex items-center space-x-2 text-sm text-gray-500">
                <ArrowPathIcon class="h-4 w-4 animate-spin" />
                <span>Loading reports...</span>
              </div>
              <div v-else-if="relatedReports.length > 0" class="space-y-2">
                <div
                  v-for="report in relatedReports"
                  :key="report.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ report.title }}</p>
                    <p class="text-xs text-gray-500">{{ formatDateTime(report.createdAt) }}</p>
                  </div>
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getReportStatusColor(report.status)"
                  >
                    {{ report.status }}
                  </span>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">No reports available</p>
            </div>

            <!-- Time Entries -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ClockIcon class="h-5 w-5 mr-2 text-gray-400" />
                Time Tracking
              </h4>
              <div
                v-if="loading.timeEntries"
                class="flex items-center space-x-2 text-sm text-gray-500"
              >
                <ArrowPathIcon class="h-4 w-4 animate-spin" />
                <span>Loading time entries...</span>
              </div>
              <div v-else-if="timeEntries.length > 0" class="space-y-2">
                <div class="text-sm font-medium text-gray-900 mb-2">
                  Total Time: {{ totalTimeSpent }}h
                </div>
                <div
                  v-for="entry in timeEntries"
                  :key="entry.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ entry.description }}</p>
                    <p class="text-xs text-gray-500">{{ formatDateTime(entry.startTime) }}</p>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ Math.round(((entry.duration || 0) / 60) * 100) / 100 }}h
                  </span>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">No time entries recorded</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
          <div class="flex space-x-3">
            <button
              v-if="order.status !== 'completed' && order.status !== 'cancelled'"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              @click="updateOrderStatus('completed')"
            >
              <CheckCircleIcon class="-ml-1 mr-2 h-5 w-5" />
              Mark Complete
            </button>
            <button
              v-if="order.status === 'pending'"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="updateOrderStatus('in_progress')"
            >
              <PlayIcon class="-ml-1 mr-2 h-5 w-5" />
              Start Work
            </button>
          </div>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  XMarkIcon,
  UserIcon,
  UsersIcon,
  ClockIcon,
  DocumentTextIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline';
import orderService from '@/services/crud/order.service';
import reportService from '@/services/crud/report.service';
import timeEntryService from '@/services/crud/time-entry.service';
import userService from '@/services/crud/user.service';
import type { Order, Report, TimeEntry, User } from '@/types/database';

// Props
interface Props {
  order: Order;
}

const props = defineProps<Props>();

// Emits
interface Emits {
  (e: 'close'): void;
  (e: 'updated', order: Order): void;
}

const emit = defineEmits<Emits>();

// Reactive data
const relatedReports = ref<Report[]>([]);
const timeEntries = ref<TimeEntry[]>([]);
const assignedUsers = ref<User[]>([]);
const loading = ref({
  reports: true,
  timeEntries: true,
  users: true,
});

// Computed properties
const isOverdue = computed(() => {
  const now = new Date();
  return (
    props.order.dueDate < now &&
    props.order.status !== 'completed' &&
    props.order.status !== 'cancelled'
  );
});

const totalTimeSpent = computed(() => {
  const total = timeEntries.value.reduce((acc, entry) => acc + (entry.duration || 0), 0);
  return Math.round((total / 60) * 100) / 100; // Convert minutes to hours
});

// Methods
const closeModal = () => {
  emit('close');
};

const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatStatus = (status: Order['status']): string => {
  const statusMap = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: Order['status']): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority: Order['priority']): string => {
  const colors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
  };
  return colors[priority] || 'bg-gray-500';
};

const getReportStatusColor = (status: Report['status']): string => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const updateOrderStatus = async (newStatus: Order['status']) => {
  try {
    const updatedOrder = await orderService.updateStatus(props.order.id!, newStatus);
    emit('updated', updatedOrder);
    closeModal();
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
};

const loadRelatedData = async () => {
  if (!props.order.id) return;

  try {
    // Load reports
    loading.value.reports = true;
    relatedReports.value = await reportService.getByOrderId(props.order.id);
  } catch (error) {
    console.error('Failed to load reports:', error);
  } finally {
    loading.value.reports = false;
  }

  try {
    // Load time entries
    loading.value.timeEntries = true;
    timeEntries.value = await timeEntryService.getByOrderId(props.order.id);
  } catch (error) {
    console.error('Failed to load time entries:', error);
  } finally {
    loading.value.timeEntries = false;
  }

  try {
    // Load assigned users
    loading.value.users = true;
    const users = await userService.getAll();
    assignedUsers.value = users.filter((user) => props.order.assignedTo.includes(user.id!));
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    loading.value.users = false;
  }
};

// Lifecycle
onMounted(() => {
  loadRelatedData();
});
</script>
