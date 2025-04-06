<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'submit', todo: { name: string; description: string }): void;
}>();

const name = ref('');
const description = ref('');

const onSubmit = () => {
  if (!name.value.trim()) return;
  
  emit('submit', {
    name: name.value,
    description: description.value,
  });
  
  // Reset form
  name.value = '';
  description.value = '';
};

defineProps<{
  isLoading?: boolean;
}>();
</script>

<template>
  <form @submit.prevent="onSubmit" class="add-todo-form" data-testid="todo-form">
    <input
      type="text"
      v-model="name"
      placeholder="Todo name"
      required
      data-testid="todo-name-input"
    />
    <input
      type="text"
      v-model="description"
      placeholder="Description (optional)"
      data-testid="todo-description-input"
    />
    <button type="submit" :disabled="isLoading" data-testid="todo-submit-button">
      Add Todo
    </button>
  </form>
</template>

<style scoped>
.add-todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-todo-form input[type="text"] {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-todo-form button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-todo-form button:hover {
  background-color: #45a049;
}

.add-todo-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 