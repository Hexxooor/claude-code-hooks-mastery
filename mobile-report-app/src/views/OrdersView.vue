<template>
  <div>
    <AppHeader />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header with Actions -->
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
            <p class="mt-2 text-gray-600">View and manage work orders</p>
          </div>
          <div class="mt-4 sm:mt-0 space-x-3">
            <button
              :disabled="filteredOrders.length === 0"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="exportToCSV"
            >
              <DocumentArrowDownIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Export CSV
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="refreshOrders"
            >
              <ArrowPathIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <!-- Order Statistics -->
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClipboardDocumentListIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ orderStats.total }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClockIcon class="h-6 w-6 text-yellow-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ orderStats.pending }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <PlayIcon class="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ orderStats.inProgress }}</dd>
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
                    <dt class="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ orderStats.completed }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ExclamationTriangleIcon class="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ orderStats.overdue }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="mt-8 bg-white shadow rounded-lg">
          <div class="p-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <!-- Search -->
              <div>
                <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="search"
                    v-model="searchText"
                    type="text"
                    class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search orders..."
                  />
                </div>
              </div>

              <!-- Status Filter -->
              <div>
                <label for="statusFilter" class="block text-sm font-medium text-gray-700"
                  >Status</label
                >
                <select
                  id="statusFilter"
                  v-model="filters.status"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Priority Filter -->
              <div>
                <label for="priorityFilter" class="block text-sm font-medium text-gray-700"
                  >Priority</label
                >
                <select
                  id="priorityFilter"
                  v-model="filters.priority"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <!-- Sort By -->
              <div>
                <label for="sortBy" class="block text-sm font-medium text-gray-700">Sort By</label>
                <select
                  id="sortBy"
                  v-model="sortBy"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="createdAt">Created Date</option>
                  <option value="priority">Priority</option>
                  <option value="customerName">Customer</option>
                  <option value="orderNumber">Order Number</option>
                </select>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  class="text-sm text-gray-500 hover:text-gray-700"
                  @click="clearFilters"
                >
                  Clear all filters
                </button>
                <span class="text-sm text-gray-500">
                  {{ filteredOrders.length }} of {{ orders.length }} orders
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">Sort:</span>
                <button
                  type="button"
                  class="text-sm text-indigo-600 hover:text-indigo-800"
                  @click="toggleSortDirection"
                >
                  {{ sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="mt-8 text-center">
          <div
            class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500"
          >
            <ArrowPathIcon class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Loading orders...
          </div>
        </div>

        <!-- Orders List -->
        <div v-else class="mt-8">
          <div
            v-if="filteredOrders.length === 0"
            class="text-center py-12 bg-white shadow rounded-lg"
          >
            <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{
                searchText || hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first order.'
              }}
            </p>
          </div>

          <!-- Desktop Table View -->
          <div v-else-if="filteredOrders.length > 0" class="hidden sm:block">
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" class="divide-y divide-gray-200">
                <li
                  v-for="order in paginatedOrders"
                  :key="order.id"
                  class="cursor-pointer hover:bg-gray-50"
                  @click="viewOrder(order)"
                >
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                          <div
                            class="h-10 w-10 rounded-full flex items-center justify-center"
                            :class="getPriorityColor(order.priority)"
                          >
                            <span class="text-xs font-medium text-white">
                              {{ order.priority.charAt(0).toUpperCase() }}
                            </span>
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center space-x-2">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              {{ order.orderNumber }}
                            </p>
                            <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              :class="getStatusColor(order.status)"
                            >
                              {{ formatStatus(order.status) }}
                            </span>
                          </div>
                          <p class="text-sm text-gray-500 truncate">{{ order.customerName }}</p>
                          <p class="text-sm text-gray-500 truncate">{{ order.description }}</p>
                        </div>
                      </div>
                      <div class="flex flex-col items-end space-y-1">
                        <p class="text-sm text-gray-900">Due: {{ formatDate(order.dueDate) }}</p>
                        <p class="text-xs text-gray-500">{{ order.estimatedHours }}h estimated</p>
                        <div v-if="isOverdue(order)" class="flex items-center text-red-600">
                          <ExclamationTriangleIcon class="h-4 w-4 mr-1" />
                          <span class="text-xs">Overdue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Mobile Card View -->
          <div v-else class="sm:hidden space-y-4">
            <div
              v-for="order in paginatedOrders"
              :key="order.id"
              class="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              @click="viewOrder(order)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="text-sm font-medium text-gray-900">{{ order.orderNumber }}</h3>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusColor(order.status)"
                    >
                      {{ formatStatus(order.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-1">{{ order.customerName }}</p>
                  <p class="text-xs text-gray-500 line-clamp-2 mb-2">{{ order.description }}</p>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>Due: {{ formatDate(order.dueDate) }}</span>
                    <span>{{ order.estimatedHours }}h</span>
                  </div>
                </div>
                <div class="ml-4 flex flex-col items-end space-y-2">
                  <div
                    class="h-8 w-8 rounded-full flex items-center justify-center"
                    :class="getPriorityColor(order.priority)"
                  >
                    <span class="text-xs font-medium text-white">
                      {{ order.priority.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div v-if="isOverdue(order)" class="flex items-center text-red-600">
                    <ExclamationTriangleIcon class="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="filteredOrders.length > itemsPerPage"
            class="mt-6 flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg shadow"
          >
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="currentPage--"
              >
                Previous
              </button>
              <button
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="currentPage++"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{
                    Math.min(currentPage * itemsPerPage, filteredOrders.length)
                  }}</span>
                  of
                  <span class="font-medium">{{ filteredOrders.length }}</span>
                  results
                </p>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="currentPage--"
                  >
                    <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <template v-for="page in displayedPages" :key="page">
                    <button
                      v-if="page !== '...'"
                      :class="[
                        page === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      ]"
                      @click="currentPage = page"
                    >
                      {{ page }}
                    </button>
                    <span
                      v-else
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  </template>
                  <button
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="currentPage++"
                  >
                    <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Detail Modal -->
        <OrderDetailModal v-if="selectedOrder" :order="selectedOrder" @close="closeOrderDetail" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline';
import AppHeader from '@/components/layout/AppHeader.vue';
import OrderDetailModal from '@/components/orders/OrderDetailModal.vue';
import orderService from '@/services/crud/order.service';
import type { Order, OrderFilter } from '@/types/database';

// Reactive data
const orders = ref<Order[]>([]);
const selectedOrder = ref<Order | null>(null);
const loading = ref(true);
const searchText = ref('');
const sortBy = ref<keyof Order>('dueDate');
const sortDirection = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const itemsPerPage = 20;

// Filters
const filters = ref<OrderFilter>({
  status: undefined,
  priority: undefined,
});

// Computed properties
const orderStats = computed(() => {
  return {
    total: orders.value.length,
    pending: orders.value.filter((o) => o.status === 'pending').length,
    inProgress: orders.value.filter((o) => o.status === 'in_progress').length,
    completed: orders.value.filter((o) => o.status === 'completed').length,
    cancelled: orders.value.filter((o) => o.status === 'cancelled').length,
    overdue: orders.value.filter((o) => isOverdue(o)).length,
  };
});

const hasActiveFilters = computed(() => {
  return filters.value.status || filters.value.priority || searchText.value;
});

const filteredOrders = computed(() => {
  let filtered = [...orders.value];

  // Apply search
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.description.toLowerCase().includes(search) ||
        order.customerAddress.toLowerCase().includes(search)
    );
  }

  // Apply filters
  if (filters.value.status) {
    filtered = filtered.filter((order) => order.status === filters.value.status);
  }

  if (filters.value.priority) {
    filtered = filtered.filter((order) => order.priority === filters.value.priority);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];

    // Handle date sorting
    if (sortBy.value === 'dueDate' || sortBy.value === 'createdAt') {
      aValue = new Date(aValue as Date).getTime();
      bValue = new Date(bValue as Date).getTime();
    }

    // Handle priority sorting (urgent > high > medium > low)
    if (sortBy.value === 'priority') {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      aValue = priorityOrder[aValue as keyof typeof priorityOrder];
      bValue = priorityOrder[bValue as keyof typeof priorityOrder];
    }

    if (sortDirection.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage));

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrders.value.slice(start, end);
});

const displayedPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (current > 4) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 3) pages.push('...');
    pages.push(total);
  }

  return pages;
});

// Methods
const loadOrders = async () => {
  try {
    loading.value = true;
    orders.value = await orderService.getAll();
  } catch (error) {
    console.error('Failed to load orders:', error);
  } finally {
    loading.value = false;
  }
};

const refreshOrders = async () => {
  await loadOrders();
};

const viewOrder = (order: Order) => {
  selectedOrder.value = order;
};

const closeOrderDetail = () => {
  selectedOrder.value = null;
};

const clearFilters = () => {
  filters.value = {};
  searchText.value = '';
  currentPage.value = 1;
};

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
};

const isOverdue = (order: Order): boolean => {
  const now = new Date();
  return order.dueDate < now && order.status !== 'completed' && order.status !== 'cancelled';
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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

const exportToCSV = () => {
  const headers = [
    'Order Number',
    'Customer',
    'Status',
    'Priority',
    'Due Date',
    'Estimated Hours',
    'Description',
  ];
  const csvContent = [
    headers.join(','),
    ...filteredOrders.value.map((order) =>
      [
        `"${order.orderNumber}"`,
        `"${order.customerName}"`,
        `"${formatStatus(order.status)}"`,
        `"${order.priority}"`,
        `"${formatDate(order.dueDate)}"`,
        order.estimatedHours,
        `"${order.description.replace(/"/g, '""')}"`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Watchers
watch(
  [searchText, filters],
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  loadOrders();
});
</script>
