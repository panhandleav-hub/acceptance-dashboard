<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #6b7280; text-align: center;">
    <h2>No Test Sheet Available</h2>
    <p>
      Sheet "{{ store.activeSheet }}" not found for this room
      <template v-if="store.getCurrentRoom">: {{ store.getCurrentRoom.name }}</template>.
    </p>
  </div>
</template>

<script setup>
import { useMainStore } from '../stores/main'

const store = useMainStore()
</script>
