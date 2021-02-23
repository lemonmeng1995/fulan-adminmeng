import { uniqueId } from 'lodash'
/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}


export const menuHeader = supplementPath([
  // { 
  //   title: '系统管理',
  //   icon: 'home',
  //   children:[{
  //    title: '用户管理',
  //    path:'/management/user'

  //   },{
  //    title: '角色管理',
  //    path:'/management/role'

  //   }]
  //   },
  {
    title: '基础数据管理',
    icon: 'folder-o',
    children: [{
      title: '页面设置',
      path: '/basicdata/pagesetup'
    }, {
      title: '项目设置',
      path: '/basicdata/projectSettings'
    }, {
      title: '门店管理',
      path: '/basicdata/pagestore'
    }, {
      title: '员工管理',
      path: '/basicdata/staffpages'
    }]
  },
  {
    title: '统计报表',
    icon: 'folder-o',
    children: [{
      title: '办卡数据导入',
      path: '/reportData/carddataimport'

    },
    {
      title: '办卡数据统计',
      path:'/reportData/carddatareport'
     },
    {
      title: '奖励明细审核',
      path: '/reportData/cardrewardreview'
    }
    ]
  },
 
])


export const menuAside = supplementPath([
  // { 
  //  title: '系统管理',
  //  icon: 'home',
  //  children:[{
  //   title: '用户管理',
  //   path:'/management/user'

  //  },{
  //   title: '角色管理',
  //   path:'/management/role'

  //  }]
  //  },
  {
    title: '基础数据管理',
    icon: 'folder-o',
    children: [{
      title: '页面设置',
      path: '/basicdata/pagesetup'

    }, {
      title: '项目设置',
      path: '/basicdata/projectSettings'
    }, {
      title: '门店管理',
      path: '/basicdata/pagestore'

    }, {
      title: '员工管理',
      path: '/basicdata/staffpages'
    }]
  },
  {
    title: '统计报表',
    icon: 'folder-o',
    children: [{
      title: '办卡数据导入',
      path: '/reportData/carddataimport'

    },
    {
      title: '办卡数据统计',
      path:'/reportData/carddatareport'
     },
    {
      title: '奖励明细审核',
      path: '/reportData/cardrewardreview'
    }
    ]
  }
])