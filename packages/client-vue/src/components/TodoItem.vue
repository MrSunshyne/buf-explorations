<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '@buf-explorations/protos/gen/ts/v1/todo_pb';
import TodoMetadata from './TodoMetadata.vue';

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
          <TodoMetadata v-if="todo.metadata" :metadata="todo.metadata" />
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
  padding: 0.75rem 0;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(101,67,33,0.1);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: rgba(101,67,33,0.03);
}

.todo-item.completed {
  color: rgba(44,24,16,0.5);
}

.todo-item.completed .todo-name {
  text-decoration: line-through;
  text-decoration-color: rgba(44,24,16,0.3);
  text-decoration-thickness: 1px;
}

.view-mode {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0 0.5rem;
}

.checkbox {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.25rem;
}

.checkbox input[type="checkbox"] {
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
  height: 1.25rem;
  width: 1.25rem;
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(101,67,33,0.3);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.checkbox:hover input ~ .checkmark {
  background: rgba(255,255,255,0.7);
}

.checkbox input:checked ~ .checkmark {
  background: rgba(101,67,33,0.1);
  border-color: rgba(101,67,33,0.4);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid rgba(101,67,33,0.8);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox input:checked ~ .checkmark:after {
  display: block;
}

.todo-content {
  flex: 1;
  min-width: 0;
  font-family: 'Palatino', serif;
}

.todo-name {
  margin: 0;
  font-size: 1.1rem;
  color: var(--ink-color);
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.todo-description {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  color: rgba(44,24,16,0.7);
  line-height: 1.5;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.todo-item:hover .actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  color: rgba(101,67,33,0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.action-btn:hover {
  color: rgba(101,67,33,0.9);
  background: rgba(101,67,33,0.1);
}

.action-btn:active {
  transform: translateY(1px);
}

.delete-btn {
  color: rgba(220,53,69,0.6);
}

.delete-btn:hover {
  color: rgba(220,53,69,0.9);
  background: rgba(220,53,69,0.1);
}

.edit-mode {
  padding: 1rem;
  background: rgba(255,255,255,0.5);
  border-radius: 4px;
  box-shadow: 
    inset 0 1px 3px rgba(0,0,0,0.1),
    0 1px 2px rgba(255,255,255,0.5);
}

.edit-mode input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(101,67,33,0.2);
  border-radius: 4px;
  background: rgba(255,255,255,0.8);
  color: var(--ink-color);
  font-family: 'Palatino', serif;
  font-size: 1rem;
}

.edit-mode input[type="text"]:focus {
  outline: none;
  border-color: rgba(101,67,33,0.4);
  box-shadow: 0 0 0 2px rgba(101,67,33,0.1);
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.edit-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-family: 'Palatino', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn {
  background: rgba(101,67,33,0.1);
  color: rgba(101,67,33,0.9);
}

.save-btn:hover {
  background: rgba(101,67,33,0.2);
}

.cancel-btn {
  background: rgba(108,117,125,0.1);
  color: rgba(108,117,125,0.9);
}

.cancel-btn:hover {
  background: rgba(108,117,125,0.2);
}
</style> 