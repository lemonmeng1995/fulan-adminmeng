import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message, MessageBox } from 'element-ui'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
// import { menuAside } from '@/menu'

import { getParnerMenu } from "@api/modules/sys.user.js";
// 路由数据
import routes from './routes'

import { frameInRoutes } from '@/router/routes'

// fix vue-router NavigationDuplicated
if (process.env.NODE_ENV === 'development') {
  const VueRouterPush = VueRouter.prototype.push
  VueRouter.prototype.push = function push(location) {
    return VueRouterPush.call(this, location).catch(err => err)
  }
  const VueRouterReplace = VueRouter.prototype.replace
  VueRouter.prototype.replace = function replace(location) {
    return VueRouterReplace.call(this, location).catch(err => err)
  }
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes,
  mode: 'history'
})


let permissionMenu = []

let permission = {
  functions: [],
  roles: [],
  isAdmin: false
}

//标记是否已经拉取权限信息
// let isFetchPermissionInfo = false
sessionStorage.setItem('isFetchPermissionInfo', false)

// 处理
let fetchPermissionInfo = async () => {
  try {
    let userPermissionInfo = await getParnerMenu()
    if (userPermissionInfo.code == '0') {
      if (userPermissionInfo.data.menu_list) {
        permissionMenu = userPermissionInfo.data.menu_list
        permission.functions = userPermissionInfo.data.permission_list
      } else {
        MessageBox.confirm('您还未拥有系统权限,请先去配置权限', '配置提示', { type: 'warning' }).then(() => {
          router.push({ name: 'login' })
        }).catch(() => {
          router.push({ name: 'login' })
        })
        return
      }
    }   
  } catch (ex) {
    console.log(ex)
  }
  let allMenuAside = [...permissionMenu]


  store.commit('d2admin/page/init', [...frameInRoutes])
  // 设置侧边栏菜单
  store.commit('d2admin/menu/asideSet', allMenuAside)
  // 设置权限信息
  store.commit('d2admin/permission/set', permission)
  // 加载上次退出时的多页列表
  store.dispatch('d2admin/page/openedLoad')
  await Promise.resolve()
  return new Promise(resolve => { 
    resolve(permissionMenu)
  })

}


//免校验token白名单
let whiteList = ['/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (whiteList.indexOf(to.path) === -1) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      // 设置侧边栏菜单 --- 动态设置
      // console.log("设置侧边栏菜单",sessionStorage.getItem('name'))
      // if(sessionStorage.getItem('name') == 'cs_pf_gift'){

      //   store.commit('d2admin/menu/asideSet', menuAside)
      // }else{
      //   store.commit('d2admin/menu/asideSet', menuAside2)
      // }
      if (sessionStorage.getItem('isFetchPermissionInfo') == 'false') {
        let permissionMenu = await fetchPermissionInfo();
        console.log('permissionMenu', permissionMenu)
        if (permissionMenu) {
          sessionStorage.setItem('isFetchPermissionInfo', true)
          next(to.path, true)
        } else {
          NProgress.done()
        } 
      } else {
        // store.commit('d2admin/menu/asideSet', menuAside)
        next()
      }     
    } else {
      util.cookies.set('redirect', to.fullPath)
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
