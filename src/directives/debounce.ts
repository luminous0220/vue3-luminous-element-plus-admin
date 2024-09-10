/**
 * v-debounce
 * 按钮防抖指令，可自行扩展至input
 * 接收参数：function类型
 */
import type { Directive, DirectiveBinding } from 'vue';
interface ElType extends HTMLElement {
  _click: () => any;
}
const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function';
    }
    let timer: NodeJS.Timeout | null = null;
    el._click = function () {
      if (timer) {
        clearInterval(timer);
      }
      timer = setTimeout(() => {
        binding.value();
      }, 500);
    };
    el.addEventListener('click', el._click);
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el._click);
  },
};

export default debounce;
