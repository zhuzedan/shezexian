import { $requst } from '../utils/request'

// 公益类别查询
export const getWelfareCategoryList = () => {
  return $requst({
    url: '/api/app-base/queryWelfareCategoryList',
    method: 'GET'
  })
}
// 商业类别查询
export const getBusinessCategoryList = () => {
  return $requst({
    url: '/api/app-base/queryBusinessCategoryList',
    method: 'GET'
  })
}
// 宁波市下面的所有区
export const getAreaList = () => {
  return $requst({
    url: '/api/app-base/queryChildOrganization',
    method: 'GET'
  })
}
// 查询区域下面的街道
export const getStreetList = (orgCode) => {
  return $requst({
    url: '/api/app-base/queryNextLevelCodeAndName',
    method: 'GET',
    data: {
      orgCode: orgCode
    }
  })
}