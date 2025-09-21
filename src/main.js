/**
 * Main Application Entry Point
 * 
 * Initializes the Vue.js application with:
 * - Vue 3 composition API
 * - Pinia state management
 * - Global CSS styles
 * 
 * This file sets up the core application structure and mounts
 * the root component to the DOM.
 * 
 * @author Vue.js Conversion Team
 * @version 1.0.0
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Create Vue application instance
const app = createApp(App)

// Initialize Pinia store for state management
const pinia = createPinia()

// Register Pinia with the Vue app
app.use(pinia)

// Mount the application to the #app element in index.html
app.mount('#app')
