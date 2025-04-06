import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoForm from '../TodoForm.vue';

describe('TodoForm', () => {
  it('emits submit event with todo data when form is submitted', async () => {
    const wrapper = mount(TodoForm);
    
    // Fill in the form
    await wrapper.find('[data-testid="todo-name-input"]').setValue('Test Todo');
    await wrapper.find('[data-testid="todo-description-input"]').setValue('Test Description');
    
    // Submit the form
    await wrapper.find('[data-testid="todo-form"]').trigger('submit');
    
    // Check that the correct event was emitted
    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')?.[0][0]).toEqual({
      name: 'Test Todo',
      description: 'Test Description',
    });
  });

  it('does not emit submit event when name is empty', async () => {
    const wrapper = mount(TodoForm);
    
    // Submit form without filling name
    await wrapper.find('[data-testid="todo-form"]').trigger('submit');
    
    // Check that no event was emitted
    expect(wrapper.emitted('submit')).toBeFalsy();
  });

  it('clears inputs after successful submission', async () => {
    const wrapper = mount(TodoForm);
    
    // Fill in the form
    const nameInput = wrapper.find('[data-testid="todo-name-input"]');
    const descInput = wrapper.find('[data-testid="todo-description-input"]');
    
    await nameInput.setValue('Test Todo');
    await descInput.setValue('Test Description');
    
    // Submit the form
    await wrapper.find('[data-testid="todo-form"]').trigger('submit');
    
    // Check that inputs were cleared
    expect((nameInput.element as HTMLInputElement).value).toBe('');
    expect((descInput.element as HTMLInputElement).value).toBe('');
  });

  it('disables submit button when isLoading is true', () => {
    const wrapper = mount(TodoForm, {
      props: {
        isLoading: true,
      },
    });
    
    const submitButton = wrapper.find('[data-testid="todo-submit-button"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });
}); 