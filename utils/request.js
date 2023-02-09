import {baseUrl} from '../config/index'
// 获取公共app
var app = getApp();
// 封装网络请求函数
export const $requst = (params = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: baseUrl + params.url,
      header: {
        "Authorization": "Bearer " + app.globalData.userInfo.token
      },
      data: params.data || {},
      method: params.method,
      success: (res) => {
        wx.hideLoading()
        // console.log('success', res.data)
        resolve(res.data)
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: 'error',
          icon: 'error'
        })
        reject(err)
      }
    })
  })
}
// 封装网络请求登录函数(不带请求头)
export const $requstLogin = (params = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: baseUrl + params.url,
      data: params.data || {},
      method: params.method,
      success: (res) => {
        wx.hideLoading()
        console.log('success', res.data)
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
// 封装文件上传请求
export const $requstFile = (params = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    wx.uploadFile({
      filePath: params.filePath,
      name: 'file',
      url: baseUrl + '/api/app-check/uploadPic',
      header: {
        "Authorization": "Bearer " + app.globalData.userInfo.token
      },
      success: (res) => {
        wx.hideLoading()
        resolve(res.data)
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: 'error',
          icon: 'error'
        })
        reject(err)
      }
    })
  })
}