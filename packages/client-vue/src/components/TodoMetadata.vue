<template>
  <div v-if="metadata" class="todo-metadata">
    <div v-if="isMeetingMetadata" class="meeting-metadata">
      <h4>Meeting Details</h4>
      <div class="metadata-content">
        <p><strong>Link:</strong> <a :href="meetingData?.meetingLink" target="_blank">Join Meeting</a></p>
        <p><strong>Attendees:</strong> {{ meetingData?.attendees.join(', ') }}</p>
        <p><strong>Agenda:</strong> {{ meetingData?.agenda }}</p>
      </div>
    </div>

    <div v-else-if="isDeadlineMetadata" class="deadline-metadata">
      <h4>Deadline Details</h4>
      <div class="metadata-content">
        <p><strong>Priority:</strong> {{ formatPriority(deadlineData?.priority) }}</p>
        <p><strong>Project:</strong> {{ deadlineData?.project }}</p>
        <p><strong>Deadline:</strong> {{ formatDate(deadlineData?.deadline) }}</p>
      </div>
    </div>

    <div v-else-if="isShoppingMetadata" class="shopping-metadata">
      <h4>Shopping Details</h4>
      <div class="metadata-content">
        <p><strong>Quantity:</strong> {{ shoppingData?.quantity }}</p>
        <p><strong>Price:</strong> ${{ shoppingData?.price.toFixed(2) }}</p>
        <p><strong>Store:</strong> {{ shoppingData?.store }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Any } from '@bufbuild/protobuf/wkt';
import { anyUnpack } from '@bufbuild/protobuf/wkt';

import {
  DeadlineMetadata_Priority,
  MeetingMetadataSchema,
  DeadlineMetadataSchema,
  ShoppingMetadataSchema
} from '@buf-explorations/protos/gen/ts/v1/todo_pb';

const props = defineProps<{
  metadata?: Any;
}>();

const formatDate = (timestamp: { seconds: bigint; nanos: number } | undefined) => {
  if (!timestamp) return 'N/A';
  const date = new Date(Number(timestamp.seconds) * 1000 + Math.floor(timestamp.nanos / 1000000));
  return date.toLocaleString();
};

const formatPriority = (priority: DeadlineMetadata_Priority | undefined) => {
  switch (priority) {
    case DeadlineMetadata_Priority.LOW:
      return 'Low';
    case DeadlineMetadata_Priority.MEDIUM:
      return 'Medium';
    case DeadlineMetadata_Priority.HIGH:
      return 'High';
    default:
      return 'Unspecified';
  }
};

const isMeetingMetadata = computed(() => {
  console.log('Metadata type URL:', props.metadata?.typeUrl);
  return props.metadata?.typeUrl === 'type.googleapis.com/todo.v1.MeetingMetadata';
});
const isDeadlineMetadata = computed(() => props.metadata?.typeUrl === 'type.googleapis.com/todo.v1.DeadlineMetadata');
const isShoppingMetadata = computed(() => props.metadata?.typeUrl === 'type.googleapis.com/todo.v1.ShoppingMetadata');

const meetingData = computed(() => {
  if (!isMeetingMetadata.value || !props.metadata) return null;
  try {
    console.log('Attempting to unpack meeting metadata:', props.metadata);
    const unpacked = anyUnpack(props.metadata, MeetingMetadataSchema);
    console.log('Successfully unpacked meeting metadata:', unpacked);
    return unpacked;
  } catch (e) {
    console.error('Failed to parse meeting metadata:', e);
    console.error('Metadata value:', props.metadata.value);
    return null;
  }
});

const deadlineData = computed(() => {
  if (!isDeadlineMetadata.value || !props.metadata) return null;
  try {
    console.log('Attempting to unpack deadline metadata:', props.metadata);
    const unpacked = anyUnpack(props.metadata, DeadlineMetadataSchema);
    console.log('Successfully unpacked deadline metadata:', unpacked);
    return unpacked;
  } catch (e) {
    console.error('Failed to parse deadline metadata:', e);
    console.error('Metadata value:', props.metadata.value);
    return null;
  }
});

const shoppingData = computed(() => {
  if (!isShoppingMetadata.value || !props.metadata) return null;
  try {
    console.log('Attempting to unpack shopping metadata:', props.metadata);
    const unpacked = anyUnpack(props.metadata, ShoppingMetadataSchema);
    console.log('Successfully unpacked shopping metadata:', unpacked);
    return unpacked;
  } catch (e) {
    console.error('Failed to parse shopping metadata:', e);
    console.error('Metadata value:', props.metadata.value);
    return null;
  }
});
</script>

<style scoped>
.todo-metadata {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(101,67,33,0.03);
  border-radius: 4px;
  border: 1px solid rgba(101,67,33,0.1);
}

h4 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: rgba(44,24,16,0.8);
  font-family: 'Palatino', serif;
}

.metadata-content {
  font-size: 0.85rem;
  color: rgba(44,24,16,0.7);
}

.metadata-content p {
  margin: 0.25rem 0;
}

.metadata-content strong {
  color: rgba(44,24,16,0.9);
}

a {
  color: #2196F3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style> 