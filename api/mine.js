import { $requst } from '../utils/request'
var app = getApp();
// 新增检查点
export const insertCheckPoint = (name,businessType,categoryCode,areaOrgCode,streetOrgCode,address,connectName,connectTel,latitude,longitude) => {
  return $requst({
    url: '/api/app-my/appInsertCheckPoint',
    method: 'POST',
    data: {
      name: name,
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
// 修改检查记录率先调用接口获得reportExamineId
export const insertReportExamine = (checkPointAddress,checkPointName,reportFormId) => {
  return $requst({
    url: '/api/app-my/insertReportExamine',
    method: 'POST',
    data: {
      checkPersonId: app.globalData.getUserInfo.userId,
      checkPointAddress: checkPointAddress,
      checkPointName: checkPointName,
      examineContent: '1',
      reportFormId: reportFormId
    }
  })
}
// 修改检查记录基础信息 insertReportFormExamine
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