import { useMainStore } from '../stores/main'

/**
 * Room Management Composable
 * 
 * Handles all room-related operations including:
 * - Creating new rooms with default test structure
 * - Deleting rooms with safety checks
 * - Clearing all project data
 * - Managing room dependencies and relationships
 * 
 * This composable ensures data consistency when manipulating rooms
 * and provides safe operations with user confirmations for destructive actions.
 * 
 * @returns {Object} Room management functions
 * 
 * @example
 * const { addRoom, deleteRoom, clearAllData } = useRoomManagement()
 * 
 * @author Vue.js Conversion Team
 * @version 1.0.0
 */
export function useRoomManagement() {
  const store = useMainStore()

  /**
   * Add a new room to the project
   * 
   * Creates a new room with:
   * - User-provided name (via prompt)
   * - Default test data structure for all phases
   * - Empty equipment reference sheet
   * - Unique kebab-case identifier
   * 
   * The new room becomes the active room automatically.
   * Prevents duplicate room names and handles edge cases.
   */
  function addRoom() {
    const roomName = prompt('Enter room name:')
    if (!roomName) return
    
    // Create URL-safe identifier from room name
    const roomKey = roomName.toLowerCase().replace(/\s+/g, '-')
    
    // Prevent duplicate rooms
    if (store.projectData.rooms[roomKey]) {
      alert('Room already exists!')
      return
    }

    // Create new room with complete default structure
    // This ensures all rooms have consistent test phases and structure
    store.projectData.rooms[roomKey] = {
      name: roomName,
      description: 'New room - update description',
      dependsOn: [],              // Future feature: room dependencies
      sharedInfrastructure: [],   // Future feature: shared resources
      sharedEquipment: [],        // Future feature: shared equipment
      testData: {
        // Shop phase testing (in-house)
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
          description: 'Room-specific equipment inventory',
          headers: ['Room', 'Equipment ID', 'MFG', 'Model #', 'Serial #', 'IP Address', 'Mac Address', 'IP ID', 'Switch Port', 'Firmware Version', 'Notes'],
          data: []
        }
      }
    }
    
    store.activeRoom = roomKey
    store.saveToLocalStorage()
  }

  /**
   * Delete a room from the project
   * 
   * Includes safety measures:
   * - Prevents deleting the last remaining room
   * - User confirmation dialog
   * - Automatic selection of new active room if current room is deleted
   * - Immediate save to localStorage
   * 
   * @param {string} roomKey - Unique identifier of room to delete
   */
  function deleteRoom(roomKey) {
    const rooms = store.projectData?.rooms || {}
    
    // Safety check: prevent deleting the last room
    if (Object.keys(rooms).length <= 1) {
      alert('Cannot delete the last room!')
      return
    }
    
    const room = rooms[roomKey]
    const roomName = room?.name || 'Unknown Room'
    
    // Confirm deletion with user
    if (confirm(`Are you sure you want to delete "${roomName}"?`)) {
      delete store.projectData.rooms[roomKey]
      
      // If we deleted the active room, switch to another room
      if (store.activeRoom === roomKey) {
        const remainingRooms = Object.keys(store.projectData.rooms)
        store.activeRoom = remainingRooms.length > 0 ? remainingRooms[0] : null
      }
      
      store.saveToLocalStorage()
    }
  }

  function clearAllData() {
    const confirmed = confirm(
      'Are you sure you want to clear ALL project data?\n\n' +
      'This will:\n' +
      '• Delete all rooms and equipment\n' +
      '• Reset all test results\n' +
      '• Clear project information\n' +
      '• Remove all reference data\n\n' +
      'This action cannot be undone!'
    )

    if (!confirmed) return

    const doubleConfirm = prompt(
      'To confirm, please type "CLEAR ALL DATA" (without quotes):'
    )

    if (doubleConfirm !== 'CLEAR ALL DATA') {
      alert('Clear operation cancelled.')
      return
    }

    store.projectData = {
      projectInfo: {
        clientName: 'New Client',
        projectNumber: 'NEW-PROJECT-001',
        projectName: 'New Project - Acceptance Test Plan'
      },
      sharedEquipment: {},
      sharedInfrastructure: {},
      rooms: {
        'new-room': {
          name: 'New Room',
          description: 'New room - update description as needed',
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
                    { id: '1.01', title: 'Equipment Inventory', description: 'List all equipment not present', status: 'pending', notes: '', initials: '', owner: '', date: '' }
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
                    { id: '1.01', title: 'Control System Wiring', description: 'Verify all control system connections', status: 'pending', notes: '', initials: '', owner: '', date: '' }
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
                    { id: '1.01', title: 'Final Equipment Check', description: 'Verify all equipment is properly installed on-site', status: 'pending', notes: '', initials: '', owner: '', date: '' }
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
                    { id: '1.01', title: 'End-to-End System Test', description: 'Complete system functionality test', status: 'pending', notes: '', initials: '', owner: '', date: '' }
                  ]
                }
              ]
            }
          },
          referenceData: {
            'equipment': {
              title: 'Equipment List',
              icon: '💾',
              description: 'Room-specific equipment inventory',
              headers: ['Room', 'Equipment ID', 'MFG', 'Model #', 'Serial #', 'IP Address', 'Mac Address', 'IP ID', 'Switch Port', 'Firmware Version', 'Notes'],
              data: []
            }
          }
        }
      }
    }

    store.activeRoom = 'new-room'
    store.activeSheet = 'in-house-commissioning'
    store.activeCategory = null
    store.searchTerm = ''

    localStorage.removeItem('completeMultiRoomAcceptanceTest')
    store.saveToLocalStorage()
    
    store.showManagement = true

    alert('All data cleared successfully! Ready for a new project.')
  }

  return {
    addRoom,
    deleteRoom,
    clearAllData
  }
}
