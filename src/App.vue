<!--
/**
 * App.vue - Root Component
 * 
 * The main application component that sets up the overall layout
 * and handles global event listeners like keyboard shortcuts.
 * 
 * Layout Structure:
 * - Dashboard container with dark mode support
 * - Sidebar for navigation and controls
 * - MainContent for displaying active sheets
 * - Modal overlays for management and import functions
 * 
 * Global Features:
 * - Keyboard shortcuts (Ctrl+S for export, Ctrl+F for search, Esc for modals)
 * - Dark mode theme switching
 * - Modal state management
 * 
 * @component
 * @example
 * <App />
 */
-->
<template>
  <div id="app">
    <!-- Main dashboard layout with dynamic dark mode class -->
    <div :class="['dashboard', { dark: store.darkMode }]">
      <Sidebar />
      <MainContent />
    </div>
    
    <!-- Modal overlays - only render when needed for performance -->
    <ManagementModal v-if="store.showManagement" />
    <ImportPreviewModal v-if="store.showImportPreview" />
  </div>
</template>

<script setup>
// Core Vue imports
import { onMounted } from 'vue'

// Store and components
import { useMainStore } from './stores/main'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'
import ManagementModal from './components/ManagementModal.vue'
import ImportPreviewModal from './components/ImportPreviewModal.vue'

const store = useMainStore()

/**
 * Setup global keyboard shortcuts for improved UX
 * 
 * Shortcuts:
 * - Ctrl/Cmd + S: Export functionality (prevented default save)
 * - Ctrl/Cmd + F: Focus search input (prevented default find)
 * - Escape: Close any open modals or cancel editing
 */
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    // Handle Ctrl/Cmd key combinations
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault()
          // Export functionality will be handled by composables
          // This prevents the browser's default save dialog
          break
        case 'f':
          e.preventDefault()
          // Focus the search input for quick access
          const searchInput = document.querySelector('.search-input')
          if (searchInput) searchInput.focus()
          break
      }
    }
    
    // Handle Escape key for closing modals and canceling edits
    if (e.key === 'Escape') {
      if (store.showManagement) store.showManagement = false
      if (store.showImportPreview) store.showImportPreview = false
      if (store.editingCell) store.editingCell = null
    }
  })
})
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}
</style>
