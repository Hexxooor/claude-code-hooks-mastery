<template>
  <div>
    <AppHeader />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header with Actions -->
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
            <p class="mt-2 text-gray-600">Create and manage digital reports</p>
          </div>
          <div class="mt-4 sm:mt-0 space-x-3">
            <button
              :disabled="filteredReports.length === 0"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="exportAllToPDF"
            >
              <DocumentArrowDownIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Export to PDF
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="openCreateModal"
            >
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create Report
            </button>
          </div>
        </div>

        <!-- Report Statistics -->
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <DocumentTextIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Reports</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ reportStats.total }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <PencilIcon class="h-6 w-6 text-yellow-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Draft Reports</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ reportStats.draft }}</dd>
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
                    <dt class="text-sm font-medium text-gray-500 truncate">Approved</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ reportStats.approved }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <PencilSquareIcon class="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Signed</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ reportStats.signed }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Search reports</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search reports..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <select
              v-model="statusFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div>
            <select
              v-model="userFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Users</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.firstName }} {{ user.lastName }}
              </option>
            </select>
          </div>
        </div>

        <!-- Reports Table -->
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
                        Report
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
                        Creator
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Content
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="report in filteredReports" :key="report.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ report.title }}</div>
                          <div class="text-sm text-gray-500">
                            {{ report.description || 'No description' }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="getStatusBadgeClass(report.status)"
                        >
                          {{ report.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ getUserName(report.userId) }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(report.createdAt) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div class="flex items-center space-x-3">
                          <div v-if="report.photos.length > 0" class="flex items-center">
                            <PhotoIcon class="h-4 w-4 text-gray-400 mr-1" />
                            <span>{{ report.photos.length }}</span>
                          </div>
                          <div v-if="report.materials.length > 0" class="flex items-center">
                            <CubeIcon class="h-4 w-4 text-gray-400 mr-1" />
                            <span>{{ report.materials.length }}</span>
                          </div>
                          <div v-if="report.customerSignature" class="flex items-center">
                            <PencilSquareIcon class="h-4 w-4 text-green-400 mr-1" />
                            <span>Signed</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          class="text-indigo-600 hover:text-indigo-900 mr-3"
                          @click="viewReport(report)"
                        >
                          View
                        </button>
                        <button
                          class="text-blue-600 hover:text-blue-900 mr-3"
                          @click="exportReportToPDF(report)"
                        >
                          PDF
                        </button>
                        <button
                          v-if="report.status === 'draft'"
                          class="text-yellow-600 hover:text-yellow-900 mr-3"
                          @click="editReport(report)"
                        >
                          Edit
                        </button>
                        <button
                          class="text-red-600 hover:text-red-900"
                          @click="deleteReport(report)"
                        >
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

        <!-- Empty State -->
        <div v-if="filteredReports.length === 0 && !loading" class="text-center mt-12">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new report.</p>
          <div class="mt-6">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="openCreateModal"
            >
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create Report
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center mt-12">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
          ></div>
          <p class="mt-2 text-sm text-gray-500">Loading reports...</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete Report"
      :message="`Are you sure you want to delete the report '${reportToDelete?.title}'? This action cannot be undone.`"
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
  DocumentTextIcon,
  PencilIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  CubeIcon,
} from '@heroicons/vue/24/outline';
import AppHeader from '@/components/layout/AppHeader.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import ReportModal from '@/components/reports/ReportModal.vue';
import reportService from '@/services/crud/report.service';
import { userService } from '@/services/crud';
import type { Report } from '@/types/database';
import type { User } from '@/types/auth';
import jsPDF from 'jspdf';

// Reactive state
const reports = ref<Report[]>([]);
const users = ref<User[]>([]);
const reportStats = ref({
  total: 0,
  draft: 0,
  submitted: 0,
  approved: 0,
  signed: 0,
  withPhotos: 0,
  withMaterials: 0,
});
const searchQuery = ref('');
const statusFilter = ref('');
const userFilter = ref('');
const showDeleteModal = ref(false);
const reportToDelete = ref<Report | null>(null);
const showCreateModal = ref(false);
const selectedReport = ref<Report | null>(null);
const isEditMode = ref(false);
const loading = ref(false);

// Computed properties
const filteredReports = computed(() => {
  let filtered = reports.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        getUserName(report.userId).toLowerCase().includes(query)
    );
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter((report) => report.status === statusFilter.value);
  }

  // User filter
  if (userFilter.value) {
    filtered = filtered.filter((report) => report.userId === userFilter.value);
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

// Methods
const loadReports = async () => {
  try {
    loading.value = true;
    reports.value = await reportService.getAll();
    reportStats.value = await reportService.getStats();
  } catch (error) {
    console.error('Failed to load reports:', error);
  } finally {
    loading.value = false;
  }
};

const loadUsers = async () => {
  try {
    users.value = await userService.getAll();
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

const getUserName = (userId: string): string => {
  const user = users.value.find((u) => u.id === userId);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'submitted':
      return 'bg-blue-100 text-blue-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

const openCreateModal = () => {
  selectedReport.value = null;
  isEditMode.value = false;
  showCreateModal.value = true;
};

const viewReport = (report: Report) => {
  // TODO: Implement report details view
  console.log('View report:', report);
};

const editReport = (report: Report) => {
  selectedReport.value = { ...report };
  isEditMode.value = true;
  showCreateModal.value = true;
};

const deleteReport = (report: Report) => {
  reportToDelete.value = report;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (reportToDelete.value) {
    try {
      await reportService.delete(reportToDelete.value.id!);
      await loadReports();
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  reportToDelete.value = null;
};

// PDF Export Functions
const exportReportToPDF = async (report: Report) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(51, 51, 51);
    pdf.text('Work Report', margin, yPosition);
    yPosition += 15;

    // Report Info
    pdf.setFontSize(12);
    pdf.setTextColor(102, 102, 102);
    pdf.text(`Report ID: ${report.id}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Status: ${report.status.toUpperCase()}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Created: ${formatDate(report.createdAt)}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Creator: ${getUserName(report.userId)}`, margin, yPosition);
    yPosition += 15;

    // Title
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('Title:', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text(report.title, margin, yPosition);
    yPosition += 15;

    // Description
    if (report.description) {
      pdf.setFontSize(16);
      pdf.setTextColor(51, 51, 51);
      pdf.text('Description:', margin, yPosition);
      yPosition += 10;
      pdf.setFontSize(12);
      const descriptionLines = pdf.splitTextToSize(report.description, pageWidth - 2 * margin);
      pdf.text(descriptionLines, margin, yPosition);
      yPosition += descriptionLines.length * 7 + 10;
    }

    // Materials
    if (report.materials.length > 0) {
      pdf.setFontSize(16);
      pdf.setTextColor(51, 51, 51);
      pdf.text('Materials Used:', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      report.materials.forEach((material, index) => {
        if (yPosition > pdf.internal.pageSize.getHeight() - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.text(`${index + 1}. ${material.name} (${material.code})`, margin + 5, yPosition);
        yPosition += 7;
        pdf.text(`   Quantity: ${material.quantityUsed} ${material.unit}`, margin + 5, yPosition);
        yPosition += 7;
        pdf.text(`   Unit Price: $${material.unitPrice.toFixed(2)}`, margin + 5, yPosition);
        yPosition += 7;
        pdf.text(`   Total: $${material.totalCost.toFixed(2)}`, margin + 5, yPosition);
        yPosition += 10;
      });
    }

    // Photos summary
    if (report.photos.length > 0) {
      if (yPosition > pdf.internal.pageSize.getHeight() - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(51, 51, 51);
      pdf.text('Photos Attached:', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.text(`${report.photos.length} photos included in this report`, margin + 5, yPosition);
      yPosition += 15;
    }

    // Signature
    if (report.customerSignature) {
      if (yPosition > pdf.internal.pageSize.getHeight() - 80) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(51, 51, 51);
      pdf.text('Customer Signature:', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      if (report.customerName) {
        pdf.text(`Signed by: ${report.customerName}`, margin + 5, yPosition);
        yPosition += 7;
      }
      if (report.signedAt) {
        pdf.text(`Signed at: ${formatDate(report.signedAt)}`, margin + 5, yPosition);
      }
    }

    // Save the PDF
    const fileName = `report-${report.id}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Failed to export report to PDF:', error);
  }
};

const exportAllToPDF = async () => {
  try {
    const pdf = new jsPDF();
    const margin = 20;
    let yPosition = margin;

    // Title page
    pdf.setFontSize(24);
    pdf.setTextColor(51, 51, 51);
    pdf.text('Reports Summary', margin, yPosition);
    yPosition += 20;

    // Summary statistics
    pdf.setFontSize(16);
    pdf.text('Statistics:', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.text(`Total Reports: ${reportStats.value.total}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Draft: ${reportStats.value.draft}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Submitted: ${reportStats.value.submitted}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Approved: ${reportStats.value.approved}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Signed: ${reportStats.value.signed}`, margin + 5, yPosition);
    yPosition += 20;

    // Reports list
    pdf.setFontSize(16);
    pdf.text('Reports List:', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(10);
    filteredReports.value.forEach((report, index) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.text(`${index + 1}. ${report.title}`, margin + 5, yPosition);
      yPosition += 5;
      pdf.text(
        `   Status: ${report.status} | Creator: ${getUserName(report.userId)}`,
        margin + 10,
        yPosition
      );
      yPosition += 5;
      pdf.text(`   Created: ${formatDate(report.createdAt)}`, margin + 10, yPosition);
      yPosition += 5;
      if (report.description) {
        const desc =
          report.description.length > 80
            ? report.description.substring(0, 80) + '...'
            : report.description;
        pdf.text(`   Description: ${desc}`, margin + 10, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    });

    // Save the PDF
    const fileName = `reports-summary-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Failed to export reports summary to PDF:', error);
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([loadReports(), loadUsers()]);
});
</script>
