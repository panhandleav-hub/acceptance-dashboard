<template>
  <div class="nav-content">
    <!-- Shop Testing Section -->
    <h3 class="nav-section-title">Shop Testing</h3>
    <NavigationItem
      v-for="key in shopTestingSheets"
      :key="key"
      :sheet-key="key"
      :sheet="store.getCurrentTestData[key]"
      :is-active="store.activeSheet === key"
      :progress="store.calculateSheetProgress(store.activeRoom, key)"
      type="shop"
      @click="setActiveSheet(key)"
    />

    <!-- Field Testing Section -->
    <h3 class="nav-section-title">Field Testing</h3>
    <NavigationItem
      v-for="key in fieldTestingSheets"
      :key="key"
      :sheet-key="key"
      :sheet="store.getCurrentTestData[key]"
      :is-active="store.activeSheet === key"
      :progress="store.calculateSheetProgress(store.activeRoom, key)"
      type="field"
      @click="setActiveSheet(key)"
    />

    <!-- Reference Sheets Section -->
    <h3 class="nav-section-title">
      Reference Sheets ({{ store.getCurrentRoom?.name || 'No Room Selected' }})
    </h3>
    <NavigationItem
      v-for="[key, sheet] in Object.entries(store.getCurrentReferenceData)"
      :key="key"
      :sheet-key="key"
      :sheet="sheet"
      :is-active="store.activeSheet === key"
      :entry-count="sheet?.data?.length || 0"
      type="reference"
      @click="setActiveSheet(key)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/main'
import NavigationItem from './NavigationItem.vue'

const store = useMainStore()

const shopTestingSheets = ['in-house-commissioning', 'in-house-programming']
const fieldTestingSheets = ['on-site-commissioning', 'on-site-programming']

function setActiveSheet(sheetKey) {
  store.activeSheet = sheetKey
  store.activeCategory = null
}
</script>
