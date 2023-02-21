import { $requst,$requstFile } from '../utils/request'
var app = getApp();
// 新增检查点
export const insertCheckPoint = (name,creditCode,businessType,categoryCode,areaOrgCode,streetOrgCode,address,connectName,connectTel,latitude,longitude) => {
  return $requst({
    url: '/api/app-my/appInsertCheckPoint',
    method: 'POST',
    data: {
      name: name,
      creditCode: creditCode,
      businessType: businessType,
      categoryCode: categoryCode,
      areaOrgCode: areaOrgCode,
      streetOrgCode: streetOrgCode,
      address: address,
      connectName: connectName,
      connectTel: connectTel,
      checkPersonId: app.globalData.getUserInfo.userId,
      latitude: latitude,
      longitude: longitude,
    }
  })
}
// 查询检查点审核记录
export const getCheckPointExamine = (current,pointName,categoryCode,status) => {
  return $requst({
    url: '/api/app-my/queryCheckPointExaminePage?checkPersonId='+app.globalData.getUserInfo.userId+'&current='+current+'&pageSize='+app.globalData.pageSize+'&pointName='+pointName+'&categoryCode=' +categoryCode+ '&status=' + status,
    method: 'POST'
  })
}
// 查询检查记录
export const getReportFormPage = (current,pointName,categoryCode,startDate,endDate,lowScore,highScore) => {
  return $requst({
    url: '/api/app-my/queryReportFormPage?userId='+app.globalData.getUserInfo.userId+'&current='+current+'&pageSize='+app.globalData.pageSize+'&pointName='+pointName+'&categoryCode=' +categoryCode+ '&startDate=' + startDate+'&endDate='+endDate+'&lowScore='+lowScore+'&highScore='+highScore,
    method: 'POST'
  })
}
// 查询检查记录--检查项
export const getReportItemList = (reportFormId) => {
  return $requst({
    url: '/api/app-my/queryReportItemList?reportFormId='+reportFormId,
    method: 'POST',
    data: {
      reportFormId: reportFormId
    }
  })
}
// 查询检查记录--图片
export const getReportPhotoList = (reportFormId) => {
  return $requst({
    url: '/api/app-my/queryReportPhotoList?reportFormId='+reportFormId,
    method: 'POST',
    data: {
      reportFormId: reportFormId
    }
  })
}
// 判断是否检查完48h之内
export const getJudgeUpdate = (reportFormId) => {
  return $requst({
    url: '/api/app-my/judgeUpdate?reportFormId='+reportFormId,
    method: 'POST',
    data: {
      reportFormId: reportFormId
    }
  })
}
// 48h之内，直接修改基础信息
export const updateReportForm = (checkPointAddress,checkPointName,connectName,connectTel,reportFormId) => {
  return $requst({
    url: '/api/app-my/updateReportForm',
    method: 'POST',
    data: {
      checkPointAddress: checkPointAddress,
      checkPointName: checkPointName,
      connectName: connectName,
      connectTel: connectTel,
      reportFormId: reportFormId
    }
  })
}
// 48h之内，直接修改检查项
export const updateReportItem = (itemId,itemName,score,reportItemId) => {
  return $requst({
    url: '/api/app-my/updateReportItem',
    method: 'POST',
    data: {
      itemId: itemId,
      itemName: itemName,
      score: score,
      reportItemId: reportItemId,
    }
  })
}
// 修改检查记录率先调用接口获得reportExamineId
export const insertReportExamine = (checkPointAddress,checkPointName,reportFormId) => {
  return $requst({
    url: '/api/app-my/insertReportExamine',
    method: 'POST',
    data: {
      checkPersonId: app.globalData.getUserInfo.userId,
      checkPointAddress: checkPointAddress,
      checkPointName: checkPointName,
      examineContent: '数据填写有误，请求修改',
      reportFormId: reportFormId
    }
  })
}
// 新增检查记录基础信息审批 insertReportFormExamine
export const insertReportFormExamine = (checkPointAddress,checkPointName,connectName,connectTel,reportExamineId,reportFormId) => {
  return $requst({
    url: '/api/app-my/insertReportFormExamine',
    method: 'POST',
    data: {
      checkPersonId: app.globalData.getUserInfo.userId,
      checkPointAddress: checkPointAddress,
      checkPointName: checkPointName,
      connectName: connectName,
      connectTel: connectTel,
      reportExamineId: reportExamineId,
      reportFormId: reportFormId
    }
  })
}
// 修改检查记录基础信息审批
export const updateReportFormExamine = (checkPointAddress,checkPointName,connectName,connectTel,reportFormExamineId) => {
  return $requst({
    url: '/api/app-my/updateReportFormExamine',
    method: 'POST',
    data: {
      checkPointAddress: checkPointAddress,
      checkPointName: checkPointName,
      connectName: connectName,
      connectTel: connectTel,
      reportFormExamineId: reportFormExamineId
    }
  })
}
// 新增检查记录检查项审批
export const insertReportItemExamine = (itemId,itemName,score,reportItemId,reportExamineId) => {
  return $requst({
    url: '/api/app-my/insertReportItemExamine',
    method: 'POST',
    data: {
      itemId: itemId,
      itemName: itemName,
      score: score,
      reportItemId: reportItemId,
      reportExamineId: reportExamineId,
    }
  })
}
// 修改检查记录检查项审批
export const updateReportItemExamine = (itemId,itemName,score,reportItemExamineId) => {
  return $requst({
    url: '/api/app-my/updateReportItemExamine',
    method: 'POST',
    data: {
      itemId: itemId,
      itemName: itemName,
      score: score,
      reportItemExamineId: reportItemExamineId,
    }
  })
}
// 删除报告表单图片
export const deleteReportPhoto = (reportPhotoId) => {
  return $requst({
    url: '/api/app-my/deleteReportPhoto?reportPhotoId='+reportPhotoId,
    method: 'POST'
  })
}
// 文件上传
export const uploadPic = (filePath) => {
  return $requstFile({
    filePath: filePath
  })
}
// 新增图片上传
export const insertReportPhoto = (photoId,photoTypeName,picAdd,reportFormId,sort) => {
  return $requst({
    url: '/api/app-my/insertReportPhoto',
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