<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '../api';

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
  <li :class="{ completed: todo.completed }" data-testid="todo-item">
    <div v-if="isEditing" class="edit-form">
      <input
        type="text"
        v-model="editName"
        required
        data-testid="edit-name-input"
      />
      <input
        type="text"
        v-model="editDescription"
        data-testid="edit-description-input"
      />
      <button
        @click="saveEdit"
        :disabled="isLoading"
        data-testid="save-edit-button"
      >
        Save
      </button>
      <button
        @click="cancelEditing"
        :disabled="isLoading"
        data-testid="cancel-edit-button"
      >
        Cancel
      </button>
    </div>
    <div v-else class="view-mode">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="emit('toggle', todo)"
        :disabled="isLoading"
        data-testid="todo-checkbox"
      />
      <span class="todo-name" data-testid="todo-name">{{ todo.name }}</span>
      <span
        v-if="todo.description"
        class="todo-description"
        data-testid="todo-description"
      >
        - {{ todo.description }}
      </span>
      <div class="actions">
        <button
          @click="startEditing"
          :disabled="isLoading"
          data-testid="edit-button"
        >
          Edit
        </button>
        <button
          @click="emit('delete', todo.id)"
          :disabled="isLoading"
          data-testid="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.todo-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.completed {
  background-color: #f5f5f5;
}

.completed .todo-name,
.completed .todo-description {
  text-decoration: line-through;
  color: #999;
}

.view-mode {
  display: flex;
  align-items: center;
  width: 100%;
}

input[type="checkbox"] {
  margin-right: 0.75rem;
  cursor: pointer;
}

.todo-name {
  font-weight: bold;
  flex-grow: 1;
  margin-right: 0.5rem;
}

.todo-description {
  color: #666;
  font-size: 0.9em;
  flex-grow: 2;
  margin-right: 1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.actions button {
  padding: 0.25rem 0.5rem;
  font-size: 0.8em;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  transition: background-color 0.2s, border-color 0.2s;
}

.actions button:hover {
  background-color: #f0f0f0;
  border-color: #bbb;
}

.actions button:disabled {
  background-color: #eee;
  color: #aaa;
  border-color: #ddd;
  cursor: not-allowed;
}

.edit-form {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.edit-form input[type="text"] {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-form button {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  border: none;
}

.edit-form button:first-of-type {
  background-color: #2196F3;
  color: white;
}

.edit-form button:first-of-type:hover {
  background-color: #1e88e5;
}

.edit-form button:last-of-type {
  background-color: #f44336;
  color: white;
}

.edit-form button:last-of-type:hover {
  background-color: #e53935;
}

.edit-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 