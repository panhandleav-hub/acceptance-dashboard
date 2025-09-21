import { useMainStore } from '../stores/main'
import * as XLSX from 'xlsx'

export function useImportActions() {
  const store = useMainStore()

  function parseCSV(csvContent) {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim())
      if (lines.length < 2) return []

      // Parse header
      const headers = parseCSVLine(lines[0])
      const data = []

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = parseCSVLine(line)
        const row = {}
        
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        
        data.push(row)
      }

      return data
    } catch (error) {
      console.error('CSV parsing error:', error)
      throw new Error(`Failed to parse CSV: ${error.message}`)
    }
  }

  function parseCSVLine(line) {
    const result = []
    let current = ''
    let inQuotes = false
    let i = 0
    
    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"'
          i += 2
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
          i++
        }
      } else if (char === ',' && !inQuotes) {
        // Field delimiter
        result.push(current.trim())
        current = ''
        i++
      } else {
        current += char
        i++
      }
    }
    
    // Add the last field
    result.push(current.trim())
    return result
  }

  function importEquipmentData() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.csv,.xlsx,.xls'
    fileInput.style.display = 'none'
    
    fileInput.onchange = function(e) {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = function(event) {
        try {
          let parsedData
          
          if (file.name.endsWith('.csv')) {
            const csvContent = event.target.result
            parsedData = parseCSV(csvContent)
          } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const data = new Uint8Array(event.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            parsedData = XLSX.utils.sheet_to_json(worksheet)
          } else {
            throw new Error('Unsupported file format')
          }
          
          if (parsedData.length === 0) {
            alert('No valid data found in file.')
            return
          }

          showImportPreview(parsedData)
          
        } catch (error) {
          console.error('File parsing error:', error)
          alert('Error parsing file: ' + error.message)
        }
      }
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    }
    
    document.body.appendChild(fileInput)
    fileInput.click()
    document.body.removeChild(fileInput)
  }

  function showImportPreview(importData) {
    store.showImportPreview = true
    store.importData = importData
  }

  function processImport() {
    if (!store.importData) return

    let importedCount = 0
    let roomsUpdated = new Set()

    store.importData.forEach((row, index) => {
      const roomName = row.Room || row.room || ''
      if (!roomName) return

      let roomKey = null
      const rooms = store.projectData?.rooms || {}
      
      for (const [key, room] of Object.entries(rooms)) {
        if (room?.name?.toLowerCase() === roomName.toLowerCase()) {
          roomKey = key
          break
        }
      }

      if (!roomKey) {
        roomKey = roomName.toLowerCase().replace(/\s+/g, '-')
        
        if (!store.projectData.rooms[roomKey]) {
          store.projectData.rooms[roomKey] = {
            name: roomName,
            description: `Imported room - ${roomName}`,
            dependsOn: [],
            sharedInfrastructure: [],
            sharedEquipment: [],
            testData: {
              'in-house-commissioning': {
                title: 'In-House Commissioning',
                description: 'SHOP',
                categories: [{ 
                  id: 1, 
                  name: 'Physical Install', 
                  items: [
                    { id: '1.01', title: 'Equipment Inventory', description: 'List all equipment not present', status: 'pending', notes: '', initials: '', owner: '', date: '' }
                  ]
                }]
              },
              'in-house-programming': {
                title: 'In-House Programming',
                description: 'SHOP',
                categories: [{ 
                  id: 1, 
                  name: 'Control Wiring', 
                  items: [
                    { id: '1.01', title: 'Control System Wiring', description: 'Verify all control system connections', status: 'pending', notes: '', initials: '', owner: '', date: '' }
                  ]
                }]
              },
              'on-site-commissioning': {
                title: 'On-Site Commissioning',
                description: 'FIELD',
                categories: [{ 
                  id: 1, 
                  name: 'Physical Install', 
                  items: [
                    { id: '1.01', title: 'Final Equipment Check', description: 'Verify all equipment is properly installed on-site', status: 'pending', notes: '', initials: '', owner: '', date: '' }
                  ]
                }]
              },
              'on-site-programming': {
                title: 'On-Site Programming',
                description: 'FIELD',
                categories: [{ 
                  id: 1, 
                  name: 'Final System Testing', 
                  items: [
                    { id: '1.01', title: 'End-to-End System Test', description: 'Complete system functionality test', status: 'pending', notes: '', initials: '', owner: '', date: '' }
                  ]
                }]
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

      const room = store.projectData.rooms[roomKey]
      if (!room.referenceData) room.referenceData = {}
      if (!room.referenceData.equipment) {
        room.referenceData.equipment = {
          title: 'Equipment List',
          icon: '💾',
          description: 'Room-specific equipment inventory',
          headers: ['Room', 'Equipment ID', 'MFG', 'Model #', 'Serial #', 'IP Address', 'Mac Address', 'IP ID', 'Switch Port', 'Firmware Version', 'Notes'],
          data: []
        }
      }

      const existingIds = room.referenceData.equipment.data?.map(item => item?.id || 0) || [0]
      const newId = Math.max(...existingIds) + 1

      const equipmentItem = {
        id: newId,
        room: roomName,
        equipmentId: row['Equipment ID'] || row.equipmentId || `EQ-${String(newId).padStart(3, '0')}`,
        mfg: row.MFG || row.mfg || '',
        model: row['Model #'] || row.model || '',
        serial: row['Serial #'] || row.serial || '',
        ipAddress: row['IP Address'] || row.ipAddress || '',
        macAddress: row['Mac Address'] || row.macAddress || '',
        ipId: row['IP ID'] || row.ipId || '',
        switchPort: row['Switch Port'] || row.switchPort || '',
        firmwareVersion: row['Firmware Version'] || row.firmwareVersion || '',
        notes: row.Notes || row.notes || ''
      }

      room.referenceData.equipment.data.push(equipmentItem)
      importedCount++
      roomsUpdated.add(roomName)
    })

    store.showImportPreview = false
    store.importData = null
    store.saveToLocalStorage()

    alert(`Successfully imported ${importedCount} equipment items across ${roomsUpdated.size} rooms:\n${Array.from(roomsUpdated).join(', ')}`)
  }

  function cancelImport() {
    store.showImportPreview = false
    store.importData = null
  }

  return {
    importEquipmentData,
    processImport,
    cancelImport
  }
}
