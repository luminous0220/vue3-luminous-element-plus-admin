<template>
  <div
    class="w-full bg-[var(--loading-bg-color)] absolute top-0 left-0 bottom-0 right-0 flex-center z-999">
    <div class="flex flex-col flex-align-center">
      <div class="loader"></div>
      <div v-html="text" class="mt-80px ml-6px text-14px text-[--el-color-primary]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ text: string }>(), { text: '加载中...' })
</script>

<style scoped lang="scss">
.loader {
  width: 35px;
  aspect-ratio: 1;
  --_g: no-repeat radial-gradient(farthest-side, var(--el-color-primary), 94%, #0000);
  background:
    var(--_g) 0 0,
    var(--_g) 100% 0,
    var(--_g) 100% 100%,
    var(--_g) 0 100%;
  background-size: 40% 40%;

  animation: l38 0.5s infinite;
}

@keyframes l38 {
  100% {
    background-position:
      100% 0,
      100% 100%,
      0 100%,
      0 0;
  }
}
</style>
