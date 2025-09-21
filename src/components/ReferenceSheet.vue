<template>
  <div>
    <div class="content-header">
      <div class="header-row">
        <div>
          <h2>
            {{ currentSheet?.title || 'Unnamed Sheet' }}
            <span class="room-badge">
              🏠 {{ store.getCurrentRoom?.name || 'Unknown Room' }}
            </span>
          </h2>
          <p>{{ currentSheet?.description || 'No description' }}</p>
        </div>
        <div class="header-stats">
          <div class="header-stats-value">{{ sheetData.length }}</div>
          <div class="header-stats-label">Entries</div>
        </div>
      </div>
    </div>

    <div class="content-body">
      <div class="reference-table">
        <div class="table-header">
          <div>
            <h3 class="table-title">{{ currentSheet?.title || 'Unnamed Sheet' }}</h3>
            <p class="table-description">{{ currentSheet?.description || 'No description' }}</p>
          </div>
          <button class="add-row-button" @click="addRow">
            + Add Row
          </button>
        </div>
        
        <div class="table-container">
          <table class="reference-data-table">
            <thead>
              <tr>
                <th v-for="header in headers" :key="header">{{ header }}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filteredData" :key="row.id">
                <td v-for="header in headers" :key="header">
                  <EditableCell
                    :value="getFieldValue(row, header)"
                    :cell-key="getCellKey(row, header)"
                    @update="updateCell(row.id, header, $event)"
                  />
                </td>
                <td>
                  <button 
                    class="delete-button"
                    @click="deleteRow(row.id)"
                    title="Delete row"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="table-footer">
          Total entries: {{ sheetData.length }}
          <span v-if="sheetKey === 'equipment'">
            • Use the "Import Equipment" button in the sidebar to bulk import from CSV or Excel
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/main'
import EditableCell from './EditableCell.vue'

const props = defineProps({
  sheetKey: {
    type: String,
    required: true
  }
})

const store = useMainStore()

const currentSheet = computed(() => {
  return store.getCurrentReferenceData[props.sheetKey]
})

const sheetData = computed(() => {
  return currentSheet.value?.data || []
})

const headers = computed(() => {
  return currentSheet.value?.headers || []
})

const filteredData = computed(() => {
  if (!store.searchTerm) return sheetData.value
  
  const searchLower = store.searchTerm.toLowerCase()
  return sheetData.value.filter(row => 
    Object.values(row || {}).some(value => 
      (value || '').toString().toLowerCase().includes(searchLower)
    )
  )
})

function getFieldValue(row, header) {
  const fieldKey = store.getFieldKey(header)
  return (row && row[fieldKey]) || ''
}

function getCellKey(row, header) {
  const fieldKey = store.getFieldKey(header)
  return `${store.activeRoom}-${props.sheetKey}-${row?.id || 'unknown'}-${fieldKey}`
}

function updateCell(rowId, header, value) {
  const fieldKey = store.getFieldKey(header)
  store.updateReferenceData(store.activeRoom, props.sheetKey, rowId, fieldKey, value)
}

function addRow() {
  store.addReferenceRow(store.activeRoom, props.sheetKey)
}

function deleteRow(rowId) {
  store.deleteReferenceRow(store.activeRoom, props.sheetKey, rowId)
}
</script>
