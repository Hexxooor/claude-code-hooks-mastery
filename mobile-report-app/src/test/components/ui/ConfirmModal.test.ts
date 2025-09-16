import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  ExclamationTriangleIcon: { template: '<div>ExclamationTriangleIcon</div>' },
}));

describe('ConfirmModal', () => {
  const defaultProps = {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  };

  it('should render correctly with provided props', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
    });

    expect(wrapper.find('h3').text()).toBe('Confirm Action');
    expect(wrapper.text()).toContain('Are you sure you want to proceed?');
    expect(wrapper.findAll('button')[1].text()).toBe('Confirm');
    expect(wrapper.findAll('button')[0].text()).toBe('Cancel');
  });

  it('should use default button texts when not provided', () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        title: 'Test',
        message: 'Test message',
      },
    });

    expect(wrapper.findAll('button')[1].text()).toBe('Confirm');
    expect(wrapper.findAll('button')[0].text()).toBe('Cancel');
  });

  it('should emit cancel event when cancel button clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
    });

    await wrapper.findAll('button')[0].trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('should emit confirm event when confirm button clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
    });

    await wrapper.findAll('button')[1].trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });

  it('should emit cancel event when backdrop clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
    });

    await wrapper.find('.fixed.inset-0').trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('should not emit cancel when modal content clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
    });

    await wrapper.find('.relative.top-20').trigger('click');
    expect(wrapper.emitted('cancel')).toBeFalsy();
  });

  it('should support custom confirm button styling', () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        ...defaultProps,
        confirmClass: 'bg-blue-600 hover:bg-blue-700',
      },
    });

    const confirmButton = wrapper.findAll('button')[1];
    expect(confirmButton.classes()).toContain('bg-blue-600');
  });

  it('should handle custom confirm text', () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        ...defaultProps,
        confirmText: 'Delete User',
      },
    });

    expect(wrapper.findAll('button')[1].text()).toBe('Delete User');
  });

  it('should handle custom cancel text', () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        ...defaultProps,
        cancelText: 'Keep User',
      },
    });

    expect(wrapper.findAll('button')[0].text()).toBe('Keep User');
  });

  describe('Styling', () => {
    it('should apply default confirm button styling', () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps,
      });

      const confirmButton = wrapper.findAll('button')[1];
      expect(confirmButton.classes()).toContain('bg-red-600');
    });

    it('should show warning icon', () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps,
      });

      expect(wrapper.find('.bg-red-100').exists()).toBe(true);
    });
  });
});
