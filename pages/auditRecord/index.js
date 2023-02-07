var app = getApp();
var times = require('../../utils/times.js')
import { getCheckPointExamine } from '../../api/mine'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hanlde_content: '',
    statusid: '',
    filterdata: {}, //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    cateindex: 0, //一级分类索引
    cateid: null, //一级分类id
    subcateindex: 0, //二级分类索引
    subcateid: '', //二级分类id
    areaindex: 0, //一级城市索引
    areaid: null, //一级城市id
    subareaindex: 0, //二级城市索引
    subareaid: null, //二级城市id
    scrolltop: null, //滚动位置
    page: 0, //分页
    category: {},
    area: {},
    status: {},
    pageIndex: 1, //列表初始页
    list: [], //存放所有数据
    value1: 0,
    value2: 'a',
    value3: 'd',
    value4: 'e'
  },
  onShow() {

  },
  fetchFilterData: function () { //获取筛选条件
    this.setData({
      status: [{
          "id": 'undefind',
          "name": "全部"
        },
        {
          "id": 0,
          "name": "待审核"
        },
        {
          "id": 1,
          "name": "审批通过",
        },
        {
          "id": 2,
          "name": "未通过"
        },
      ],
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
    console.log(dataset);
    this.setData({
      cateindex: dataset.cateindex,
      cateid: dataset.cateid,
      subcateindex: d.cateindex == dataset.cateindex ? d.subcateindex : 0
    })
    if(this.data.cateid == 'undefind') {
      {
        this.hideFilter();
        this.getAllData();
        wx.removeStorageSync('subcateid')
      }
    }
    // console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
  },
  setSubcateIndex: function (e) { //分类二级索引
    const dataset = e.currentTarget.dataset;
    const that = this
    this.hideFilter()
    this.setData({
      subcateindex: dataset.subcateindex,
      subcateid: dataset.subcateid,
    })
    if (this.data.cateid == 'undefind') {
      this.getAllData()
      wx.removeStorageSync('subcateid')
    }else {
      wx.setStorageSync('subcateid', this.data.subcateid)
      that.setData({
        pageIndex: 1
      })
      getCheckPointExamine(this.data.pageIndex,this.data.hanlde_content,this.data.subcateid,'').then((res) => {
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
          if (dataArray[i]["examineResult"] == 0) {
            dataArray[i]["examineResult"] = '待审核'
          } else if (dataArray[i]["examineResult"] == 1) {
            dataArray[i]["examineResult"] = '通过'
          } else if (dataArray[i]["examineResult"] == 2) {
            dataArray[i]["examineResult"] = '未通过'
          }
        }
        if (res.code == 200) {
          that.setData({
            list: res.data.data,
            totalCount: res.data.totalCount
          })
        }
      })      
    }
    // console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
  },
  setStatusIndex: function (e) { 
    // const d = this.data;
    const that = this
    const {
      statusindex,
      statusid
    } = e.currentTarget.dataset
    this.setData({
      statusindex,
      statusid
    })
    if (statusid == 'undefind') {
      this.hideFilter();
      this.getAllData();
      wx.removeStorageSync('statusid')
    } else {
      that.setData({
        pageIndex: 1
      })
      wx.setStorageSync('statusid', this.data.statusid)
      getCheckPointExamine(this.data.pageIndex,this.data.hanlde_content,this.data.subcateid,this.data.statusid,'').then((res) => {
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
          if (dataArray[i]["examineResult"] == 0) {
            dataArray[i]["examineResult"] = '待审核'
          } else if (dataArray[i]["examineResult"] == 1) {
            dataArray[i]["examineResult"] = '通过'
          } else if (dataArray[i]["examineResult"] == 2) {
            dataArray[i]["examineResult"] = '未通过'
          }
        }
        if (res.code == 200) {
          that.setData({
            list: res.data.data,
            totalCount: res.data.totalCount
          })
        }
      })
    }
    // console.log('所在地区：一级id__' + this.data.statusid);
    this.hideFilter()
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  getDetail(e) {
    let index = e.currentTarget.dataset.index
    let item = JSON.stringify(this.data.list[index])
    wx.navigateTo({
      url: '../auditDetail/index?item=' + item,
    })
  },
  getModify(e) {
    let index = e.currentTarget.dataset.index
    let item = JSON.stringify(this.data.list[index])
    wx.navigateTo({
      url: '../auditModify/index?item=' + item,
    })
  },
  // 搜索数据绑定
  hanlde_content(e) {
    this.setData({
      hanlde_content: e.detail.value
    })
  },
  // 搜索查询
  go_search() {
    var that = this;
    that.setData({
      pageIndex: 1
    })
    getCheckPointExamine(this.data.pageIndex,this.data.hanlde_content,'','').then((res) => {
      var dataArray = res.data.data
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
        if (dataArray[i]["examineResult"] == 0) {
          dataArray[i]["examineResult"] = '待审核'
        } else if (dataArray[i]["examineResult"] == 1) {
          dataArray[i]["examineResult"] = '通过'
        } else if (dataArray[i]["examineResult"] == 2) {
          dataArray[i]["examineResult"] = '未通过'
        }
      }
      if (res.code == 200) {
        that.setData({
          list: res.data.data,
          totalCount: res.data.totalCount
        })
      }
    })
  },
  onLoad: function (options) {
    this.get_type();
    this.getAllData();
    this.fetchFilterData();
  },
  // 加载数据
  getAllData() {
    var that = this;
    that.setData({
      pageIndex: 1
    })
    getCheckPointExamine(this.data.pageIndex,'','','').then((res) => {
      console.log('加载数据', res);
      var dataArray = res.data.data
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
        if (dataArray[i]["examineResult"] == 0) {
          dataArray[i]["examineResult"] = '待审核'
        } else if (dataArray[i]["examineResult"] == 1) {
          dataArray[i]["examineResult"] = '通过'
        } else if (dataArray[i]["examineResult"] == 2) {
          dataArray[i]["examineResult"] = '未通过'
        }
      }
      if (res.code == 200) {
        that.setData({
          list: res.data.data,
          totalCount: res.data.totalCount
        })
      }
    })
  },
  onPullDownRefresh: function () {
    // 在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    wx.removeStorageSync('subcateid')
    wx.removeStorageSync('statusid')
    // 下拉刷新后，将页数重置为1,数组清空，是否请求完所有数据设置为fasle
    this.setData({
      pageIndex: 1,
      hanlde_content: ''
    });
    // 重新发起请求
    this.getAllData();
    wx.hideNavigationBarLoading();//隐藏导航条加载动画。
    wx.stopPullDownRefresh();//停止当前页面下拉刷新。
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    let pageCount = that.data.totalCount % app.globalData.pageSize == 0 ? parseInt(that.data.totalCount / app.globalData.pageSize) : parseInt(that.data.totalCount / app.globalData.pageSize) + 1
    if (this.data.pageIndex < pageCount) {
      this.data.pageIndex++;
      getCheckPointExamine(this.data.pageIndex,this.data.hanlde_content,wx.getStorageSync('subcateid'),wx.getStorageSync('statusid')).then((res) => {
        console.log('加载数据', res);
        var dataArray = res.data.data
        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i]["gmtCreate"] = times.toDate(dataArray[i]["gmtCreate"])
          if (dataArray[i]["examineResult"] == 0) {
            dataArray[i]["examineResult"] = '待审核'
          } else if (dataArray[i]["examineResult"] == 1) {
            dataArray[i]["examineResult"] = '通过'
          } else if (dataArray[i]["examineResult"] == 2) {
            dataArray[i]["examineResult"] = '未通过'
          }
        }
        if (res.code == 200 & res.data.data.length != 0) {
          that.setData({
            list: that.data.list.concat(res.data.data),
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
  // 获取类别
  get_type() {
    let category = wx.getStorageSync('category')
    this.setData({
      category
    })
  },
})