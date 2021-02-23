import layoutHeaderAside from '@/layout/header-aside'
import statisticsRoutes from './statistics/routes'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
// const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const routes = [
  // 首页
  {
    path: 'index',
    name: 'index',
    meta: {
      auth: true
    },
    component: () =>
      import("@/views/system/index")
  },
  // 刷新页面 必须保留
  {
    path: 'refresh',
    name: 'refresh',
    hidden: true,
    component: {
      beforeRouteEnter (to, from, next) {
        next(vm => vm.$router.replace(from.fullPath))
      },
      render: h => h()
    }
  },
  // 页面重定向 必须保留
  {
    path: 'redirect/:route*',
    name: 'redirect',
    hidden: true,
    component: {
      beforeRouteEnter (to, from, next) {
        next(vm => vm.$router.replace(JSON.parse(from.params.route)))
      },
      render: h => h()
    }
  }
]
const children = [...routes, ...statisticsRoutes]
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: children
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('@/views/system/login')
  }
]
/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: () =>
      import('@/views/system/error/404')
  }
]
// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
