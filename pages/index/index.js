var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
var qqmapsdk = new QQMapWX({
  key: 'VIRBZ-B676P-WDCDC-LVCZD-PUSHO-3NFWZ'
});
import {
  getCheckPointPage
} from '../../api/check'
import {
  getWelfareCategoryList,
  getBusinessCategoryList,
  getAreaList,
  getStreetList
} from '../../api/base'
Page({
  data: {
    sortType: 0,
    sortTitle: '',
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    cateindex: 0, //一级分类索引
    cateid: null, //一级分类id
    subcateindex: 0, //二级分类索引
    subcateid: null, //二级分类id
    subcatetitle: null,
    substreettitle: null,
    areaindex: 0, //一级城市索引
    areaid: null, //一级城市id
    subareaindex: 0, //二级城市索引
    subareaid: null, //二级城市id
    page: 0, //分页
    category: {},
    area: {},
    sort: {},
    pageIndex: 1, //列表初始页
    list: [], //存放所有数据
    currentIndex: 0, //默认第一个
    totalCount: 1,
    height: 0,
    categoryCode: '',
    category: [{
        "id": 'undefind',
        "title": "全部"
      },
      {
        "id": 0,
        "title": "公益",
        "cate_two": []
      },
      {
        "id": 1,
        "title": "商业",
        "cate_two": []
      }
    ],
    area: [{
      "id": 0,
      "name": "全部"
    }],
    zone: [],
    sort: [{
        "id": 12,
        "name": "时间排序"
      },
      {
        "id": 12,
        "name": "距离排序"
      }
    ]
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
    this.setData({
      cateindex: dataset.cateindex,
      cateid: dataset.cateid,
      subcateindex: d.cateindex == dataset.cateindex ? d.subcateindex : 0
    })
    if (this.data.cateid == 'undefind') {
      this.hideFilter()
      this.setData({
        subcatetitle: '',
        categoryCode: ''
      })
      this.loadInitData()
    }
    // console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
  },
  setSubcateIndex: function (e) { //分类二级索引
    const dataset = e.currentTarget.dataset;
    var that = this;
    this.hideFilter()
    this.setData({
      subcateindex: dataset.subcateindex,
      subcateid: dataset.subcateid,
      subcatetitle: dataset.subcatetitle
    })
    const categoryCode = dataset.subcateid
    that.setData({
      pageIndex: 1,
      categoryCode,
    })
    getCheckPointPage(this.data.pageIndex, this.data.searchValue, this.data.streetOrgCode, this.data.categoryCode, this.data.latitude, this.data.longitude).then((res) => {
      console.log('类别筛选', res);
      if (res.code == 200) {
        that.setData({
          list: res.data.data,
          totalCount: res.data.totalCount
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
    console.log('类别：一级id__' + this.data.cateid + ',二级id__' + this.data.subcatetitle);
  },
  setAreaIndex: function (e) { //地区一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    let orgCode = dataset.areaid
    // 不等于0，说明有二级索引
    if (orgCode != 0) {
      // 杭州湾无二级索引
      if (orgCode == '330285000000') {
        let zone = []
        console.log('选中了杭州湾');
        let obj = {
          id: '330285000000',
          name: '杭州湾全域'
        }
        zone.push(obj)
        this.setData({
          zone
        })
      } else {
        getStreetList(orgCode).then((res) => {
          let len = res.data.length
          let zone = []
          for (let i = 0; i < len; i++) {
            let obj = {
              id: res.data[i].orgCode,
              name: res.data[i].name
            }
            zone.push(obj)
          }
          this.setData({
            zone
          })
          console.log(this.data.zone);
        })
      }

    }
    this.setData({
      areaindex: dataset.areaindex,
      areaid: dataset.areaid,
      subareaindex: d.areaindex == dataset.areaindex ? d.subareaindex : 0
    })
    console.log('areaOrgCode' + this.data.areaid);
    // 选中的是全部，直接弹窗关闭
    if (this.data.areaid == 0) {
      this.setData({
        substreettitle: '',
        streetOrgCode: ''
      })
      this.hideFilter();
      this.loadInitData();
    }
    // console.log('所在地区：一级id__' + this.data.areaid + ',二级id__' + this.data.subareaid);
  },
  setSubareaIndex: function (e) { //地区二级索引
    const dataset = e.currentTarget.dataset;
    let streetOrgCode = dataset.subareaid
    const that = this
    that.setData({
      pageIndex: 1,
      streetOrgCode,
      substreettitle: dataset.substreettitle
    })
    getCheckPointPage(this.data.pageIndex, this.data.searchValue, this.data.streetOrgCode, this.data.categoryCode, this.data.latitude, this.data.longitude).then((res) => {
      console.log('地区查筛选', res);
      if (res.code == 200) {
        that.setData({
          list: res.data.data,
          totalCount: res.data.totalCount
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
    this.hideFilter()
    this.setData({
      subareaindex: dataset.subareaindex,
      subareaid: dataset.subareaid,
    })
    // console.log('所在地区：一级id__' + this.data.areaid + ',二级id__' + this.data.subareaid);
  },
  setSortIndex: function (e) { //排序索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid,
    })
    console.log(dataset);
    if (dataset.sortindex == 0) {
      this.setData({
        sortTitle: '时间排序'
      })
      this.loadInitData();
    }
    var that = this;
    if (dataset.sortindex == 1) {
      that.setData({
        sortTitle: '距离排序',
        pageIndex: 1
      })
      getCheckPointPage(this.data.pageIndex, this.data.searchValue, this.data.streetOrgCode, this.data.categoryCode, this.data.latitude, this.data.longitude, '1').then((res) => {
        if (res.code == 200) {
          that.setData({
            list: res.data.data,
          })
        } else {
          wx.showToast({
            title: res.msg,
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
  fillReport(e) {
    console.log(e.currentTarget.dataset);
    const {
      checkpointid,
      categorycode,
      streetorgcode
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../fillReport/index?checkPointId=' + checkpointid + '&categoryCode=' + categorycode + '&streetOrgCode=' + streetorgcode,
    })
  },
  gotoMap(e) {
    const {
      address,
      longitude,
      latitude
    } = e.currentTarget.dataset
    console.log('address', address);
    var that = this;

    // qqmapsdk.geocoder({
    //   address: address,
    //   success: function (res) { //成功后的回调
    //     var lat = res.result.location.lat;
    //     var lng = res.result.location.lng;
    //     that.setData({
    //       lat,
    //       lng
    //     })
    //     console.log('sdk地址解析经纬度',that.data.lat,that.data.lng);
    //   },
    //   fail: function (error) {
    //     wx.showToast({
    //       title: '无法定位到该地址，请确认地址信息！'+error,
    //       icon: 'none'
    //     })
    //   },
    // });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: parseFloat(latitude) ? parseFloat(latitude) : parseFloat(that.data.latitude), //要去的纬度-地址
          longitude: parseFloat(longitude) ? parseFloat(longitude) : parseFloat(that.data.longitude), //要去的经度-地址
          name: address,
          fail: (error) => {
            console.log(error);
            wx.showToast({
              title: '错误' + error,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  // 搜索内容双向绑定，value的值为内容
  search: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 确定搜索
  searchOk: function (e) {
    var that = this;
    that.setData({
      pageIndex: 1
    })
    getCheckPointPage(this.data.pageIndex, this.data.searchValue, this.data.streetOrgCode, this.data.categoryCode, this.data.latitude, this.data.longitude).then((res) => {
      if (res.code == 200) {
        that.setData({
          list: res.data.data,
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
  },
  // 获取经纬度当前
  getLocal() {
    const that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log('经纬度', latitude, longitude);
        that.setData({ //将获取到的经度、纬度数值分别赋值给本地变量
          latitude: (latitude).toFixed(6),
          longitude: (longitude).toFixed(6)
        })
      }
    })
  },
  // 初始加载数据
  loadInitData() {
    var that = this;
    that.setData({
      pageIndex: 1
    })
    getCheckPointPage(this.data.pageIndex, this.data.searchValue, this.data.streetOrgCode, this.data.categoryCode, this.data.latitude, this.data.longitude).then((res) => {
      if (res.code == 200) {
        that.setData({
          list: res.data.data,
          totalCount: res.data.totalCount
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: "index"
      })
    }
    this.setData({
      pageIndex: 1,
      searchValue: '',
      subcatetitle: '',
      substreettitle: '',
      streetOrgCode: '',
      categoryCode: '',
      lat: '',
      lng: ''
    });
    this.loadInitData()
  },

  onLoad() {
    this.initCategory()
    this.initArea()
    this.getLocal()
    const res = wx.getSystemInfoSync()
    const {
      screenHeight,
      safeArea: {
        bottom
      }
    } = res
    if (screenHeight && bottom) {
      let safeBottom = screenHeight - bottom
      this.setData({
        height: 108 + safeBottom
      })
    }
  },
  onPullDownRefresh: function () {
    // 在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    // 下拉刷新后，将页数重置为1,数组清空，是否请求完所有数据设置为fasle
    this.setData({
      pageIndex: 1,
      searchValue: '',
      subcatetitle: '',
      substreettitle: '',
      streetOrgCode: '',
      categoryCode: ''
    });
    // 重新发起请求
    this.loadInitData();
    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
  },
  onReachBottom: function () {
    var that = this;
    let pageCount = that.data.totalCount % app.globalData.pageSize == 0 ? parseInt(that.data.totalCount / app.globalData.pageSize) : parseInt(that.data.totalCount / app.globalData.pageSize) + 1
    if (this.data.pageIndex < pageCount) {
      this.data.pageIndex++;
      getCheckPointPage(this.data.pageIndex, this.data.searchValue, this.data.streetOrgCode, this.data.categoryCode, this.data.latitude, this.data.longitude).then((res) => {
        if (res.code == 200 & res.data.length != 0) {
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
  initCategory() {
    getWelfareCategoryList().then((res) => {
      let category = this.data.category
      let len = res.data.length
      for (let i = 0; i < len; i++) {
        let obj = {
          id: res.data[i].dictCode,
          title: res.data[i].dictName
        }
        category[1].cate_two.push(obj)
      }
      this.setData({
        category
      })
      wx.setStorageSync('category', category)
    })
    getBusinessCategoryList().then((res) => {
      let category = this.data.category
      let len = res.data.length
      for (let i = 0; i < len; i++) {
        let obj = {
          id: res.data[i].dictCode,
          title: res.data[i].dictName
        }
        category[2].cate_two.push(obj)
      }
      this.setData({
        category
      })
      wx.setStorageSync('category', category)
    })
  },
  // 组织
  initArea() {
    getAreaList().then((res) => {
      let len = res.data.length
      let area = this.data.area
      for (let i = 0; i < len; i++) {
        let obj = {
          id: res.data[i].orgCode,
          name: res.data[i].name,
          zone: []
        }
        area.push(obj)
      }
      this.setData({
        area
      })
    })
  },

})