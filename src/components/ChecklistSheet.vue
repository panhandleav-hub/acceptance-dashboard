<template>
  <div>
    <div class="content-header">
      <div class="header-row">
        <div>
          <h2>
            {{ currentSheet?.title || 'Unnamed Sheet' }}
            <span :class="['room-badge', { field: isFieldSheet }]">
              {{ isFieldSheet ? '🎯' : '🏠' }} {{ store.getCurrentRoom?.name || 'Unknown Room' }}
            </span>
          </h2>
          <p>
            {{ currentSheet?.description || 'No description' }} • 
            {{ store.getCurrentRoom?.description || 'No description' }}
          </p>
        </div>
        <div class="header-stats">
          <div class="header-stats-value">{{ progress.percentage }}%</div>
          <div class="header-stats-label">Complete</div>
        </div>
      </div>
      
      <div class="category-pills">
        <button 
          :class="['category-pill', { active: store.activeCategory === null }]"
          @click="store.activeCategory = null"
        >
          All Categories
        </button>
        <button
          v-for="category in currentSheet?.categories || []"
          :key="category.id"
          :class="['category-pill', { active: store.activeCategory === category.id }]"
          @click="store.activeCategory = category.id"
        >
          {{ category.name || 'Unnamed Category' }} ({{ getCategoryProgress(category) }})
        </button>
      </div>
    </div>

    <div class="content-body">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="test-category"
      >
        <div class="category-header">
          <h3 class="category-title">{{ category.name || 'Unnamed Category' }}</h3>
        </div>
        
        <TestItem
          v-for="item in getFilteredItems(category)"
          :key="item.id"
          :item="item"
          :category-id="category.id"
          :room-key="store.activeRoom"
          :sheet-key="sheetKey"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/main'
import TestItem from './TestItem.vue'

const props = defineProps({
  sheetKey: {
    type: String,
    required: true
  }
})

const store = useMainStore()

const currentSheet = computed(() => {
  return store.getCurrentTestData[props.sheetKey]
})

const progress = computed(() => {
  return store.calculateSheetProgress(store.activeRoom, props.sheetKey)
})

const isFieldSheet = computed(() => {
  return props.sheetKey.startsWith('on-site')
})

const filteredCategories = computed(() => {
  const categories = currentSheet.value?.categories || []
  return store.activeCategory === null 
    ? categories 
    : categories.filter(category => category.id === store.activeCategory)
})

function getCategoryProgress(category) {
  const items = category.items || []
  const completed = items.filter(item => 
    item && (item.status === 'pass' || item.status === 'fail' || item.status === 'na')
  ).length
  return `${completed}/${items.length}`
}

function getFilteredItems(category) {
  const items = category.items || []
  if (!store.searchTerm) return items
  
  const searchLower = store.searchTerm.toLowerCase()
  return items.filter(item => 
    (item?.title || '').toLowerCase().includes(searchLower) ||
    (item?.description || '').toLowerCase().includes(searchLower)
  )
}
</script>
