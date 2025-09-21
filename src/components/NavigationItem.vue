<template>
  <button 
    :class="[
      'nav-item',
      { active: isActive },
      type
    ]"
    @click="$emit('click')"
  >
    <div class="nav-item-header">
      <span class="nav-item-icon">{{ getIcon() }}</span>
      <span class="nav-item-percentage">
        {{ getDisplayValue() }}
      </span>
    </div>
    <div class="nav-item-title">{{ sheet?.title || 'Unnamed Sheet' }}</div>
    <div class="nav-item-description">{{ sheet?.description || 'No description' }}</div>
    
    <!-- Progress bar for test sheets -->
    <div v-if="type !== 'reference'" class="progress-bar">
      <div 
        :class="['progress-fill', { field: type === 'field' }]" 
        :style="{ width: `${progress?.percentage || 0}%` }"
      ></div>
    </div>
    
    <div class="progress-text">
      {{ getProgressText() }}
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sheetKey: String,
  sheet: Object,
  isActive: Boolean,
  progress: Object,
  entryCount: Number,
  type: {
    type: String,
    required: true,
    validator: (value) => ['shop', 'field', 'reference'].includes(value)
  }
})

defineEmits(['click'])

function getIcon() {
  if (props.type === 'reference') {
    return props.sheet?.icon || '📄'
  } else if (props.type === 'field') {
    return '🎯'
  } else {
    return '🔧'
  }
}

function getDisplayValue() {
  if (props.type === 'reference') {
    return props.entryCount || 0
  } else {
    return `${props.progress?.percentage || 0}%`
  }
}

function getProgressText() {
  if (props.type === 'reference') {
    const count = props.entryCount || 0
    return `${count} entries`
  } else {
    return `${props.progress?.completed || 0} of ${props.progress?.total || 0} complete`
  }
}
</script>
