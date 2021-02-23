
//user management
var pages = [
    //用户管理
    {
        path: 'management/user',
        name: 'managementUser',
        meta: {
            title: '用户管理',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/management/userManage')
    },
    //
    {
        path: 'management/addUserman',
        name: 'manageaddUserman',
        meta: {
            title: '添加用户',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/management/userManage/addUserman')
    },
     //角色管理
     {
        path: 'management/role',
        name: 'managementRole',
        meta: {
            title: '角色管理',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/management/roleManage')
    },
    //addRoleman
    {
        path: 'management/addRoleman',
        name: 'managementaddRoleman',
        meta: {
            title: '新建角色',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/management/roleManage/addRoleman')
    },
    //Page setup页面设置  Basic data management
    {
        path: 'basicdata/pagesetup',
        name: 'basicdataPagesetup',
        meta: {
            title: '页面设置',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/basicdata/pagesetup')
    },
    //项目设置Project settings
    {
        path: 'basicdata/projectSettings',
        name: 'basicdataProjectSettings',
        meta: {
            title: '项目设置',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/basicdata/projectSettings')
    },
    //store门店管理
    {
        path: 'basicdata/pagestore',
        name: 'basicdataPagesstore',
        meta: {
            title: '门店管理',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/basicdata/pagestore')
    },
     //store子门店管理
     {
        path: 'basicdata/pagestore/substores',
        name: 'basicdataSubstores',
        meta: {
            title: '子门店管理',
            auth: true,
            cache: false
        },
        component: () =>
            import('@/views/sunshinePartner/basicdata/pagestore/substores')
    },
    //staff 员工管理
    {
        path: 'basicdata/staffpages',
        name: 'basicdataStaffpages',
        meta: {
            title: '员工管理',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/basicdata/staffpages')
    },
    {
        path: 'basicdata/profitdistribution',
        name: 'profitdistribution',
        meta: {
            title: '分配规则',
            auth: true,
            cache: false
        },
        component: () =>
            import('@/views/sunshinePartner/basicdata/profitdistribution')
    },
    //Card data report 办卡数据报表  Statistical report
    {
        path: 'reportData/carddatareport',
        name: 'cardDatareport',
        meta: {
            title: '办卡数据报表',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/reportData/carddatareport')
    },
    {
        path: 'reportData/carddataimport',
        name: 'carddataimport',
        meta: {
            title: '办卡数据导入',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/reportData/carddataimport')
    },
    {
        path: 'reportData/cardrewardreview',
        name: 'cardrewardreview',
        meta: {
            title: '奖励明细审核',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/reportData/cardrewardreview')
    },
    {
        path: 'reportData/cardrewardreview',
        name: 'cardrewardreview',
        meta: {
            title: '奖励提现记录',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/reportData/cardrewardreview')
    },{
        path: 'reportData/cardrewardreview',
        name: 'cardrewardreview',
        meta: {
            title: '员工奖励报表',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/reportData/cardrewardreview')
    },
    {
        path: 'baobiaoData/performance',
        name: 'baoPerformance',
        meta: {
            title: '业绩统计（合伙人）',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/baobiaoData/performance')
    },
    {
        path: 'baobiaoData/cityarea',
        name: 'baoCityarea',
        meta: {
            title: '业绩统计（地市）',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/baobiaoData/cityarea')
    },
    {
        path: 'baobiaoData/storeData',
        name: 'baoStoredata',
        meta: {
            title: '业绩统计（门店）',
            auth: true,
            cache: true
        },
        component: () =>
            import('@/views/sunshinePartner/baobiaoData/storeData')
    },
]

export default pages
