<template>
  <div class="room-selector-container">
    <label class="room-selector-label">
      Active Room ({{ store.totalRooms }} total)
    </label>
    
    <select 
      v-if="store.totalRooms > 0"
      v-model="store.activeRoom" 
      class="room-selector"
      @change="onRoomChange"
    >
      <option 
        v-for="[key, room] in Object.entries(store.projectData.rooms)" 
        :key="key" 
        :value="key"
      >
        {{ room.name || 'Unnamed Room' }}
      </option>
    </select>
    
    <div class="room-actions">
      <button class="room-action-btn" @click="addRoom" title="Add Room">
        + Add
      </button>
      <button class="room-action-btn" @click="store.showManagement = true" title="Manage Project & Rooms">
        ⚙️ Manage
      </button>
    </div>
    
    <div v-if="store.totalRooms > 0" class="room-progress-overview">
      <div class="room-progress-title">Room Progress Overview</div>
      <div 
        v-for="[key, room] in Object.entries(store.projectData.rooms)" 
        :key="key"
        class="room-progress-item"
      >
        <span class="room-progress-name">{{ room.name || 'Unnamed Room' }}</span>
        <span class="room-progress-value">{{ store.calculateRoomProgress(key).percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '../stores/main'
import { useRoomManagement } from '../composables/useRoomManagement'

const store = useMainStore()
const { addRoom } = useRoomManagement()

function onRoomChange() {
  store.activeSheet = 'in-house-commissioning'
  store.activeCategory = null
  store.saveToLocalStorage()
}
</script>
