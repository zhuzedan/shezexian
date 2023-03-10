// pages/editPassword/index.js
var app = getApp();
import {
  updatePassWord,
} from '../../api/base'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultType: true,
    passwordType: true,
    defaultType1: true,
    passwordType1: true
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
  eyeStatus1: function () {
    this.data.defaultType1 = !this.data.defaultType1
    this.data.passwordType1 = !this.data.passwordType1
    this.setData({
      defaultType1: this.data.defaultType1,
      passwordType1: this.data.passwordType1
    })
  },
  getNewPassword: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  getConfirmPassword: function (e) {
    this.setData({
      passwordConfirm: e.detail.value
    });
  },
  submit() {
    if (this.data.password != this.data.passwordConfirm) {
      wx.showToast({
        title: '前后密码输入不一致',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '确认修改密码吗',
        content: '',
        complete: (res) => {
          if (res.cancel) {

          }
          if (res.confirm) {
            updatePassWord(this.data.userId, this.data.password).then((res) => {
              if (res.code == 200) {
                wx.showModal({
                  title: '修改密码成功，请重新登录后使用',
                  confirmText: '确定',
                  showCancel: false,
                  complete: (res) => {
                    if (res.cancel) {

                    }
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/pages/login/index',
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'error'
                })
              }
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userId: app.globalData.getUserInfo.userId,
      userName: app.globalData.getUserInfo.userName
    })
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