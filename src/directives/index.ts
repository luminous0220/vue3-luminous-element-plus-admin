import type { App } from 'vue'
import { debounceDirective } from './debounce'
import { loadingDirective } from './loading'
import { throttleDirective } from './throttle'

/**
 * @description 注册全局组件
 */
export const setupGlobalDirectives = (vue: App) => {
  vue.directive('debounce', debounceDirective)
  vue.directive('load', loadingDirective)
  vue.directive('throttle', throttleDirective)
}
