<template>
  <div class="modal-overlay" @click="cancelImport">
    <div class="modal large" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">⬆️ Import Equipment Data Preview</h3>
      </div>
      <div class="modal-body">
        <div class="import-stats">
          <div class="import-stats-title">Import Summary</div>
          <div class="import-stats-text">
            {{ importData.length }} equipment items will be imported across {{ roomCount }} rooms:
            {{ roomSummary }}
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <strong>Data Preview (first 10 rows):</strong>
        </div>
        
        <div style="overflow-x: auto;">
          <table class="import-preview-table">
            <thead>
              <tr>
                <th v-for="header in headers" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in previewRows" :key="index">
                <td v-for="header in headers" :key="header">
                  {{ row[header] || '—' }}
                </td>
              </tr>
              <tr v-if="importData.length > 10" style="font-style: italic; color: #6b7280;">
                <td :colspan="headers.length">
                  ... and {{ importData.length - 10 }} more rows
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px;">
          <strong>Important:</strong>
          <ul style="margin: 8px 0 0 16px; color: #92400e;">
            <li>New rooms will be created automatically if they don't exist</li>
            <li>Equipment will be added to each room's Equipment List reference sheet</li>
            <li>Existing equipment will not be duplicated</li>
            <li>This action cannot be undone</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-button secondary" @click="cancelImport">
          Cancel Import
        </button>
        <button class="modal-button primary" @click="processImport">
          ✓ Import {{ importData.length }} Items
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/main'
import { useImportActions } from '../composables/useImportActions'

const store = useMainStore()
const { processImport, cancelImport } = useImportActions()

const importData = computed(() => store.importData || [])

const headers = computed(() => {
  return importData.value.length > 0 ? Object.keys(importData.value[0]) : []
})

const previewRows = computed(() => {
  return importData.value.slice(0, 10)
})

const roomCounts = computed(() => {
  const counts = {}
  importData.value.forEach(row => {
    const roomName = row.Room || row.room || 'Unknown'
    counts[roomName] = (counts[roomName] || 0) + 1
  })
  return counts
})

const roomCount = computed(() => {
  return Object.keys(roomCounts.value).length
})

const roomSummary = computed(() => {
  return Object.entries(roomCounts.value)
    .map(([room, count]) => `${room} (${count} items)`)
    .join(', ')
})
</script>
