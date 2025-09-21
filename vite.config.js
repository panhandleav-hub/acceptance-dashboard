/**
 * Vite Configuration
 * 
 * Build tool configuration for the Vue.js application.
 * 
 * Features configured:
 * - Vue 3 single-file component support
 * - Path aliases for cleaner imports
 * - Global definitions for external libraries
 * - Development server settings
 * 
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // Vue plugin for .vue file processing
  plugins: [vue()],
  
  resolve: {
    alias: {
      // Enable @ alias for src directory imports
      // Example: import Component from '@/components/Component.vue'
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  define: {
    // Ensure XLSX library works properly in browser environment
    // Some Node.js libraries expect 'global' to be defined
    global: 'globalThis',
  },
})
