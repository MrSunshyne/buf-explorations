<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '@buf-explorations/protos/gen/ts/v1/todo_pb';

type TodoInput = Pick<Todo, "name" | "description">;

const emit = defineEmits<{
  (e: 'submit', todo: TodoInput): void;
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
    <div class="form-fields">
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
    </div>
    <button type="submit" :disabled="isLoading" data-testid="todo-submit-button">
      Add Todo
    </button>
  </form>
</template>

<style scoped>
.add-todo-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(0,0,0,0.2);
  color: rgba(255,255,255,0.9);
  font-family: 'Palatino', serif;
  font-size: 1rem;
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.3),
    0 1px 1px rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

input[type="text"]::placeholder,
textarea::placeholder {
  color: rgba(255,255,255,0.4);
}

input[type="text"]:hover,
textarea:hover {
  background: rgba(0,0,0,0.25);
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  background: rgba(0,0,0,0.3);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.4),
    0 0 0 2px rgba(255,255,255,0.1);
}

textarea {
  min-height: 100px;
  resize: vertical;
  line-height: 1.5;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.15),
    rgba(255,255,255,0.1)
  );
  color: rgba(255,255,255,0.9);
  font-family: 'Palatino', serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.1),
    0 2px 4px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255,255,255,0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

button:hover {
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.2),
    rgba(255,255,255,0.15)
  );
}

button:hover::before {
  transform: translateX(100%);
}

button:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.1),
    0 1px 2px rgba(0,0,0,0.3);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:disabled::before {
  display: none;
}

.loading {
  position: relative;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.5rem;
  height: 1.5rem;
  margin: -0.75rem 0 0 -0.75rem;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: rgba(255,255,255,0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 