<template>
  <div class="sidebar">
    <SidebarHeader />
    <RoomSelector />
    <SearchContainer />
    <NavigationContent />
    <SidebarActions />
  </div>
</template>

<script setup>
import SidebarHeader from './SidebarHeader.vue'
import RoomSelector from './RoomSelector.vue'
import SearchContainer from './SearchContainer.vue'
import NavigationContent from './NavigationContent.vue'
import SidebarActions from './SidebarActions.vue'
</script>
