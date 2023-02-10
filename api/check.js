import { $requst,$requstFile } from '../utils/request'
var app = getApp();
// 检查点分页查询
export const getCheckPointPage = (current,name,streetOrgCode,categoryCode,userLatitude,userLongitude,sortType) => {
  return $requst({
    url: '/api/app-check/queryCheckPointPage',
    method: 'GET',
    data: {
      current: current,
      pageSize: app.globalData.pageSize,
      name: name || '',
      streetOrgCode: streetOrgCode || '',
      categoryCode: categoryCode || '',
      userLatitude: userLatitude || '',
      userLongitude: userLongitude || '',
      sortType: sortType || ''
    }
  })
}
// 查询单个检查点详情
export const getCheckPointOne = (checkPointId) => {
  return $requst({
    url: '/api/app-check/queryCheckPointOne',
    method: 'GET',
    data: {
      checkPointId: checkPointId
    }
  })
}
// 查询检查项
export const getCheckItem = (categoryCode,orgCode) => {
  return $requst({
    url: '/api/app-check/queryCheckItem',
    method: 'GET',
    data: {
      categoryCode: categoryCode,
      orgCode:orgCode
    }
  })
}
// 查询检查表图片类型与名称
export const getCheckPhotoList = (categoryCode,orgCode) => {
  return $requst({
    url: '/api/app-check/queryCheckPhotoList',
    method: 'GET',
    data: {
      categoryCode: categoryCode,
      orgCode:orgCode
    }
  })
}
// 新增报告表单基础信息
export const insertReportForm = (checkPointId,checkPointNAddress,checkPointName,connectName,connectTel) => {
  return $requst({
    url: '/api/app-check/insertReportForm',
    method: 'POST',
    data: {
      checkPointId: checkPointId,
      checkPointNAddress:checkPointNAddress,
      checkPointName:checkPointName,
      connectName: connectName,
      connectTel: connectTel,
      userId: app.globalData.getUserInfo.userId
    }
  })
}
// 修改报告表单基础信息
export const updateReportForm = (checkPointAddress,checkPointName,connectName,connectTel,reportFormId) => {
  return $requst({
    url: '/api/app-check/updateReportForm',
    method: 'POST',
    data: {
      checkPointAddress:checkPointAddress,
      checkPointName:checkPointName,
      connectName: connectName,
      connectTel: connectTel,
      reportFormId: reportFormId
    }
  })
}
// 修改报告表单检查项
export const updateReportItem = (itemId,itemName,reportItemId,score) => {
  return $requst({
    url: '/api/app-check/updateReportItem',
    method: 'POST',
    data: {
      itemId:itemId,
      itemName:itemName,
      reportItemId: reportItemId,
      score: score
    }
  })
}
// 新增图片上传
export const insertReportPhoto = (photoId,photoTypeName,picAdd,reportFormId,sort) => {
  return $requst({
    url: '/api/app-check/insertReportPhoto',
    method: 'POST',
    data: {
      photoId: photoId,
      photoTypeName:photoTypeName,
      picAdd:picAdd,
      reportFormId: reportFormId,
      sort: sort
    }
  })
}
// 删除图片
export const deleteReportPhoto = (reportPhotoId) => {
  return $requst({
    url: '/api/app-check/deleteReportPhoto?reportPhotoId='+reportPhotoId,
    method: 'POST'
  })
}
// 新增签名
export const updateReportFormSignature = (reportFormId,signatureAdd) => {
  return $requst({
    url: '/api/app-check/updateReportFormSignature?reportFormId='+reportFormId+'&signatureAdd='+signatureAdd,
    method: 'POST'
  })
}
// 文件上传
export const uploadPic = (filePath) => {
  return $requstFile({
    filePath: filePath
  })
}