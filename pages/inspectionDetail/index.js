var app = getApp();
import {getReportItemList,getReportPhotoList} from '../../api/mine'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,   //顶部tab栏默认选中
    checked: true,
    question_list: [],
    reportItemId: '',
    currentIndex: 0, //当前选中左侧菜单的索引
    leftMenuList: [], //左侧菜单数据
    rightContext: [], //右侧题目+选项 
    question_value: '',
    imageList: [], // 本地图片缓存链接
    imageListUrl: [], // oss链接
    photoId: [],
    photoTypeName: [],
    photoid: '',
    photo_list: [],
    checkPhotoList: '', // 图片所需表单类型与名称
    sort: 0,
    stepList: [{
      name: '1'
    }, {
      name: '2'
    }, {
      name: '3'
    }, {
      name: '4'
    }, { name: 's' }, { name: 's' }, { name: 's' }, { name: 's' }],
  },
  // 切换tab方法
  changeTab(e) {
    console.log(e.currentTarget.dataset.index);
    // console.log(e.target);
    let _this = this;
    _this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  // 检查项左侧栏切换
  handleMenuItemChange(e) {
    const index = e.currentTarget.dataset.index;
    let rightContext = this.data.reportItemlist[index].reportItemVos
    this.setData({
      currentIndex: index,
      rightContext,
      question_index: 0
    })
  },
  // 检查项答题-上一道
  sub_setp() {
    if (this.data.question_index > 0) {
      this.data.question_index--
      this.setData({
        question_index: this.data.question_index
      })
    }
  },
  // 检查项答题-下一道
  add_step() {
    if (this.data.question_index < this.data.rightContext.length - 1) {
      this.data.question_index++
      this.setData({
        question_index: this.data.question_index
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let basic_obj = JSON.parse(options.item)
    this.setData({ basic_obj })
    this.setData({
      reportFormId: basic_obj.id
    })
    this.get_report_item()
    this.get_img()
  },
  // 查询答题完的检查项
  get_report_item() {
    getReportItemList(this.data.basic_obj.id).then((res) => {
      let leftMenuList = res.data.map(v => v.projectName)
      let rightContext = res.data[0].reportItemVos
      console.log('rightcontext',res.data[0].reportItemVos)
      this.setData({
        leftMenuList,
        rightContext,
        reportItemlist: res.data,
        question_index: 0
      })
    })
  },
  // 查询图片
  get_img() {
    getReportPhotoList(this.data.reportFormId).then((res) => {
      this.setData({
        reportPhotolist: res.data
      })
    })
  },
  // 预览图片
  previewImg: function (e) {
    let currentUrl = e.target.dataset.src
    wx.previewImage({
      //当前显示图片
      current: currentUrl,
      //所有图片
      urls: [currentUrl]
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
