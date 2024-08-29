import { createRouter, createWebHashHistory } from 'vue-router'
import { errorRoutes, staticRoutes } from './staticRoutes'
import { nprogress } from '@/plugins'
import { useAuthStore } from '@/stores'
import { CFG } from '@/config'
import { emitter, getToken } from '@/utils'
import { initDynamicRoutes } from './dynamicRoutes'
import { removeToken } from '@/utils'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutes, ...errorRoutes],
  strict: false,
  /* 用于记录右侧滚动条位置 */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  }
})

/**
 * @description 全局路由守卫
 * */
router.beforeEach(async (to, from, next) => {
  // * 加载动画
  nprogress.start()
  // 设置文档标题
  const title = import.meta.env.VITE_TITLE

  document.title = to.meta.title ? to.meta.title + '-' + title : title

  const data = getToken()

  // if (!to.matched.length) {
  //   return next({ path: '/404', replace: true })
  // }

  // token存在时
  if (data?.accessToken) {
    // 当用户访问登录页，则让它回跳到当前页面
    if (to.path === CFG.LOGIN_ROUTE) {
      next({ path: from.fullPath })
    }
    // 访问其它页面
    else {
      const authStore = useAuthStore()
      // 初始化动态路由

      if (!authStore.authMenuList.length) {
        try {
          await initDynamicRoutes()

          next({ ...to, replace: true })
        } catch (error) {
          emitter.emit('closeLoginLoading')
          // 😎 请求出错时，重定向到登陆页
          removeToken()
          // 回到登录页
          next({ path: CFG.LOGIN_ROUTE })
        }
      } else {
        // 路由页面不存在时就跳到404页面
        if (!to.matched.length) {
          return next({ path: '/404', replace: true })
        }
        next()
      }
    }
  }
  // token 不存在时
  else {
    // 重置路由
    resetRouter()
    // 判断访问页面是否在路由白名单地址中，如果存在则直接放行
    if (CFG.WHITE_LIST_PATH.includes(to.path)) {
      next()
    }
    // 否则回到到登录页
    else {
      next(CFG.LOGIN_ROUTE)
    }
  }
})

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const authStore = useAuthStore()
  authStore.flatAuthMenuListGet.forEach((item) => {
    const { name } = item
    if (name && router.hasRoute(name)) router.removeRoute(name)
  })
}

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  nprogress.done()
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  nprogress.done()
  console.warn('路由错误', error.message)
})

export default router
