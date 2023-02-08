// pages/login/index.js
import { appLogin,getUserInfo } from '../../api/login'
// 获取公共app
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultType: true,
    passwordType: true,
    userName: '',
    password: ''
  },
  // input输入框内容双向绑定-用户名
  bindUserName: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },
  // input输入框内容双向绑定-密码
  bindPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 显示or关闭密码
  eyeStatus: function () {
    this.data.defaultType = !this.data.defaultType
    this.data.passwordType = !this.data.passwordType
    this.setData({
      defaultType: this.data.defaultType,
      passwordType: this.data.passwordType
    })
  },
  // 登录按钮跳转到检查页
  login() {
    var userName = this.data.userName
    var password = this.data.password
    if (userName == '') {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      })
      return;
    }
    if (password == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    appLogin(this.data.userName,this.data.password).then((res) => {
      if (res.code == 200) {
        // 初始化用户信息
        app.initUserInfo(res.data);
        // 获取当前登录用户
        getUserInfo().then((res) => {
          // console.log('当前用户数据',res);
          app.globalData.getUserInfo = res.data
          // 角色存入缓存中
          console.log('isleader',app.globalData.getUserInfo);
          wx.setStorageSync('role', app.globalData.getUserInfo.isLeader)
          // 成功进入检查页
          wx.switchTab({
            url: '../index/index',
          })
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log('登录界面获取经纬度',latitude, longitude);
        wx.setStorageSync('userLatitude', latitude)
        wx.setStorageSync('userLongitude', longitude)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})