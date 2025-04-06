<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '@buf-explorations/protos/gen/ts/v1/todo_pb';

const props = defineProps<{
  todo: Todo;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update', id: string, updates: { name: string; description: string }): void;
  (e: 'delete', id: string): void;
  (e: 'toggle', todo: Todo): void;
}>();

const isEditing = ref(false);
const editName = ref(props.todo.name);
const editDescription = ref(props.todo.description);

const startEditing = () => {
  editName.value = props.todo.name;
  editDescription.value = props.todo.description;
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveEdit = () => {
  if (!editName.value.trim()) return;
  
  emit('update', props.todo.id, {
    name: editName.value,
    description: editDescription.value,
  });
  
  isEditing.value = false;
};
</script>

<template>
  <li :class="['todo-item', { completed: todo.completed }]" data-testid="todo-item">
    <div v-if="isEditing" class="edit-form">
      <div class="edit-fields">
        <input
          type="text"
          v-model="editName"
          required
          placeholder="Todo name"
          data-testid="edit-name-input"
        />
        <input
          type="text"
          v-model="editDescription"
          placeholder="Description (optional)"
          data-testid="edit-description-input"
        />
      </div>
      <div class="edit-actions">
        <button
          @click="saveEdit"
          :disabled="isLoading"
          class="save-button"
          data-testid="save-edit-button"
        >
          Save
        </button>
        <button
          @click="cancelEditing"
          :disabled="isLoading"
          class="cancel-button"
          data-testid="cancel-edit-button"
        >
          Cancel
        </button>
      </div>
    </div>
    <div v-else class="view-mode">
      <div class="todo-content">
        <label class="checkbox-wrapper">
          <input
            type="checkbox"
            class="checkbox"
            :checked="todo.completed"
            @change="emit('toggle', todo)"
            :disabled="isLoading"
            data-testid="todo-checkbox"
          />
          <span class="checkmark"></span>
        </label>
        <div class="todo-text">
          <span class="todo-name" data-testid="todo-name">{{ todo.name }}</span>
          <span
            v-if="todo.description"
            class="todo-description"
            data-testid="todo-description"
          >
            {{ todo.description }}
          </span>
        </div>
      </div>
      <div class="actions">
        <button
          @click="startEditing"
          :disabled="isLoading"
          class="edit-button"
          data-testid="edit-button"
        >
          Edit
        </button>
        <button
          @click="emit('delete', todo.id)"
          :disabled="isLoading"
          class="delete-button"
          data-testid="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  position: relative;
  margin: 0.75rem 0;
  padding: 1rem 1.25rem;
  background: rgba(255,255,255,0.8);
  border-radius: 10px;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.05),
    0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid #4CAF50;
  backdrop-filter: blur(5px);
}

.todo-item:hover {
  transform: translateX(4px);
  background: rgba(255,255,255,0.9);
  box-shadow:
    0 4px 8px rgba(0,0,0,0.08),
    0 2px 4px rgba(0,0,0,0.08);
}

.todo-item.completed {
  border-left-color: #9e9e9e;
  background: rgba(255,255,255,0.6);
}

.view-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.checkbox-wrapper {
  position: relative;
  display: inline-block;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 22px;
  width: 22px;
  background: rgba(255,255,255,0.9);
  border: 2px solid #4CAF50;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    inset 0 1px 2px rgba(0,0,0,0.05),
    0 1px 0 rgba(255,255,255,0.5);
}

.checkbox:checked ~ .checkmark {
  background: #4CAF50;
  border-color: #4CAF50;
  box-shadow:
    inset 0 1px 2px rgba(0,0,0,0.1),
    0 1px 0 rgba(255,255,255,0.2);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox:checked ~ .checkmark:after {
  display: block;
  animation: checkmark 0.2s ease-in-out;
}

@keyframes checkmark {
  0% { transform: rotate(45deg) scale(0); }
  100% { transform: rotate(45deg) scale(1); }
}

.todo-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.todo-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ink-color);
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  transition: all 0.3s ease;
}

.completed .todo-name {
  text-decoration: line-through;
  color: #9e9e9e;
}

.todo-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.completed .todo-description {
  color: #999;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.actions button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.actions button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, 
    rgba(255,255,255,0.2) 0%,
    transparent 100%
  );
  border-radius: 6px 6px 0 0;
}

.edit-button {
  color: #fff;
  background: linear-gradient(to bottom, #42a5f5 0%, #2196F3 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 1px 2px rgba(33,150,243,0.2);
  text-shadow: 0 -1px 0 rgba(0,0,0,0.1);
}

.edit-button:hover {
  background: linear-gradient(to bottom, #64b5f6 0%, #2196F3 100%);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 4px 8px rgba(33,150,243,0.3);
}

.delete-button {
  color: #fff;
  background: linear-gradient(to bottom, #ef5350 0%, #e53935 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 1px 2px rgba(244,67,54,0.2);
  text-shadow: 0 -1px 0 rgba(0,0,0,0.1);
}

.delete-button:hover {
  background: linear-gradient(to bottom, #ef5350 0%, #d32f2f 100%);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 4px 8px rgba(244,67,54,0.3);
}

.actions button:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.1),
    0 1px 2px rgba(0,0,0,0.05);
}

.actions button:disabled {
  background: linear-gradient(to bottom, #e0e0e0 0%, #d5d5d5 100%);
  cursor: not-allowed;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 1px 2px rgba(0,0,0,0.05);
  opacity: 0.7;
  transform: none;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-form input[type="text"] {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--ink-color);
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(255,255,255,0.9);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.05),
    0 1px 0 rgba(255,255,255,0.5);
  transition: all 0.3s ease;
  font-family: system-ui, -apple-system, sans-serif;
}

.edit-form input[type="text"]:focus {
  outline: none;
  border-color: #2196F3;
  background: #ffffff;
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.02),
    0 0 0 3px rgba(33,150,243,0.1);
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.save-button {
  color: #fff;
  background: linear-gradient(to bottom, #66bb6a 0%, #4CAF50 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 1px 2px rgba(76,175,80,0.2);
  text-shadow: 0 -1px 0 rgba(0,0,0,0.1);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button:hover {
  background: linear-gradient(to bottom, #75c378 0%, #43a047 100%);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 4px 8px rgba(76,175,80,0.3);
}

.cancel-button {
  color: #fff;
  background: linear-gradient(to bottom, #ef5350 0%, #e53935 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 1px 2px rgba(244,67,54,0.2);
  text-shadow: 0 -1px 0 rgba(0,0,0,0.1);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background: linear-gradient(to bottom, #ef5350 0%, #d32f2f 100%);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 4px 8px rgba(244,67,54,0.3);
}
</style> 