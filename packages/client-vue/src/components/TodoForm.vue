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
  gap: 1.5rem;
  margin: 1rem 0;
  position: relative;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.add-todo-form input[type="text"] {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: var(--ink-color);
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(255,255,255,0.8);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.05),
    0 1px 0 rgba(255,255,255,0.5);
  transition: all 0.3s ease;
  font-family: system-ui, -apple-system, sans-serif;
  backdrop-filter: blur(5px);
}

.add-todo-form input[type="text"]:hover {
  background: rgba(255,255,255,0.9);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.05),
    0 2px 4px rgba(0,0,0,0.05);
}

.add-todo-form input[type="text"]:focus {
  outline: none;
  border-color: #4CAF50;
  background: #ffffff;
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.02),
    0 0 0 3px rgba(76,175,80,0.1);
}

.add-todo-form button {
  align-self: flex-end;
  min-width: 140px;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(to bottom, #66bb6a 0%, #4CAF50 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 2px 4px rgba(76,175,80,0.2),
    0 1px 2px rgba(0,0,0,0.05);
  text-shadow: 0 -1px 0 rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.add-todo-form button::before {
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
  border-radius: 8px 8px 0 0;
}

.add-todo-form button:hover {
  background: linear-gradient(to bottom, #75c378 0%, #43a047 100%);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 4px 8px rgba(76,175,80,0.3),
    0 1px 3px rgba(0,0,0,0.1);
}

.add-todo-form button:active {
  transform: translateY(1px);
  background: linear-gradient(to top, #66bb6a 0%, #4CAF50 100%);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.1),
    0 1px 2px rgba(0,0,0,0.05);
}

.add-todo-form button:disabled {
  background: linear-gradient(to bottom, #e0e0e0 0%, #d5d5d5 100%);
  cursor: not-allowed;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 1px 2px rgba(0,0,0,0.05);
  opacity: 0.7;
  transform: none;
}

/* Placeholder styling */
.add-todo-form input[type="text"]::placeholder {
  color: #999;
  font-style: italic;
  transition: color 0.3s ease;
}

.add-todo-form input[type="text"]:focus::placeholder {
  color: #bbb;
}

/* Loading state animation */
.add-todo-form button:disabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.1) 50%,
    transparent 100%
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style> 