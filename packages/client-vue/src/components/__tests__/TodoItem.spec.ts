import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoItem from '../TodoItem.vue';
import { Todo } from '@protos/v1/todo_pb';

const mockTodo = new Todo({
  id: '1',
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
});

describe('TodoItem', () => {
  it('renders todo item correctly', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });
    
    expect(wrapper.find('[data-testid="todo-title"]').text()).toBe(mockTodo.title);
    expect(wrapper.find('[data-testid="todo-description"]').text()).toContain(mockTodo.description);
    const checkbox = wrapper.find('[data-testid="todo-checkbox"]').element as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('emits toggle event when checkbox is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });
    
    await wrapper.find('[data-testid="todo-checkbox"]').trigger('change');
    
    expect(wrapper.emitted('toggle')).toBeTruthy();
    expect(wrapper.emitted('toggle')?.[0][0]).toEqual(mockTodo);
  });

  it('enters edit mode when edit button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });
    
    await wrapper.find('[data-testid="edit-button"]').trigger('click');
    
    expect(wrapper.find('[data-testid="edit-title-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="edit-description-input"]').exists()).toBe(true);
  });

  it('emits update event with new values when save is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });
    
    // Enter edit mode
    await wrapper.find('[data-testid="edit-button"]').trigger('click');
    
    // Update values
    await wrapper.find('[data-testid="edit-title-input"]').setValue('Updated Title');
    await wrapper.find('[data-testid="edit-description-input"]').setValue('Updated Description');
    
    // Save changes
    await wrapper.find('[data-testid="save-edit-button"]').trigger('click');
    
    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')?.[0]).toEqual([
      mockTodo.id,
      {
        title: 'Updated Title',
        description: 'Updated Description',
      },
    ]);
  });

  it('cancels edit mode without emitting update', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });
    
    // Enter edit mode
    await wrapper.find('[data-testid="edit-button"]').trigger('click');
    
    // Update values
    await wrapper.find('[data-testid="edit-title-input"]').setValue('Updated Title');
    await wrapper.find('[data-testid="edit-description-input"]').setValue('Updated Description');
    
    // Cancel edit
    await wrapper.find('[data-testid="cancel-edit-button"]').trigger('click');
    
    expect(wrapper.emitted('update')).toBeFalsy();
    expect(wrapper.find('[data-testid="todo-title"]').text()).toBe(mockTodo.title);
  });

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });
    
    await wrapper.find('[data-testid="delete-button"]').trigger('click');
    
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0][0]).toBe(mockTodo.id);
  });

  it('disables all buttons when isLoading is true', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
        isLoading: true,
      },
    });
    
    const buttons = wrapper.findAll('button');
    buttons.forEach(button => {
      expect(button.attributes('disabled')).toBeDefined();
    });
  });
}); 