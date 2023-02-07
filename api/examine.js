import { $requst } from '../utils/request'
var app = getApp();
// 分页查询审批的检查记录
export const getCheckPointExamine = (current,pointName) => {
  return $requst({
    url: '/api/app-approval/queryCheckPointExaminePage?current='+current+'&pageSize='+app.globalData.pageSize+'&leaderUserId='+app.globalData.getUserInfo.userId+'&pointName='+pointName,
    method: 'POST',
  })
}
// 分页查询审批的检查点记录
export const getReportExamine = (current,pointName) => {
  return $requst({
    url: '/api/app-approval/queryReportExaminePage?current='+current+'&pageSize='+app.globalData.pageSize+'&leaderUserId='+app.globalData.getUserInfo.userId+'&pointName='+pointName,
    method: 'POST',
  })
}
// 审批检查点
export const updateExamineResult = (examineId,examineResult) => {
  return $requst({
    url: '/api/app-approval/updateExamineResult',
    method: 'POST',
    data: {
      examineId: examineId,
      examineResult: examineResult
    }
  })
}
// 审批检查记录
export const updateReportExamine = (examineId,examineResult) => {
  return $requst({
    url: '/api/app-approval/updateReportExamine',
    method: 'POST',
    data: {
      reportExamineId: examineId,
      examineResult: examineResult,
      leaderUserId: app.globalData.getUserInfo.userId
    }
  })
}