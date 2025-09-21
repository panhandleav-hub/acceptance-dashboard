<!--
/**
 * EditableCell.vue - Inline Editable Table Cell
 * 
 * Provides inline editing functionality for reference data tables.
 * Handles the state transition between display and edit modes.
 * 
 * Features:
 * - Click to edit functionality
 * - Enter/Escape key handling
 * - Focus management
 * - Value persistence and cancellation
 * 
 * @component
 * @props {String} value - Current cell value
 * @props {String} cellKey - Unique identifier for edit state
 * @emits {String} update - Emitted when value changes
 * 
 * @example
 * <EditableCell 
 *   :value="cellValue"
 *   :cell-key="uniqueKey"
 *   @update="handleUpdate"
 * />
 */
-->
<template>
  <div>
    <!-- Edit mode: Input field with auto-focus -->
    <input 
      v-if="isEditing"
      ref="inputRef"
      type="text" 
      class="cell-input"
      :value="value"
      @input="$emit('update', $event.target.value)"
      @blur="stopEditing"
      @keydown.enter="stopEditing"
      @keydown.escape="cancelEdit"
    />
    
    <!-- Display mode: Clickable cell content -->
    <div 
      v-else
      class="editable-cell"
      @click="startEditing"
    >
      {{ value || '—' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useMainStore } from '../stores/main'

// Component props
const props = defineProps({
  value: String,    // Current cell value to display/edit
  cellKey: String   // Unique identifier used for edit state tracking
})

// Component events
const emit = defineEmits(['update'])

const store = useMainStore()
const inputRef = ref(null)           // Reference to input element for focus management
const originalValue = ref('')       // Backup of value for cancel functionality

/**
 * Computed property to determine if this cell is currently being edited
 * Uses the global editing state from the store to ensure only one cell
 * can be edited at a time across the entire application.
 */
const isEditing = computed(() => {
  return store.editingCell === props.cellKey
})

/**
 * Enter edit mode for this cell
 * 
 * - Backs up current value for cancel functionality
 * - Sets global edit state to this cell's key
 * - Focuses the input field after DOM update
 */
async function startEditing() {
  originalValue.value = props.value
  store.editingCell = props.cellKey
  
  // Wait for DOM update before focusing
  await nextTick()
  inputRef.value?.focus()
}

/**
 * Exit edit mode and save changes
 * Simply clears the global edit state - the parent component
 * handles the actual value saving through the @input event.
 */
function stopEditing() {
  store.editingCell = null
}

/**
 * Cancel edit and restore original value
 * 
 * Emits the original value to revert any changes,
 * then exits edit mode.
 */
function cancelEdit() {
  emit('update', originalValue.value)
  store.editingCell = null
}
</script>
