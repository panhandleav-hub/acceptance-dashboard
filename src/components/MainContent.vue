<template>
  <div class="main-content">
    <ChecklistSheet 
      v-if="isChecklistSheet" 
      :sheet-key="store.activeSheet"
    />
    <ReferenceSheet 
      v-else-if="isReferenceSheet"
      :sheet-key="store.activeSheet"
    />
    <NoSheetAvailable v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/main'
import ChecklistSheet from './ChecklistSheet.vue'
import ReferenceSheet from './ReferenceSheet.vue'
import NoSheetAvailable from './NoSheetAvailable.vue'

const store = useMainStore()

const isChecklistSheet = computed(() => {
  return store.getCurrentTestData[store.activeSheet] !== undefined
})

const isReferenceSheet = computed(() => {
  return store.getCurrentReferenceData[store.activeSheet] !== undefined
})
</script>
