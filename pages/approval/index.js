// pages/approval/index.js
var app = getApp();
var times = require('../../utils/times.js')
import {
  getReportExamine,
  updateReportExamine
} from '../../api/examine'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort: false,
    sortSelected: '0',
    pageIndex: 1,
    list: [],
    listB: []
  },
  updateReportExamine(e) {
    // console.log(e);
    let examineresult = e.currentTarget.dataset.examineresult
    let examineid = e.currentTarget.dataset.examineid
    console.log(examineid);
    let content = examineresult == '1' ? '确认同意审批' : '确认拒绝审批'
    wx.showModal({
      title: '提示',
      content,
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          wx.showLoading({
            title: '操作中',
            success: res => {
              updateReportExamine(examineid, examineresult).then((res) => {
                if (res.code == 200) {
                  wx.showToast({
                    title: '操作成功',
                    icon: "none"
                  })
                  this.getReportExaminePage()
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: "none"
                  })
                }
              })
            }
          })
        }
      },
    });
  },
  onLoad(options) {
    const res = wx.getSystemInfoSync()
    const {
      screenHeight,
      safeArea: {
        bottom
      }
    } = res
    // console.log('resHeight', res);
    if (screenHeight && bottom) {
      let safeBottom = screenHeight - bottom
      this.setData({
        height: 108 + safeBottom
      })
    }
    // console.log(this.data.height);

  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: "approval"
      })
    }
    this.getReportExaminePage()
  },
  // 检查点审核记录审批
  getReportExaminePage() {
    var that = this;
    that.setData({
      pageIndex: 1
    })
    getReportExamine(this.data.pageIndex, '').then((res) => {
      var dataArray = res.data.data
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
      }
      this.setData({
        listB: res.data.data,
        totalCountB: res.data.totalCount
      })
    })
  },

  // 检查点搜索框数据绑定
  checkPointHandle(e) {
    this.setData({
      checkPointHandle: e.detail.value
    })
  },
  // 检查记录搜索框动态绑定
  handle_content(e) {
    this.setData({
      handle_content: e.detail.value
    })
  },
  // 搜索检查记录
  go_search_examine() {
    if (!this.data.handle_content || this.data.handle_content == '') {
      this.getReportExaminePage()
      wx.removeStorageSync('handle_content')
    } else {
      wx.setStorageSync('handle_content', this.data.handle_content)
      getReportExamine(this.data.pageIndex, this.data.handle_content).then((res) => {
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
        }
        this.setData({
          listB: res.data.data,
          totalCountB: res.data.totalCount
        })
      })
    }
  },
  onPullDownRefresh: function () {
    // 在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    // 下拉刷新后，将页数重置为1,数组清空，是否请求完所有数据设置为fasle
    this.setData({
      pageIndex: 1,
      handle_content: '',
      checkPointHandle: ''
    });
    // 重新发起请求
    this.getReportExaminePage();
    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
  },
  onReachBottom() {
    var that = this;
    let pageCount = that.data.totalCountB % app.globalData.pageSize == 0 ? parseInt(that.data.totalCountB / app.globalData.pageSize) : parseInt(that.data.totalCountB / app.globalData.pageSize) + 1
    if (this.data.pageIndex < pageCount) {
      this.data.pageIndex++;
      getReportExamine(this.data.pageIndex, wx.getStorageSync('handle_content')).then((res) => {
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
        }
        this.setData({
          listB: that.data.listB.concat(res.data.data)
        })
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
    }

  }
})