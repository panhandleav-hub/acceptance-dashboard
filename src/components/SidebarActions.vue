<template>
  <div class="sidebar-actions">
    <button class="action-button" @click="exportActions.exportToExcel()">
      📊 Export Excel
    </button>
    <button class="action-button secondary" @click="exportActions.exportToCSV()">
      ⬇️ Export CSV
    </button>
    <button class="action-button secondary" @click="exportActions.exportEquipmentTemplate()">
      📋 Template CSV
    </button>
    <button class="action-button secondary" @click="importActions.importEquipmentData()">
      ⬆️ Import Equipment
    </button>
    <button class="action-button danger" @click="roomManagement.clearAllData()">
      🧹 Clear All Data
    </button>
  </div>
</template>

<script setup>
import { useRoomManagement } from '../composables/useRoomManagement'
import { useExportActions } from '../composables/useExportActions'
import { useImportActions } from '../composables/useImportActions'

const roomManagement = useRoomManagement()
const exportActions = useExportActions()
const importActions = useImportActions()
</script>
