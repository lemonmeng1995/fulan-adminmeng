const configApi = {
    commonCaptcha: '/v1/common/captcha', //获取验证码
    userLogin: '/v1/auth/login',  //账号登录
    uploadCom: '/v1/common/upload',     //图片上传
    configDetail: '/v1/config/detail',      //页面设置详情
    configEdit: '/v1/config/edit',      //页面设置编辑
    projectList: '/v1/project/list',      //项目管理-列表
    projectStatus: '/v1/project/status',      //项目管理-更改状态
    projectEdit: '/v1/project/edit',      //项目管理-新增或者编辑
    storeList: '/v1/store/list',      //门店管理-列表
    storeStatus: '/v1/store/status',      //门店管理-更改状态
    storeEdit: '/v1/store/edit',      //门店管理-新增或者编辑
    staffList: '/v1/staff/list',      //员工管理-列表
    stafStatus: '/v1/staff/status',      //员工管理-更改状态
    staffEdit: '/v1/staff/edit',      //员工管理-新增或者编辑
    staffProjectlist: '/v1/staff/projectlist',      //员工管理-项目下拉列表接口
    staffStorelist: '/v1/staff/storelist',      //员工管理-门店下拉列表接口
    staffChildStorelist: 'v1/store_child/get_storeid',      //员工管理-子门店下拉列表接口
    staffImport: '/v1/staff/import',      //员工管理-导入员工
    staffDownexcel: '/v1/staff/downexcel', //员工管理-下载模板
    applyCardDownexcel: '/v1/apply_card/downexcel', //统计报表 -办卡数据模板
    applyCardImport: '/v1/apply_card/import',  // 办卡数据导入
    applyCardList: '/v1/apply_card/list',  // 办卡列表以及导出
    profitDistribution: '/v1/project/profit_distribution',     //项目管理-利润分配详情
    profitDistributionEdit: '/v1/project/profit_distribution_edit', //项目管理-利润分配编辑
    applyCardExamineList:'/v1/apply_card/examine_list',
    applyCardExamine:'/v1/apply_card/examine',
    AreaTreeCity:'/v1/area/tree',          //省市区
    StoreChildList:'/v1/store_child/list?',   //'子门店列表'
    StorechildAddModify:'/v1/store_child/add_modify',   //子门店--添加/修改
    StorechildChangeStatus:'/v1/store_child/change_status',//子门店--修改状态
    StorechildImport:'/v1/store_child/import',//子门店-- 导入文件
    StorechildTemplate:'/v1/store_child/template',//子门店--模板下载
    reportPartner:'/v1/report/partner',//合伙人办卡业绩统计-列表
    reportCity:'/v1/report/city',//地市办卡业绩统计-列表
    reportStore:'/v1/report/store',//门店办卡业绩统计-列表
}

export default configApi