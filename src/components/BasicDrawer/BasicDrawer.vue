<template>
  <el-drawer
    :size="globalStore.sizeGet"
    :fullscreen="globalStore.isMobile"
    v-model="visiable"
    :destroy-on-close="true"
    v-bind="$attrs">
    <slot />
    <template #footer v-if="!$attrs.hideFooter">
      <slot name="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" v-debounce @click="$emit('onConfirm')">确定</el-button>
      </slot>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { VNode } from 'vue'
import { useGlobalStore } from '@/stores'

withDefaults(defineProps<{ headerRender?: () => VNode }>(), {})

const globalStore = useGlobalStore()
const visiable = ref(false)

const open = () => {
  visiable.value = true
}
const close = () => {
  visiable.value = false
}

defineEmits<{ (e: 'onConfirm'): void }>()

defineExpose({
  visiable,
  open,
  close
})
</script>

<style scoped lang="scss"></style>
