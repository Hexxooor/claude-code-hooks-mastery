import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserModal from '@/components/users/UserModal.vue';
import { userService } from '@/services/crud';

// Mock the user service
vi.mock('@/services/crud', () => ({
  userService: {
    isUsernameAvailable: vi.fn(),
    isEmailAvailable: vi.fn(),
  },
}));

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  XMarkIcon: { template: '<div>XMarkIcon</div>' },
}));

describe('UserModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(userService.isUsernameAvailable).mockResolvedValue(true);
    vi.mocked(userService.isEmailAvailable).mockResolvedValue(true);
  });

  describe('Create Mode', () => {
    it('should render create user form correctly', () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      expect(wrapper.find('h3').text()).toBe('Create New User');
      expect(wrapper.find('#firstName').exists()).toBe(true);
      expect(wrapper.find('#lastName').exists()).toBe(true);
      expect(wrapper.find('#username').exists()).toBe(true);
      expect(wrapper.find('#email').exists()).toBe(true);
      expect(wrapper.find('#password').exists()).toBe(true);
      expect(wrapper.find('#role').exists()).toBe(true);
      expect(wrapper.find('#isActive').exists()).toBe(true);
    });

    it('should show password field for new users', () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      expect(wrapper.find('#password').exists()).toBe(true);
      expect(wrapper.find('label[for="password"]').text()).toBe('Password *');
    });

    it('should emit close event when close button clicked', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      const closeButtons = wrapper
        .findAll('button')
        .filter((btn) => btn.text().includes('Cancel') || btn.find('.h-6.w-6').exists());

      if (closeButtons.length > 0) {
        await closeButtons[0].trigger('click');
        expect(wrapper.emitted('close')).toBeTruthy();
      }
    });

    it('should emit close event when backdrop clicked', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      await wrapper.find('.fixed.inset-0').trigger('click');
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('Edit Mode', () => {
    const mockUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'manager' as const,
      isActive: true,
      createdAt: new Date(),
    };

    it('should render edit user form correctly', () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: true,
          user: mockUser,
        },
      });

      expect(wrapper.find('h3').text()).toBe('Edit User');
      expect(wrapper.find('#password').exists()).toBe(false);
    });

    it('should populate form with user data', () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: true,
          user: mockUser,
        },
      });

      expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('John');
      expect((wrapper.find('#lastName').element as HTMLInputElement).value).toBe('Doe');
      expect((wrapper.find('#username').element as HTMLInputElement).value).toBe('johndoe');
      expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('john@example.com');
      expect((wrapper.find('#role').element as HTMLSelectElement).value).toBe('manager');
      expect((wrapper.find('#isActive').element as HTMLInputElement).checked).toBe(true);
    });

    it('should not show password field for existing users', () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: true,
          user: mockUser,
        },
      });

      expect(wrapper.find('#password').exists()).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('First name is required');
      expect(wrapper.text()).toContain('Last name is required');
      expect(wrapper.text()).toContain('Username is required');
      expect(wrapper.text()).toContain('Email is required');
      expect(wrapper.text()).toContain('Password is required');
      expect(wrapper.text()).toContain('Role is required');
    });

    it('should validate email format', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      await wrapper.find('#firstName').setValue('John');
      await wrapper.find('#lastName').setValue('Doe');
      await wrapper.find('#username').setValue('johndoe');
      await wrapper.find('#email').setValue('invalid-email');
      await wrapper.find('#password').setValue('Password123');
      await wrapper.find('#role').setValue('worker');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Please enter a valid email address');
    });

    it('should validate password requirements', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      // Test minimum length
      await wrapper.find('#firstName').setValue('John');
      await wrapper.find('#lastName').setValue('Doe');
      await wrapper.find('#username').setValue('johndoe');
      await wrapper.find('#email').setValue('john@example.com');
      await wrapper.find('#password').setValue('123');
      await wrapper.find('#role').setValue('worker');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Password must be at least 8 characters');

      // Test pattern requirements
      await wrapper.find('#password').setValue('12345678');
      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
    });

    it('should validate username length', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      await wrapper.find('#firstName').setValue('John');
      await wrapper.find('#lastName').setValue('Doe');
      await wrapper.find('#username').setValue('ab');
      await wrapper.find('#email').setValue('john@example.com');
      await wrapper.find('#password').setValue('Password123');
      await wrapper.find('#role').setValue('worker');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Username must be at least 3 characters');
    });
  });

  describe('Form Submission', () => {
    it('should emit save event with valid form data for new user', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      await wrapper.find('#firstName').setValue('John');
      await wrapper.find('#lastName').setValue('Doe');
      await wrapper.find('#username').setValue('johndoe');
      await wrapper.find('#email').setValue('john@example.com');
      await wrapper.find('#password').setValue('Password123');
      await wrapper.find('#role').setValue('worker');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      const saveEvent = wrapper.emitted('save');
      expect(saveEvent).toBeTruthy();

      if (saveEvent) {
        const userData = saveEvent[0][0];
        expect(userData).toMatchObject({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          role: 'worker',
          isActive: true,
        });
        expect(userData.id).toBeDefined();
        expect(userData.createdAt).toBeInstanceOf(Date);
      }
    });

    it('should emit save event with valid form data for existing user', async () => {
      const mockUser = {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'manager' as const,
        isActive: true,
        createdAt: new Date(),
      };

      const wrapper = mount(UserModal, {
        props: {
          isEdit: true,
          user: mockUser,
        },
      });

      await wrapper.find('#firstName').setValue('Jane');
      await wrapper.find('#role').setValue('admin');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      const saveEvent = wrapper.emitted('save');
      expect(saveEvent).toBeTruthy();

      if (saveEvent) {
        const userData = saveEvent[0][0];
        expect(userData).toMatchObject({
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          role: 'admin',
          isActive: true,
        });
        expect(userData.id).toBeUndefined(); // Should not set ID for updates
      }
    });
  });

  describe('Role Selection', () => {
    it('should include all role options', () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      const roleSelect = wrapper.find('#role');
      const options = roleSelect.findAll('option');

      expect(options.length).toBe(4);
      expect(options[0].text()).toBe('Select Role');
      expect(options[1].text()).toBe('Admin');
      expect(options[2].text()).toBe('Manager');
      expect(options[3].text()).toBe('Worker');
    });
  });

  describe('Active Status Toggle', () => {
    it('should default to active for new users', () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      const activeCheckbox = wrapper.find('#isActive');
      expect((activeCheckbox.element as HTMLInputElement).checked).toBe(true);
    });

    it('should allow toggling active status', async () => {
      const wrapper = mount(UserModal, {
        props: {
          isEdit: false,
          user: null,
        },
      });

      const activeCheckbox = wrapper.find('#isActive');
      await activeCheckbox.setValue(false);

      expect((activeCheckbox.element as HTMLInputElement).checked).toBe(false);
    });
  });
});
