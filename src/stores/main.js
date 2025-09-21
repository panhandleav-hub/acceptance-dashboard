import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Main Pinia Store for Acceptance Test Dashboard
 * 
 * Manages all application state including:
 * - Project information and settings
 * - Room data and test results
 * - UI state (active selections, modals)
 * - Local storage persistence
 * 
 * @author Vue.js Conversion Team
 * @version 1.0.0
 */

// Initial data structure from the original app
// This serves as the default template for new projects
const initialData = {
  projectInfo: {
    clientName: 'CACI NSS, INC',
    projectNumber: '900I-24-75178',
    projectName: 'Reston HQ - Complete AV System Upgrade'
  },
  sharedEquipment: {},
  sharedInfrastructure: {},
  rooms: {
    'board-room': {
      name: 'Board Room',
      description: 'Main conference room with dual displays',
      dependsOn: [],
      sharedInfrastructure: [],
      sharedEquipment: [],
      testData: {
        'in-house-commissioning': {
          title: 'In-House Commissioning',
          description: 'SHOP',
          categories: [
            {
              id: 1,
              name: 'Physical Install',
              items: [
                { 
                  id: '1.01', 
                  title: 'Equipment Inventory', 
                  description: 'List all equipment not present', 
                  status: 'pass', 
                  notes: 'All equipment accounted for', 
                  initials: 'JS', 
                  owner: 'John Smith', 
                  date: '2024-01-15' 
                },
                { 
                  id: '1.02', 
                  title: 'Rack Elevation Status', 
                  description: 'Check final rack layout and update prints accordingly', 
                  status: 'pass', 
                  notes: 'Layout matches prints', 
                  initials: 'JS', 
                  owner: 'John Smith', 
                  date: '2024-01-15' 
                },
                { 
                  id: '1.03', 
                  title: 'Rack Thermal Management', 
                  description: 'Check rack fans for air direction and thermostats functionality', 
                  status: 'pending', 
                  notes: '', 
                  initials: '', 
                  owner: '', 
                  date: '' 
                }
              ]
            },
            {
              id: 2,
              name: 'Cable Management, Termination, Labeling',
              items: [
                { 
                  id: '2.01', 
                  title: 'Equipment Power Cable Management', 
                  description: 'All power cables are properly managed and dressed', 
                  status: 'pending', 
                  notes: '', 
                  initials: '', 
                  owner: '', 
                  date: '' 
                }
              ]
            }
          ]
        },
        'in-house-programming': {
          title: 'In-House Programming',
          description: 'SHOP',
          categories: [
            {
              id: 1,
              name: 'Control Wiring',
              items: [
                { 
                  id: '1.01', 
                  title: 'Control System Wiring', 
                  description: 'Verify all control system connections', 
                  status: 'pass', 
                  notes: '', 
                  initials: 'MJ', 
                  owner: '', 
                  date: '2024-01-14' 
                }
              ]
            }
          ]
        },
        'on-site-commissioning': {
          title: 'On-Site Commissioning',
          description: 'FIELD',
          categories: [
            {
              id: 1,
              name: 'Physical Install',
              items: [
                { 
                  id: '1.01', 
                  title: 'Final Equipment Check', 
                  description: 'Verify all equipment is properly installed on-site', 
                  status: 'pending', 
                  notes: '', 
                  initials: '', 
                  owner: '', 
                  date: '' 
                }
              ]
            }
          ]
        },
        'on-site-programming': {
          title: 'On-Site Programming',
          description: 'FIELD',
          categories: [
            {
              id: 1,
              name: 'Final System Testing',
              items: [
                { 
                  id: '1.01', 
                  title: 'End-to-End System Test', 
                  description: 'Complete system functionality test', 
                  status: 'pending', 
                  notes: '', 
                  initials: '', 
                  owner: '', 
                  date: '' 
                }
              ]
            }
          ]
        }
      },
      referenceData: {
        'equipment': {
          title: 'Equipment List',
          icon: '💾',
          description: 'Complete inventory of all system equipment',
          headers: ['Room', 'Equipment ID', 'MFG', 'Model #', 'Serial #', 'IP Address', 'Mac Address', 'IP ID', 'Switch Port', 'Firmware Version', 'Notes'],
          data: [
            { 
              id: 1, 
              room: 'Board Room', 
              equipmentId: 'EQ-001', 
              mfg: 'Samsung', 
              model: 'QM85R-B', 
              serial: 'SAMS-85-001', 
              ipAddress: '192.168.1.110', 
              macAddress: '', 
              ipId: 'DISP-01', 
              switchPort: 'SW-01/9', 
              firmwareVersion: 'BYS_BYSOSP_2008.3', 
              notes: '85" 4K displays' 
            }
          ]
        }
      }
    }
  }
}

export const useMainStore = defineStore('main', () => {
  // State
  const activeRoom = ref('board-room')
  const activeSheet = ref('in-house-commissioning')
  const activeCategory = ref(null)
  const searchTerm = ref('')
  const projectData = ref(JSON.parse(JSON.stringify(initialData)))
  const darkMode = ref(true)
  const showProjectSettings = ref(false)
  const showRoomManager = ref(false)
  const showManagement = ref(false)
  const showImportPreview = ref(false)
  const editingCell = ref(null)
  const importData = ref(null)

  // Getters
  const getCurrentRoom = computed(() => {
    return projectData.value?.rooms?.[activeRoom.value] || null
  })

  const getCurrentTestData = computed(() => {
    const room = getCurrentRoom.value
    return room?.testData || {}
  })

  const getCurrentReferenceData = computed(() => {
    const room = getCurrentRoom.value
    return room?.referenceData || {}
  })

  const totalRooms = computed(() => {
    return Object.keys(projectData.value?.rooms || {}).length
  })

  // Actions
  /**
   * Calculate completion progress for a specific room
   * 
   * Iterates through all test sheets, categories, and items to count
   * completed vs total items. An item is considered complete if it has
   * a status of 'pass', 'fail', or 'na' (not applicable).
   * 
   * @param {string} roomKey - The unique identifier for the room
   * @returns {Object} Progress object with completed, total, and percentage
   */
  function calculateRoomProgress(roomKey) {
    const room = projectData.value?.rooms?.[roomKey]
    if (!room || !room.testData) return { completed: 0, total: 0, percentage: 0 }
    
    let completed = 0
    let total = 0
    
    // Iterate through all test sheets (commissioning, programming, etc.)
    Object.values(room.testData).forEach(sheet => {
      if (sheet && sheet.categories) {
        // Iterate through categories within each sheet
        sheet.categories.forEach(category => {
          if (category && category.items) {
            // Count each test item
            category.items.forEach(item => {
              total++
              // Item is complete if it has any status other than 'pending'
              if (item && (item.status === 'pass' || item.status === 'fail' || item.status === 'na')) {
                completed++
              }
            })
          }
        })
      }
    })
    
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  /**
   * Calculate completion progress for a specific test sheet within a room
   * 
   * Similar to calculateRoomProgress but limited to a single sheet
   * (e.g., 'in-house-commissioning', 'on-site-programming')
   * 
   * @param {string} roomKey - The unique identifier for the room
   * @param {string} sheetKey - The unique identifier for the test sheet
   * @returns {Object} Progress object with completed, total, and percentage
   */
  function calculateSheetProgress(roomKey, sheetKey) {
    const room = projectData.value?.rooms?.[roomKey]
    if (!room || !room.testData || !room.testData[sheetKey]) {
      return { completed: 0, total: 0, percentage: 0 }
    }
    
    const sheet = room.testData[sheetKey]
    let completed = 0
    let total = 0
    
    if (sheet && sheet.categories) {
      sheet.categories.forEach(category => {
        if (category && category.items) {
          category.items.forEach(item => {
            total++
            if (item && (item.status === 'pass' || item.status === 'fail' || item.status === 'na')) {
              completed++
            }
          })
        }
      })
    }
    
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  /**
   * Update a specific field of a test item
   * 
   * This is the primary method for updating test data. When the status
   * field is updated, it automatically sets the current date.
   * All changes are automatically saved to localStorage.
   * 
   * @param {string} roomKey - Room identifier
   * @param {string} sheetKey - Test sheet identifier
   * @param {number} categoryId - Category ID within the sheet
   * @param {string} itemId - Test item identifier
   * @param {string} field - Field name to update (status, notes, initials, etc.)
   * @param {any} value - New value for the field
   */
  function updateTestItem(roomKey, sheetKey, categoryId, itemId, field, value) {
    const room = projectData.value?.rooms?.[roomKey]
    if (!room || !room.testData || !room.testData[sheetKey]) return
    
    const sheet = room.testData[sheetKey]
    const category = sheet.categories?.find(c => c.id === categoryId)
    const item = category?.items?.find(i => i.id === itemId)
    
    if (item) {
      item[field] = value
      // Auto-timestamp when status changes
      if (field === 'status') {
        item.date = new Date().toLocaleDateString()
      }
      saveToLocalStorage()
    }
  }

  function updateReferenceData(roomKey, sheetKey, rowId, field, value) {
    const room = projectData.value?.rooms?.[roomKey]
    if (!room || !room.referenceData || !room.referenceData[sheetKey]) return
    
    const sheet = room.referenceData[sheetKey]
    const row = sheet.data?.find(r => r?.id === rowId)
    if (row) {
      row[field] = value
      saveToLocalStorage()
    }
  }

  function addReferenceRow(roomKey, sheetKey) {
    const room = projectData.value?.rooms?.[roomKey]
    if (!room || !room.referenceData || !room.referenceData[sheetKey]) return
    
    const sheet = room.referenceData[sheetKey]
    const existingIds = sheet.data?.map(row => row?.id || 0) || [0]
    const newId = Math.max(...existingIds) + 1
    const newRow = { id: newId }
    
    const headers = sheet.headers || []
    headers.forEach(header => {
      const key = getFieldKey(header)
      newRow[key] = ''
    })

    if (!sheet.data) sheet.data = []
    sheet.data.push(newRow)
    saveToLocalStorage()
  }

  function deleteReferenceRow(roomKey, sheetKey, rowId) {
    const room = projectData.value?.rooms?.[roomKey]
    if (!room || !room.referenceData || !room.referenceData[sheetKey]) return
    
    const sheet = room.referenceData[sheetKey]
    if (sheet.data) {
      sheet.data = sheet.data.filter(row => row?.id !== rowId)
      saveToLocalStorage()
    }
  }

  /**
   * Convert human-readable header names to camelCase object keys
   * 
   * This function handles the mapping between display headers in tables
   * (e.g., "IP Address", "Model #") and the corresponding object property
   * names (e.g., "ipAddress", "model"). This is essential for CSV/Excel
   * import functionality and reference data management.
   * 
   * @param {string} header - The display header name
   * @returns {string} The corresponding camelCase object key
   * 
   * @example
   * getFieldKey("IP Address") // returns "ipAddress"
   * getFieldKey("Model #") // returns "model"
   * getFieldKey("Device Type") // returns "deviceType"
   */
  function getFieldKey(header) {
    // Predefined mappings for common headers
    const mappings = {
      'device type': 'deviceType',
      'network access': 'networkAccess',
      'address type': 'addressType',
      'ip address': 'ipAddress',
      'mac address': 'macAddress',
      'switch port': 'switchPort',
      'room/system name': 'roomName',
      'codec model': 'codecModel',
      'serial number': 'serialNumber',
      'firmware version': 'firmwareVersion',
      'license type': 'licenseType',
      'provisioning status': 'status',
      'model #': 'model',
      'serial #': 'serial',
      'connected device': 'device',
      'cable id': 'cableId',
      'room': 'room',
      'equipment id': 'equipmentId',
      'mfg': 'mfg',
      'ip id': 'ipId'
    }
    
    const key = header.toLowerCase()
    // Return mapped value or fallback to sanitized version
    return mappings[key] || key.replace(/[^a-z0-9]/g, '')
  }

  function saveToLocalStorage() {
    try {
      const dataToSave = {
        projectData: projectData.value,
        darkMode: darkMode.value,
        activeRoom: activeRoom.value
      }
      localStorage.setItem('completeMultiRoomAcceptanceTest', JSON.stringify(dataToSave))
    } catch (e) {
      console.warn('Could not save to localStorage:', e)
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('completeMultiRoomAcceptanceTest')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.projectData) projectData.value = data.projectData
        if (typeof data.darkMode === 'boolean') darkMode.value = data.darkMode
        if (data.activeRoom) activeRoom.value = data.activeRoom
      }
      
      if (!projectData.value?.rooms?.[activeRoom.value]) {
        const rooms = projectData.value?.rooms || {}
        const roomKeys = Object.keys(rooms)
        if (roomKeys.length > 0) {
          activeRoom.value = roomKeys[0]
        }
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e)
      projectData.value = JSON.parse(JSON.stringify(initialData))
    }
  }

  // Initialize on store creation
  loadFromLocalStorage()

  return {
    // State
    activeRoom,
    activeSheet,
    activeCategory,
    searchTerm,
    projectData,
    darkMode,
    showProjectSettings,
    showRoomManager,
    showManagement,
    showImportPreview,
    editingCell,
    importData,
    
    // Getters
    getCurrentRoom,
    getCurrentTestData,
    getCurrentReferenceData,
    totalRooms,
    
    // Actions
    calculateRoomProgress,
    calculateSheetProgress,
    updateTestItem,
    updateReferenceData,
    addReferenceRow,
    deleteReferenceRow,
    getFieldKey,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
