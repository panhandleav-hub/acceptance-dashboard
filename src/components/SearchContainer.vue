<template>
  <div class="search-container">
    <input 
      ref="searchInput"
      type="text" 
      placeholder="Search tests... (Ctrl+F)" 
      class="search-input"
      v-model="store.searchTerm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../stores/main'

const store = useMainStore()
const searchInput = ref(null)

// Expose search input for global focus functionality
defineExpose({
  focus: () => searchInput.value?.focus()
})
</script>
