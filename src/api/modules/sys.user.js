import request from '../service'
import configApi from "./configApi"
import {aes_encryptObject} from "../tools"


export function getcommonCaptcha() {
  return request({
    url: configApi.commonCaptcha,
    method: 'post',
  })
}

export function AccountLogin(data) {
  return request({
    url: configApi.userLogin,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

//图片上传
export function uploadComFun(data) {
  return request({
    url: configApi.uploadCom,
    method: 'post',
    data
  })
}

//页面设置详情
export function configEditeFun() {
  return request({
    url: configApi.configDetail,
    method: 'get'
  })
}
//configEdit页面设置编辑
export function configEditFun(data) {
  return request({
    url: configApi.configEdit,
    method: 'post',
    data:aes_encryptObject(data)
  })
}
//项目管理-更改状态
export function projectStatusFun(data) {
  return request({
    url: configApi.projectStatus,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

//项目管理-新增或者编辑
export function projectEditFun(data) {
  return request({
    url: configApi.projectEdit,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

//项目管理-更改状态
export function storeStatusFun(data) {
  return request({
    url: configApi.storeStatus,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

//项目管理-新增或者编辑
export function storeEditFun(data) {
  return request({
    url: configApi.storeEdit,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

//员工管理-更改状态
export function stafStatusFun(data) {
  return request({
    url: configApi.stafStatus,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

//员工管理-新增或者编辑
export function staffEditFun(data) {
  return request({
    url: configApi.staffEdit,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

//员工管理-导入员工
export function staffImportFun(data) {
  return request({
    url: configApi.staffImport,
    method: 'post',
    data:aes_encryptObject(data)
  })
}

// 省市区
export function AreaTreeCityFun() {
  return request({
    url: configApi.AreaTreeCity,
    method: 'get'
  })
}



//StorechildAddModify子门店列表添加修改
export function StorechildAddModifyFun(data) {
  return request({
    url: configApi.StorechildAddModify,
    method: 'post',
    data:aes_encryptObject(data)
  })
}
//StorechildChangeStatus
export function StorechildChangeStatusFun(data) {
  return request({
    url: configApi.StorechildChangeStatus,
    method: 'post',
    data:aes_encryptObject(data)
  })
}


////员工管理-列表
// export function staffListFun(data) {
//   return request({
//     url: configApi.staffList,
//     method: 'get',
//     data
//   })
// }

// //验证码 
// export function GetCaptcha(data) {
//   return request({
//     url: '/common/captcha',
//     method: 'post',
//     data
//   })
// }

//修改密码
export function ChangePwd(data) {
  return request({
    url: '/v1/customer/changepwd',
    method: 'post',
    data
  })
}
//获取活动列表 ----下拉

export function ActivityList(url,data) {
  return request({
    url: url,
    method: 'get',
    params: data
  }).then(res => {
    if (res.code === '0') {
      return res.data;
    }
  }).catch(e=>{
    console.log(e)
  })
}


// 获取菜单接口
export function getParnerMenu() {
  return request({
    url: 'v1/partner/menu',
    method: 'get'
  })
}
