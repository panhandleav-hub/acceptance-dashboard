import { useMainStore } from '../stores/main'
import * as XLSX from 'xlsx'

/**
 * Export Actions Composable
 * 
 * Handles all data export functionality including:
 * - CSV export of complete test data
 * - Excel export with multiple worksheets
 * - Equipment template generation
 * 
 * This composable encapsulates the complex logic for converting
 * the application's nested data structure into various export formats.
 * 
 * @returns {Object} Export functions for use in components
 * 
 * @example
 * const { exportToCSV, exportToExcel, exportEquipmentTemplate } = useExportActions()
 * 
 * @author Vue.js Conversion Team
 * @version 1.0.0
 */
export function useExportActions() {
  const store = useMainStore()

  /**
   * Export all project data to CSV format
   * 
   * Creates a comprehensive CSV file containing:
   * - Project information header
   * - All rooms with their test data
   * - Complete test item details with status
   * 
   * The CSV structure is hierarchical with clear section headers
   * and proper escaping for special characters and quotes.
   * 
   * @throws {Error} When CSV generation or file download fails
   */
  function exportToCSV() {
    try {
      let csvContent = ''
      
      const projectInfo = store.projectData?.projectInfo || {}
      csvContent += "Project Information\n"
      csvContent += `Project Name,"${(projectInfo.projectName || 'Unknown Project').replace(/"/g, '""')}"\n`
      csvContent += `Client Name,"${(projectInfo.clientName || 'Unknown Client').replace(/"/g, '""')}"\n`
      csvContent += `Project Number,"${(projectInfo.projectNumber || 'Unknown Number').replace(/"/g, '""')}"\n\n`
      
      const rooms = store.projectData?.rooms || {}
      Object.entries(rooms).forEach(([roomKey, room]) => {
        if (!room) return
        
        csvContent += `\nROOM: ${(room.name || 'Unnamed Room').replace(/"/g, '""')}\n`
        csvContent += `Description: ${(room.description || 'No description').replace(/"/g, '""')}\n\n`
        
        const testData = room.testData || {}
        Object.entries(testData).forEach(([sheetKey, sheet]) => {
          if (!sheet) return
          
          csvContent += `${(sheet.title || 'Unnamed Sheet').replace(/"/g, '""')} - ${(sheet.description || 'No description').replace(/"/g, '""')}\n`
          csvContent += "Item No,Title,Description,Status,Notes,Initials,Owner,Date\n"
          
          const categories = sheet.categories || []
          categories.forEach(category => {
            if (!category) return
            
            csvContent += `\nCategory: ${(category.name || 'Unnamed Category').replace(/"/g, '""')}\n`
            const items = category.items || []
            items.forEach(item => {
              if (!item) return
              
              const values = [
                item.id || '',
                item.title || '',
                item.description || '',
                item.status || '',
                item.notes || '',
                item.initials || '',
                item.owner || '',
                item.date || ''
              ]
              
              const escapedValues = values.map(value => 
                `"${value.toString().replace(/"/g, '""')}"`
              )
              csvContent += escapedValues.join(',') + '\n'
            })
          })
        })
        csvContent += "\n"
      })
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `acceptance_test_plan_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('CSV export error:', error)
      alert('Error exporting CSV: ' + error.message)
    }
  }

  function exportEquipmentTemplate() {
    try {
      const headers = ['Room', 'Equipment ID', 'MFG', 'Model #', 'Serial #', 'IP Address', 'Mac Address', 'IP ID', 'Switch Port', 'Firmware Version', 'Notes']
      
      const exampleData = [
        headers, // Header row
        ['Board Room', 'EQ-001', 'Samsung', 'QM85R-B', 'SAMS-85-001', '192.168.1.110', '', 'DISP-01', 'SW-01/9', 'BYS_BYSOSP_2008.3', '85" 4K display - primary'],
        ['Board Room', 'EQ-002', 'Crestron', 'CP4N', 'CREST-CP4N-001', '192.168.1.201', '00:05:CD:12:34:56', 'CTRL-01', 'SW-01/3', '2.009.0039', 'Control processor - main'],
        ['Board Room', 'EQ-003', 'Cisco', 'Room Kit Pro', 'FTT2447G123', '192.168.10.101', '00:1E:BD:12:34:56', 'CODEC-01', 'SW-01/4', 'ce9.15.3.23', 'Video conferencing codec'],
        ['Training Room', 'EQ-101', 'LG', '65UM5KD', 'LG-65-001', '192.168.2.110', '00:2A:3B:4C:5D:6E', 'DISP-02', 'SW-02/1', 'WebOS 4.5', '65" display for presentations'],
        ['Training Room', 'EQ-102', 'Crestron', 'DM-MD8X8', 'CREST-DM8-002', '192.168.2.201', '00:05:CD:78:90:AB', 'SWITCH-01', 'SW-02/2', '1.500.0025', 'Digital media switcher']
      ]
      
      // Create CSV content with proper escaping
      const csvContent = exampleData.map(row => 
        row.map(cell => {
          const cellStr = cell.toString()
          // Escape if contains comma, quote, or newline
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        }).join(',')
      ).join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `equipment-list-template-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Template export error:', error)
      alert('Error exporting template: ' + error.message)
    }
  }

  function exportToExcel() {
    try {
      if (typeof XLSX === 'undefined') {
        alert('Excel library not loaded. Please refresh the page and try again.')
        return
      }

      const workbook = XLSX.utils.book_new()
      const projectInfo = store.projectData?.projectInfo || {}
      
      // Create a comprehensive test results sheet
      const testResults = []
      
      // Add project header
      testResults.push(['ACCEPTANCE TEST PLAN RESULTS'])
      testResults.push(['Project:', projectInfo.projectName || 'Unknown Project'])
      testResults.push(['Client:', projectInfo.clientName || 'Unknown Client'])
      testResults.push(['Project #:', projectInfo.projectNumber || 'Unknown Number'])
      testResults.push(['Export Date:', new Date().toLocaleDateString()])
      testResults.push([])
      
      // Add room data
      const rooms = store.projectData?.rooms || {}
      Object.entries(rooms).forEach(([roomKey, room]) => {
        if (!room) return
        
        testResults.push([`ROOM: ${room.name || 'Unnamed Room'}`])
        testResults.push(['Description:', room.description || 'No description'])
        testResults.push([])
        
        // Add test data for each sheet
        const testData = room.testData || {}
        Object.entries(testData).forEach(([sheetKey, sheet]) => {
          if (!sheet) return
          
          testResults.push([`${sheet.title || 'Unnamed Sheet'} - ${sheet.description || 'No description'}`])
          testResults.push(['Item No', 'Category', 'Title', 'Description', 'Status', 'Notes', 'Initials', 'Owner', 'Date'])
          
          const categories = sheet.categories || []
          categories.forEach(category => {
            if (!category) return
            
            const items = category.items || []
            items.forEach(item => {
              if (!item) return
              
              testResults.push([
                item.id || '',
                category.name || '',
                item.title || '',
                item.description || '',
                item.status || 'pending',
                item.notes || '',
                item.initials || '',
                item.owner || '',
                item.date || ''
              ])
            })
          })
          testResults.push([])
        })
        testResults.push([])
      })
      
      // Create worksheet for test results
      const testWs = XLSX.utils.aoa_to_sheet(testResults)
      XLSX.utils.book_append_sheet(workbook, testWs, 'Test Results')
      
      // Create equipment sheets for each room
      Object.entries(rooms).forEach(([roomKey, room]) => {
        if (!room || !room.referenceData || !room.referenceData.equipment) return
        
        const equipment = room.referenceData.equipment
        const equipmentData = equipment.data || []
        
        if (equipmentData.length === 0) return
        
        const sheetData = []
        sheetData.push([`Equipment List - ${room.name}`])
        sheetData.push([])
        sheetData.push(equipment.headers || [])
        
        equipmentData.forEach(item => {
          const row = equipment.headers.map(header => {
            const key = store.getFieldKey(header)
            return item[key] || ''
          })
          sheetData.push(row)
        })
        
        const equipWs = XLSX.utils.aoa_to_sheet(sheetData)
        const safeName = room.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31)
        XLSX.utils.book_append_sheet(workbook, equipWs, `Equipment_${safeName}`)
      })
      
      // Create summary sheet
      const summary = []
      summary.push(['PROJECT SUMMARY'])
      summary.push([])
      summary.push(['Room', 'Total Tests', 'Completed', 'Progress %'])
      
      Object.entries(rooms).forEach(([roomKey, room]) => {
        const progress = store.calculateRoomProgress(roomKey)
        summary.push([
          room.name || 'Unnamed Room',
          progress.total,
          progress.completed,
          `${progress.percentage}%`
        ])
      })
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summary)
      XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary')
      
      // Generate filename and download
      const filename = `acceptance_test_plan_${projectInfo.projectNumber || 'project'}_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, filename)
      
    } catch (error) {
      console.error('Excel export error:', error)
      alert('Error exporting Excel file: ' + error.message)
    }
  }

  return {
    exportToCSV,
    exportEquipmentTemplate,
    exportToExcel
  }
}
