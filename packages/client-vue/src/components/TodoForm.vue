<script setup lang="ts">
import { ref } from 'vue';
import { create } from '@bufbuild/protobuf';
import { anyPack } from '@bufbuild/protobuf/wkt';
import type { Any } from '@bufbuild/protobuf/wkt';
import type { Todo } from '@buf-explorations/protos/gen/ts/v1/todo_pb';
import { 
  DeadlineMetadata_Priority,
  MeetingMetadataSchema,
  DeadlineMetadataSchema,
  ShoppingMetadataSchema,
} from '@buf-explorations/protos/gen/ts/v1/todo_pb';

type TodoInput = Pick<Todo, "name" | "description">;

const emit = defineEmits<{
  (e: 'submit', todo: TodoInput & { metadata?: Any }): void;
}>();

const name = ref('');
const description = ref('');
const metadataType = ref<'none' | 'meeting' | 'deadline' | 'shopping'>('none');

// Meeting metadata fields
const meetingLink = ref('');
const attendees = ref('');
const agenda = ref('');

// Deadline metadata fields
const priority = ref<'UNSPECIFIED' | 'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
const project = ref('');
const deadline = ref('');

// Shopping metadata fields
const quantity = ref(1);
const price = ref(0);
const store = ref('');

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
];

const createMetadata = () => {
  if (metadataType.value === 'none') return undefined;

  switch (metadataType.value) {
    case 'meeting': {
      const meetingMetadata = create(MeetingMetadataSchema, {
        meetingLink: meetingLink.value,
        attendees: attendees.value.split(',').map(a => a.trim()).filter(Boolean),
        agenda: agenda.value
      });
      return anyPack(MeetingMetadataSchema, meetingMetadata);
    }
    case 'deadline': {
      const deadlineDate = new Date(deadline.value);
      const deadlineMetadata = create(DeadlineMetadataSchema, {
        priority: DeadlineMetadata_Priority[priority.value],
        project: project.value,
        deadline: {
          seconds: BigInt(Math.floor(deadlineDate.getTime() / 1000)),
          nanos: (deadlineDate.getTime() % 1000) * 1_000_000
        }
      });
      return anyPack(DeadlineMetadataSchema, deadlineMetadata);
    }
    case 'shopping': {
      const shoppingMetadata = create(ShoppingMetadataSchema, {
        quantity: quantity.value,
        price: price.value,
        store: store.value
      });
      return anyPack(ShoppingMetadataSchema, shoppingMetadata);
    }
  }
  return undefined;
};

const resetMetadataFields = () => {
  meetingLink.value = '';
  attendees.value = '';
  agenda.value = '';
  priority.value = 'MEDIUM';
  project.value = '';
  deadline.value = '';
  quantity.value = 1;
  price.value = 0;
  store.value = '';
};

const onSubmit = () => {
  if (!name.value.trim()) return;
  
  emit('submit', {
    name: name.value,
    description: description.value,
    metadata: createMetadata()
  });
  
  // Reset form
  name.value = '';
  description.value = '';
  metadataType.value = 'none';
  resetMetadataFields();
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
      
      <div class="metadata-section">
        <select v-model="metadataType" class="metadata-type-select">
          <option value="none">No Metadata</option>
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
          <option value="shopping">Shopping</option>
        </select>

        <!-- Meeting Metadata Fields -->
        <div v-if="metadataType === 'meeting'" class="metadata-fields">
          <input
            type="url"
            v-model="meetingLink"
            placeholder="Meeting Link"
          />
          <input
            type="text"
            v-model="attendees"
            placeholder="Attendees (comma-separated)"
          />
          <textarea
            v-model="agenda"
            placeholder="Meeting Agenda"
          ></textarea>
        </div>

        <!-- Deadline Metadata Fields -->
        <div v-if="metadataType === 'deadline'" class="metadata-fields">
          <select v-model="priority">
            <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <input
            type="text"
            v-model="project"
            placeholder="Project Name"
          />
          <input
            type="datetime-local"
            v-model="deadline"
          />
        </div>

        <!-- Shopping Metadata Fields -->
        <div v-if="metadataType === 'shopping'" class="metadata-fields">
          <input
            type="number"
            v-model="quantity"
            min="1"
            placeholder="Quantity"
          />
          <input
            type="number"
            v-model="price"
            min="0"
            step="0.01"
            placeholder="Price"
          />
          <input
            type="text"
            v-model="store"
            placeholder="Store Name"
          />
        </div>
      </div>
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

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metadata-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.metadata-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}

input[type="text"],
input[type="url"],
input[type="number"],
input[type="datetime-local"],
textarea,
select {
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

input[type="datetime-local"] {
  color-scheme: dark;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

input::placeholder,
textarea::placeholder,
select::placeholder {
  color: rgba(255,255,255,0.4);
}

input:hover,
textarea:hover,
select:hover {
  background: rgba(0,0,0,0.25);
}

input:focus,
textarea:focus,
select:focus {
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