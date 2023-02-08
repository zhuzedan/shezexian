// pages/mine/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },
  // 新增检查点
  newPoint() {
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    } else {
      wx.navigateTo({
        url: '../newPoint/index',
      })
    }
  },
  // 退出登录
  doLogout() {
    wx.showModal({
      title: '',
      content: '是否确认退出登录',
      complete: (res) => {
        if (res.cancel) {
          console.log('取消');
        }
        if (res.confirm) {
          console.log('sure');
          app.globalData.userInfo = null;
          wx.removeStorageSync('userInfo');
          this.setData({
            userInfo: null
          })
          wx.redirectTo({
            url: '/pages/login/index',
          })
        }
      }
    })
  },
  // 检查记录
  inspectionRecord() {
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    } else {
      wx.navigateTo({
        url: '../inspectionRecord/index',
      })
    }
  },
  auditRecord() {
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    } else {
      wx.navigateTo({
        url: '../auditRecord/index',
      })
    }
  },
  goLogin() {
    wx.navigateTo({
      url: '../login/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (app.globalData.userInfo != null) {
      console.log(app.globalData.getUserInfo);
      this.setData({
        oneUserInfo: app.globalData.getUserInfo
      })
    }
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: "mine"
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo
      // userName: userName
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