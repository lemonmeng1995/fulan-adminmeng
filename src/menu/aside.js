// 菜单 侧边栏
export default [
  {
    title: '业绩报表',
    icon: 'folder-o',
    children: [{
      title: '业绩统计（合伙人）',
      path: '/baobiaoData/performance',
      children:null,

    },
    {
      title: '业绩统计（地市）',
      path:'/baobiaoData/cityarea',
      children:null,
     },
    {
      title: '业绩统计（门店）',
      path: '/baobiaoData/storeData',
      children:null,
    }
    ]
  }
  ]
  