var app = getApp();
var times = require('../../utils/times.js')
import {
  getReportFormPage
} from '../../api/mine'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1, //列表初始页
    totalCount: 0, //总个数
    handle_content: '',
    startDate: '',
    endDate: '',
    scoreLow: '',
    scoreHigh: '',
    filterdata: {}, //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    cateindex: 0, //一级分类索引
    cateid: null, //一级分类id
    subcateindex: 0, //二级分类索引
    subcateid: '', //二级分类id
    subcatetitle: null,
    monthtitle: '',
    scoretitle: '',
    areaindex: 0, //一级城市索引
    areaid: null, //一级城市id
    subareaindex: 0, //二级城市索引
    subareaid: null, //二级城市id
    scrolltop: null, //滚动位置
    page: 0, //分页
    category: {},
    area: {},
    sort: {},
    dataList: [],
    currentPage: 1,
    page: 0,
    value1: 0,
    value2: 'a',
    value3: 'd',
    value4: 'e'
  },
  fetchFilterData: function () { //获取筛选条件
    this.setData({
      month: [{
          "id": 0,
          "name": "全部"
        },
        {
          "id": 1,
          "name": "1月"
        },
        {
          "id": 2,
          "name": "2月",
        },
        {
          "id": 3,
          "name": "3月"
        },
        {
          "id": 4,
          "name": "4月",
        },
        {
          "id": 5,
          "name": "5月"
        },
        {
          "id": 6,
          "name": "6月",
        },
        {
          "id": 7,
          "name": "7月",
        },
        {
          "id": 8,
          "name": "8月",
        },
        {
          "id": 9,
          "name": "9月",
        },
        {
          "id": 10,
          "name": "10月",
        }, {
          "id": 11,
          "name": "11月",
        }, {
          "id": 12,
          "name": "12月",
        }
      ],
      score: [{
          "id": 0,
          "name": "全部"
        },
        {
          "id": '0,59',
          "name": "<60"
        },
        {
          "id": '60,69',
          "name": "60~70"
        },
        {
          "id": '70,79',
          "name": "70~80"
        },
        {
          "id": '80,89',
          "name": "80~90"
        },
        {
          "id": '90,100',
          "name": "90~100"
        }
      ]
    })
  },
  setFilterPanel: function (e) { //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (this.data.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
    console.log('显示第几个筛选类别：' + d.showfilterindex);
  },
  setCateIndex: function (e) { //分类一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    console.log(e);
    this.setData({
      cateindex: dataset.cateindex,
      cateid: dataset.cateid,
      subcateindex: d.cateindex == dataset.cateindex ? d.subcateindex : 0
    })
    if (this.data.cateid == 'undefind') {
      this.setData({
        subcatetitle: '',
        subcateid: ''
      })
      this.hideFilter()
      this.getAllData();
    }
    // console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
  },
  setSubcateIndex: function (e) { //分类二级索引
    const dataset = e.currentTarget.dataset;
    const that = this
    this.hideFilter()
    this.setData({
      subcatetitle: dataset.subcatetitle,
      subcateindex: dataset.subcateindex,
      subcateid: dataset.subcateid,
    })
    that.setData({
      pageIndex: 1
    })
    getReportFormPage(this.data.pageIndex, this.data.handle_content, this.data.subcateid, this.data.startDate, this.data.endDate, this.data.scoreLow, this.data.scoreHigh).then((res) => {
      var dataArray = res.data.data
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i]["checkDate"] = times.toDate(dataArray[i]["checkDate"])
      }
      if (res.code == 200) {
        that.setData({
          dataList: res.data.data,
          totalCount: res.data.totalCount
        })
      } else {
        wx.showToast({
          title: '系统发生错误',
        })
      }
    })
    // console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
  },
  setMonthIndex: function (e) { //月份索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    var date = new Date()
    const year = date.getFullYear()
    let dateObj = new Date(year,dataset.monthid,0);  //注意：这里传入月份取值范围是0-11
    let theMonthDay = dateObj.getDate();
    let startDate = `${year}-${dataset.monthid}-1`
    let endDate = `${year}-${dataset.monthid}-`+theMonthDay
    console.log('themonthday',theMonthDay);
    console.log('startdate',startDate)
    console.log('enddate',endDate)
    this.setData({
      monthindex: dataset.monthindex,
      monthtitle: dataset.monthtitle,
      monthid: dataset.monthid
    })
    var that = this;
    if (this.data.monthid == 0) {
      that.setData({
        pageIndex: 1,
        startDate: '',
        endDate: ''
      })
      this.hideFilter()
      this.getAllData();
    } else {
      that.setData({
        pageIndex: 1,
        startDate,
        endDate
      })
      getReportFormPage(this.data.pageIndex, this.data.handle_content, this.data.subcateid, this.data.startDate, this.data.endDate, this.data.scoreLow, this.data.scoreHigh).then((res) => {
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["checkDate"] = times.toDate(dataArray[i]["checkDate"])
        }
        if (res.code == 200) {
          that.setData({
            dataList: res.data.data,
            totalCount: res.data.totalCount
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'error'
          })
        }
      })
    }
    console.log('所在月份：一级id__' + this.data.monthid);
    this.hideFilter()
  },
  setScoreIndex: function (e) { //分数索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      scoreindex: dataset.scoreindex,
      scoreid: dataset.scoreid,
      scoretitle: dataset.scoretitle
    })
    console.log('所在月份：一级id__' + this.data.scoreid);
    var that = this;
    if (that.data.scoreid == 0) {
      that.setData({
        pageIndex: 1,
        scoreLow: '',
        scoreHigh: ''
      })
      this.hideFilter()
      this.getAllData();
    } else {
      let scoreArr = dataset.scoreid.split(',')
      that.setData({
        pageIndex: 1,
        scoreLow: scoreArr[0],
        scoreHigh: scoreArr[1]
      })
      getReportFormPage(this.data.pageIndex, this.data.handle_content, this.data.subcateid, this.data.startDate, this.data.endDate, this.data.scoreLow, this.data.scoreHigh).then((res) => {
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["checkDate"] = times.toDate(dataArray[i]["checkDate"])
        }
        if (res.code == 200) {
          that.setData({
            dataList: res.data.data,
            totalCount: res.data.totalCount
          })
        } else {
          wx.showToast({
            title: '系统发生错误',
          })
        }
      })
    }
    this.hideFilter()
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  getInspectionDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../inspectionDetail/index?item=' + JSON.stringify(item),
    })
  },
  goEdit(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../inspectionEdit/index?item=' + JSON.stringify(item),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchFilterData();
  },
  // 初始加载数据
  getAllData() {
    var that = this;
    that.setData({
      pageIndex: 1
    })
    getReportFormPage(this.data.pageIndex, this.data.handle_content, this.data.subcateid, this.data.startDate, this.data.endDate, this.data.scoreLow, this.data.scoreHigh).then((res) => {
      var dataArray = res.data.data
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i]["checkDate"] = times.toDate(dataArray[i]["checkDate"])
      }
      if (res.code == 200) {
        that.setData({
          dataList: res.data.data,
          totalCount: res.data.totalCount
        })
      }
    })
  },
  handle_content(e) {
    this.setData({
      handle_content: e.detail.value
    })
  },
  to_search() {
    const that = this
    that.setData({
      pageIndex: 1
    })
    getReportFormPage(this.data.pageIndex, this.data.handle_content, this.data.subcateid, this.data.startDate, this.data.endDate, this.data.scoreLow, this.data.scoreHigh).then((res) => {
      var dataArray = res.data.data
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i]["checkDate"] = times.toDate(dataArray[i]["checkDate"])
      }
      if (res.code == 200) {
        that.setData({
          dataList: res.data.data,
          totalCount: res.data.totalCount
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAllData();
    this.get_type()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    // 下拉刷新后，将页数重置为1,数组清空，是否请求完所有数据设置为fasle
    this.setData({
      pageIndex: 1,
      handle_content: '',
      subcatetitle: '',
      monthtitle: '',
      subcateid: '',
      startDate: '',
      endDate: '',
      scoreLow: '',
      scoreHigh: '',
      scoretitle: ''
    });
    // 重新发起请求
    this.getAllData();
    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var that = this;
    let pageCount = that.data.totalCount % app.globalData.pageSize == 0 ? parseInt(that.data.totalCount / app.globalData.pageSize) : parseInt(that.data.totalCount / app.globalData.pageSize) + 1
    if (this.data.pageIndex < pageCount) {
      this.data.pageIndex++;
      getReportFormPage(this.data.pageIndex, this.data.handle_content, this.data.subcateid, this.data.startDate, this.data.endDate, this.data.scoreLow, this.data.scoreHigh).then((res) => {
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["checkDate"] = times.toDate(dataArray[i]["checkDate"])
        }
        if (res.code == 200) {
          that.setData({
            dataList: that.data.dataList.concat(res.data.data),
          })
        }
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  get_type() {
    let category = wx.getStorageSync('category')
    this.setData({
      category
    })
  },
})