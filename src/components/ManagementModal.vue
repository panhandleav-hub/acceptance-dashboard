<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal large" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Project & Room Management</h3>
      </div>
      <div class="modal-body">
        <!-- Project Information Section -->
        <div style="margin-bottom: 32px;">
          <h4 style="margin-bottom: 16px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
            Project Information
          </h4>
          <div class="form-group">
            <label class="form-label">Project Name</label>
            <input 
              type="text" 
              class="form-input"
              v-model="projectInfo.projectName"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Client Name</label>
            <input 
              type="text" 
              class="form-input"
              v-model="projectInfo.clientName"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Project Number</label>
            <input 
              type="text" 
              class="form-input"
              v-model="projectInfo.projectNumber"
            />
          </div>
        </div>

        <!-- Room Management Section -->
        <div>
          <h4 style="margin-bottom: 16px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
            Room Management
          </h4>
          <div style="margin-bottom: 16px;">
            <button class="modal-button primary" @click="roomManagement.addRoom()">
              + Add New Room
            </button>
          </div>
          
          <div>
            <div
              v-for="[key, room] in Object.entries(store.projectData.rooms)"
              :key="key"
              style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px;"
            >
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #111827;">
                  {{ room?.name || 'Unnamed Room' }}
                </div>
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                  {{ room?.description || 'No description' }}
                </div>
                <div style="font-size: 12px; color: #3b82f6;">
                  {{ store.calculateRoomProgress(key).percentage }}% complete
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button 
                  class="room-action-btn" 
                  @click="setActiveRoom(key)"
                  :style="{ background: store.activeRoom === key ? '#dbeafe' : 'white' }"
                >
                  {{ store.activeRoom === key ? 'Active' : 'Select' }}
                </button>
                <button 
                  v-if="canDeleteRoom"
                  class="room-action-btn" 
                  @click="roomManagement.deleteRoom(key)"
                  style="color: #dc2626;"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-button secondary" @click="closeModal">
          Close
        </button>
        <button class="modal-button primary" @click="saveAndClose">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useMainStore } from '../stores/main'
import { useRoomManagement } from '../composables/useRoomManagement'

const store = useMainStore()
const roomManagement = useRoomManagement()

// Local reactive copy of project info for editing
const projectInfo = reactive({
  projectName: store.projectData.projectInfo.projectName,
  clientName: store.projectData.projectInfo.clientName,
  projectNumber: store.projectData.projectInfo.projectNumber
})

const canDeleteRoom = computed(() => {
  return Object.keys(store.projectData.rooms).length > 1
})

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return
  store.showManagement = false
}

function setActiveRoom(roomKey) {
  store.activeRoom = roomKey
  store.activeSheet = 'in-house-commissioning'
  store.activeCategory = null
  store.saveToLocalStorage()
}

function saveAndClose() {
  // Update the store with the edited project info
  store.projectData.projectInfo.projectName = projectInfo.projectName
  store.projectData.projectInfo.clientName = projectInfo.clientName
  store.projectData.projectInfo.projectNumber = projectInfo.projectNumber
  
  store.saveToLocalStorage()
  store.showManagement = false
}
</script>
