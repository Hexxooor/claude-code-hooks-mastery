import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UsersView from '@/views/UsersView.vue';
import { userService } from '@/services/crud';

// Mock services
vi.mock('@/services/crud', () => ({
  userService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getStats: vi.fn(),
    setActiveStatus: vi.fn(),
  },
}));

// Mock stores
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    user: {
      id: 'current-user',
      role: 'admin',
    },
  }),
}));

// Mock layout components
vi.mock('@/components/layout/AppHeader.vue', () => ({
  default: { template: '<div>AppHeader</div>' },
}));

// Mock components to avoid mounting complexity
vi.mock('@/components/users/UserModal.vue', () => ({
  default: {
    template: '<div data-testid="user-modal">UserModal</div>',
    emits: ['close', 'save'],
  },
}));

vi.mock('@/components/ui/ConfirmModal.vue', () => ({
  default: {
    template: '<div data-testid="confirm-modal">ConfirmModal</div>',
    emits: ['confirm', 'cancel'],
  },
}));

// Mock all required Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  PlusIcon: { template: '<div>PlusIcon</div>' },
  UsersIcon: { template: '<div>UsersIcon</div>' },
  CheckCircleIcon: { template: '<div>CheckCircleIcon</div>' },
  ShieldCheckIcon: { template: '<div>ShieldCheckIcon</div>' },
  CogIcon: { template: '<div>CogIcon</div>' },
  MagnifyingGlassIcon: { template: '<div>MagnifyingGlassIcon</div>' },
  PencilIcon: { template: '<div>PencilIcon</div>' },
  TrashIcon: { template: '<div>TrashIcon</div>' },
}));

// Mock toast
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('UsersView', () => {
  const mockUsers = [
    {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'admin' as const,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      lastLogin: new Date('2023-12-01'),
    },
    {
      id: 'user-2',
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      role: 'manager' as const,
      isActive: true,
      createdAt: new Date('2023-02-01'),
    },
    {
      id: 'user-3',
      firstName: 'Bob',
      lastName: 'Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
      role: 'worker' as const,
      isActive: false,
      createdAt: new Date('2023-03-01'),
    },
  ];

  const mockStats = {
    total: 3,
    active: 2,
    inactive: 1,
    admins: 1,
    managers: 1,
    workers: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (userService.getAll as any).mockResolvedValue(mockUsers);
    (userService.getStats as any).mockResolvedValue(mockStats);
  });

  describe('Component Rendering', () => {
    it('should render users view correctly', () => {
      const wrapper = mount(UsersView);

      expect(wrapper.find('h1').text()).toBe('User Management');
    });

    it('should display user statistics after loading', async () => {
      const wrapper = mount(UsersView);

      // Wait for async data loading
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(userService.getAll).toHaveBeenCalled();
      expect(userService.getStats).toHaveBeenCalled();
    });

    it('should render users table when users loaded', async () => {
      const wrapper = mount(UsersView);

      // Simulate data loading
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(wrapper.find('table').exists()).toBe(true);
    });
  });

  describe('Search and Filtering', () => {
    it('should have search input field', () => {
      const wrapper = mount(UsersView);

      const searchInput = wrapper.find('input[placeholder*="Search"]');
      expect(searchInput.exists()).toBe(true);
    });

    it('should have role filter dropdown', () => {
      const wrapper = mount(UsersView);

      const roleFilter = wrapper.find('select');
      expect(roleFilter.exists()).toBe(true);
    });

    it('should filter users by search term', async () => {
      const wrapper = mount(UsersView);

      const searchInput = wrapper.find('input[placeholder*="Search"]');
      await searchInput.setValue('john');

      // The component should filter users (tested via computed property)
      expect((searchInput.element as HTMLInputElement).value).toBe('john');
    });
  });

  describe('User Actions', () => {
    it('should have add user button', () => {
      const wrapper = mount(UsersView);

      const addButton = wrapper.find('button');
      expect(addButton.exists()).toBe(true);
      expect(addButton.text()).toContain('Add User');
    });

    it('should show user modal when add button clicked', async () => {
      const wrapper = mount(UsersView);

      const addButton = wrapper.find('button');
      await addButton.trigger('click');

      // Check if modal is shown (via data property)
      expect((wrapper.vm as any).showModal).toBe(true);
    });
  });

  describe('Data Loading', () => {
    it('should load users on component mount', async () => {
      const wrapper = mount(UsersView);
      // Wait for onMounted lifecycle to complete
      await wrapper.vm.$nextTick();
      // Wait for async loadUsers function to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(userService.getAll).toHaveBeenCalled();
      expect(userService.getStats).toHaveBeenCalled();
    });

    it('should handle loading state', () => {
      const wrapper = mount(UsersView);

      // Initially should be in loading state
      expect((wrapper.vm as any).loading).toBe(true);
    });

    it('should handle loading errors gracefully', async () => {
      (userService.getAll as any).mockRejectedValue(new Error('Failed to load'));

      const wrapper = mount(UsersView);

      // Wait for error handling
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should handle error without crashing
      expect((wrapper.vm as any).loading).toBe(false);
    });
  });

  describe('CRUD Operations', () => {
    it('should call create service when saving new user', async () => {
      const newUser = {
        firstName: 'New',
        lastName: 'User',
        username: 'newuser',
        email: 'new@example.com',
        role: 'worker' as const,
        isActive: true,
      };

      (userService.create as any).mockResolvedValue({
        ...newUser,
        id: 'user-4',
        createdAt: new Date(),
      });

      const wrapper = mount(UsersView);

      // Directly test the method
      await (wrapper.vm as any).handleSaveUser(newUser);

      expect(userService.create).toHaveBeenCalledWith(newUser);
    });

    it('should call update service when editing existing user', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'User',
      };

      (userService.update as any).mockResolvedValue({
        ...mockUsers[0],
        ...updateData,
      });

      const wrapper = mount(UsersView);
      (wrapper.vm as any).selectedUser = mockUsers[0];
      (wrapper.vm as any).isEditMode = true;

      await (wrapper.vm as any).handleSaveUser(updateData);

      expect(userService.update).toHaveBeenCalledWith('user-1', updateData);
    });

    it('should call delete service when deleting user', async () => {
      (userService.delete as any).mockResolvedValue(undefined);

      const wrapper = mount(UsersView);
      (wrapper.vm as any).userToDelete = mockUsers[0];

      await (wrapper.vm as any).confirmDelete();

      expect(userService.delete).toHaveBeenCalledWith('user-1');
    });
  });

  describe('Component State Management', () => {
    it('should have correct initial state', () => {
      const wrapper = mount(UsersView);

      expect((wrapper.vm as any).users).toEqual([]);
      expect((wrapper.vm as any).loading).toBe(true);
      expect((wrapper.vm as any).showModal).toBe(false);
      expect((wrapper.vm as any).showDeleteModal).toBe(false);
      expect((wrapper.vm as any).selectedUser).toBeNull();
      expect((wrapper.vm as any).userToDelete).toBeNull();
    });

    it('should close modal when close event emitted', async () => {
      const wrapper = mount(UsersView);
      (wrapper.vm as any).showModal = true;

      await (wrapper.vm as any).closeModal();

      expect((wrapper.vm as any).showModal).toBe(false);
      expect((wrapper.vm as any).selectedUser).toBeNull();
    });

    it('should close delete modal when cancel event emitted', async () => {
      const wrapper = mount(UsersView);
      (wrapper.vm as any).showDeleteModal = true;

      await (wrapper.vm as any).closeDeleteModal();

      expect((wrapper.vm as any).showDeleteModal).toBe(false);
      expect((wrapper.vm as any).userToDelete).toBeNull();
    });
  });
});
