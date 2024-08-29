<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import _ from 'lodash'
import { useTheme } from '@/hooks'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()

// init theme
const { initTheme } = useTheme()
initTheme()

globalStore.setDevice()

// * 监听视口变化，修改device与isExpandMenu的值
const setDevice_debounce = _.debounce(globalStore.setDevice, 300)
window.addEventListener('resize', setDevice_debounce, false)
</script>

<style scoped lang="scss"></style>
