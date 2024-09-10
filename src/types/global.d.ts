declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'crypto-js'
declare module 'cropperjs'

declare global {
  interface Window {
    $message: (typeof import('@/plugins'))['message']
    $confirm: (typeof import('@/plugins'))['confirm']
    $notice: (typeof import('@/plugins'))['notice']
  }
}
