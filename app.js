// app.js
App({
  onLaunch() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    getUserInfo: null,
    role: '',
    pageSize: '5'
  },
  initUserInfo: function(res) {
    // 将用户名存在所有公共部分
    this.globalData.userInfo = res;
    // 本地“cookie”中赋值 
    wx.setStorageSync('userInfo', res);
  },
})
