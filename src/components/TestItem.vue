<!--
/**
 * TestItem.vue - Individual Test Item Component
 * 
 * Renders a single test item within a category, including:
 * - Status indicator with visual icon
 * - Test information (ID, title, description)
 * - Status buttons (Pass/Fail/N/A)
 * - Input fields for notes, initials, and owner
 * - Automatic date tracking on status changes
 * 
 * @component
 * @props {Object} item - The test item data object
 * @props {Number} categoryId - The parent category ID
 * @props {String} roomKey - The room identifier
 * @props {String} sheetKey - The test sheet identifier
 * 
 * @example
 * <TestItem 
 *   :item="testItem"
 *   :category-id="1"
 *   room-key="board-room"
 *   sheet-key="in-house-commissioning"
 * />
 */
-->
<template>
  <div class="test-item">
    <div class="test-item-header">
      <!-- Status indicator with dynamic icon and styling -->
      <div :class="['status-icon', item?.status || 'pending']">
        {{ getStatusIcon() }}
      </div>
      
      <div class="test-item-content">
        <div class="test-item-id-title">
          <span class="test-item-id">{{ item?.id || 'N/A' }}</span>
          <h4 class="test-item-title">{{ item?.title || 'Untitled Item' }}</h4>
        </div>
        <p class="test-item-description">{{ item?.description || 'No description' }}</p>
        
        <div class="status-buttons">
          <button
            v-for="status in ['pass', 'fail', 'na']"
            :key="status"
            :class="[
              'status-button',
              status,
              { active: (item?.status || 'pending') === status }
            ]"
            @click="updateStatus(status)"
          >
            {{ status.toUpperCase() }}
          </button>
        </div>
        
        <div class="test-inputs">
          <input 
            type="text" 
            placeholder="Notes..." 
            class="test-input"
            :value="item?.notes || ''"
            @input="updateField('notes', $event.target.value)"
          />
          <input 
            type="text" 
            placeholder="Initials" 
            class="test-input"
            :value="item?.initials || ''"
            @input="updateField('initials', $event.target.value)"
          />
          <input 
            type="text" 
            placeholder="Owner" 
            class="test-input"
            :value="item?.owner || ''"
            @input="updateField('owner', $event.target.value)"
          />
        </div>
        
        <div v-if="item?.date" class="test-date">
          Updated: {{ item.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '../stores/main'

// Define component props with validation
const props = defineProps({
  item: Object,        // Test item data object
  categoryId: Number,  // Parent category identifier
  roomKey: String,     // Room identifier for updates
  sheetKey: String     // Sheet identifier for updates
})

const store = useMainStore()

/**
 * Get the appropriate icon for the current status
 * 
 * Maps test item status to visual indicators:
 * - pass: checkmark (✓)
 * - fail: warning triangle (⚠)
 * - na: dash (—) for not applicable
 * - pending/default: clock (⏰)
 * 
 * @returns {string} Unicode icon character
 */
function getStatusIcon() {
  switch (props.item?.status) {
    case 'pass': return '✓'
    case 'fail': return '⚠'
    case 'na': return '—'
    default: return '⏰'
  }
}

/**
 * Update the test item status and trigger auto-save
 * Convenience wrapper for updateField with status-specific logic
 * 
 * @param {string} status - New status value (pass/fail/na)
 */
function updateStatus(status) {
  updateField('status', status)
}

/**
 * Update any field of the test item
 * 
 * Calls the store's updateTestItem method which handles:
 * - Finding the correct item in the data structure
 * - Updating the specified field
 * - Auto-timestamping on status changes
 * - Saving to localStorage
 * 
 * @param {string} field - Field name to update
 * @param {any} value - New value for the field
 */
function updateField(field, value) {
  store.updateTestItem(
    props.roomKey,
    props.sheetKey,
    props.categoryId,
    props.item?.id || '',
    field,
    value
  )
}
</script>
