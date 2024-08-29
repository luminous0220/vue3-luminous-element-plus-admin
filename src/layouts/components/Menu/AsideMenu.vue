<template>
  <div class="h-full">
    <el-aside
      v-if="!globalStore.isMobile"
      class="transition-primary h-full"
      :style="{ width: isExpandMenu ? '210px' : globalStore.isMobile ? '0' : '75px' }">
      <div class="flex-center h-[var(--header-height)]">
        <span
          v-show="isExpandMenu"
          class="text-[--el-text-color-primary] text-[length:--el-font-size-large] whitespace-nowrap"
          >{{ title }}</span
        >
        <span
          v-show="!isExpandMenu"
          class="text-[--el-text-color-primary] text-[length:--el-font-size-large] whitespace-nowrap"
          >{{ title.slice(0, 2) }}</span
        >
      </div>
      <el-menu
        class="w-full!"
        :default-active="route.path"
        :collapse="!isExpandMenu"
        :router="false"
        :unique-opened="true"
        :collapse-transition="false">
        <el-scrollbar>
          <SubMenu :menu-list="menuList" />
        </el-scrollbar>
      </el-menu>
    </el-aside>

    <template v-else>
      <el-drawer
        v-model="globalStore.isExpandMenu"
        class="mobile-aside-menu"
        direction="ltr"
        size="60%"
        ref="basicDrawerRef">
        <div class="flex-center h-[var(--header-height)]">
          <span class="whitespace-nowrap">{{ title }}</span>
        </div>
        <el-menu
          class="w-full!"
          :default-active="route.path"
          :router="false"
          :unique-opened="true"
          :collapse-transition="false">
          <el-scrollbar>
            <SubMenu :menu-list="menuList" />
          </el-scrollbar>
        </el-menu>
      </el-drawer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore, useGlobalStore } from '@/stores'
import { useRoute } from 'vue-router'
import SubMenu from './SubMenu.vue'
const title = ref(import.meta.env.VITE_TITLE)

const basicDrawerRef = ref()
const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const isExpandMenu = computed(() => globalStore.isExpandMenu)
const menuList = computed(() => {
  return authStore.authMenuList
})

watchEffect(() => {
  if (route.fullPath) {
    basicDrawerRef.value?.handleClose()
  }
})
</script>
