<template>
  <div class="sidebar-header">
    <div class="sidebar-title-row">
      <h1 class="sidebar-title">Acceptance Test Plan</h1>
      <div class="sidebar-buttons">
        <button 
          class="icon-button" 
          @click="store.showManagement = true" 
          title="Project & Room Management"
        >
          ⚙️
        </button>
        <button 
          class="icon-button" 
          @click="toggleDarkMode" 
          title="Toggle Dark Mode"
        >
          {{ store.darkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
    <p class="sidebar-subtitle">
      {{ store.projectData.projectInfo.clientName }} - {{ store.projectData.projectInfo.projectNumber }}
    </p>
  </div>
</template>

<script setup>
import { useMainStore } from '../stores/main'

const store = useMainStore()

function toggleDarkMode() {
  store.darkMode = !store.darkMode
  store.saveToLocalStorage()
}
</script>
