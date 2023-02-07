// pages/fillReport/index.js
var app = getApp();
import {
  getCheckPointOne,
  getCheckPhotoList,
  getCheckItem,
  insertReportForm,
  updateReportForm,
  insertReportPhoto
} from '../../api/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,   //顶部tab栏默认选中
    currentIndex: 0, //当前选中左侧菜单的索引
    leftMenuList: [], //左侧菜单数据
    rightContext: [], //右侧题目+选项 
    // 本地图片缓存链接
    imageList: [],
    // oss链接
    imageListUrl: [],
    photoId: [],
    photoTypeName: [],
    photoid: '',
    sort: 0,
    // 表单类型与名称
    checkPhotoList: '',
    state: '',
    info: '',
    checked: true,
    editInformation: 1,
    stepNum: 1, //当前的步数
    photo_list: []

  },
  Cates: [], //检查项所有数据
  forEdit1() {
    this.setData({
      editInformation: 2
    })
  },
  // 检查项左侧栏切换
  handleMenuItemChange(e) {
    const index = e.currentTarget.dataset.index;
    let rightContext = this.Cates[index].checkItemSubjects
    this.setData({
      currentIndex: index,
      rightContext
    })
  },
  // 门头照片选择
  upLoadImage: function (e) {
    var photoId = e.currentTarget.dataset.photoid;
    var photoTypeName = e.currentTarget.dataset.phototypename;
    let index = e.currentTarget.dataset.index;
    this.setData({
      photoid: photoId,
      phototypename: photoTypeName
    })
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中',
          success: res => {
            that.uploadFile(index, tempFilePaths)
          }
        })
      },
    });
  },
  // 上传图片url到oss
  uploadFile: function (index, tempFilePaths) {
    var that = this;
    wx.uploadFile({
      filePath: tempFilePaths,
      name: 'file',
      url: app.globalData.url + '/api/app-check/uploadPic',
      header: {
        "Authorization": "Bearer " + app.globalData.userInfo.token
      },
      success: res => {
        var successData = res.data
        var jsonStr = successData.replace(" ", "")
        if (typeof jsonStr != 'object') {
          jsonStr = jsonStr.replace(/\ufeff/g, "");
          var jj = JSON.parse(jsonStr);
          res.data = jj;
        }
        let img_url = res.data.data.url
        that.pushApi(index, img_url)
        let temp_obj = {
          'photoTypeName': that.data.phototypename,
          'img_url': img_url
        }
        that.data.photo_list.push(temp_obj)
        that.setData({
          photo_list: that.data.photo_list
        })
      }
    })
  },
  // 新增图片
  pushApi(index, img_url) {
    const that = this
    insertReportPhoto(that.data.photoid, that.data.phototypename, img_url, that.data.reportFormId, that.data.sort).then((res) => {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var imageList = this.data.imageList;
    var index = e.currentTarget.dataset.index;
    imageList.splice(index, 1);
    this.setData({
      imageList: imageList
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imageList = this.data.imageList;
    wx.previewImage({
      //当前显示图片
      current: imageList[index],
      //所有图片
      urls: imageList
    })
  },
  goSignature(e) {
    wx.navigateTo({
      url: '../signature/index?reportFormId=' + this.data.reportFormId,
    })
  },
  radioChange(e) {
    console.log(e);
    const {
      index
    } = e.currentTarget.dataset
    console.log(index);
    const that = this
    that.setData({
      question_value: e.detail.value
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + '/api/app-check/insertReportItem',
      method: "POST",
      header: {
        "Authorization": "Bearer " + app.globalData.userInfo.token
      },
      data: {
        itemId: that.data.rightContext[that.data.question_index].checkItemList[index].id,
        itemName: that.data.rightContext[that.data.question_index].checkItemList[index].itemName,
        projectCode: that.data.rightContext[that.data.question_index].projectCode,
        projectName: that.data.rightContext[that.data.question_index].projectName,
        reportFormId: that.data.reportFormId,
        score: that.data.rightContext[that.data.question_index].checkItemList[index].score,
        sort: that.data.rightContext[that.data.question_index].checkItemList[index].sort,
        subjectId: that.data.rightContext[that.data.question_index].id,
        subjectScore: that.data.rightContext[that.data.question_index].score,
        subjectStem: that.data.rightContext[that.data.question_index].stem
      },
      success: res => {
        wx.hideLoading()
        console.log(res);
      }
    })
  },
  onChangeRadio(event) {
    this.setData({
      radio: event.detail,
    });
  },
  sub_setp() {
    if (this.data.question_index > 0) {
      this.data.question_index--
      this.setData({
        question_index: this.data.question_index
      })
    }
  },
  numSteps() {
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
    console.log(options);
    this.setData({
      checkPointId: options.checkPointId
    })
    var that = this;
    // 查询单个检查点详情
    getCheckPointOne(options.checkPointId).then((res) => {
      that.setData({
        info: res.data,
        name: res.data.name,
        address: res.data.address,
        connectName: res.data.connectName,
        connectTel: res.data.connectTel
      })
    })
    // 查询检查表图片类型与名称
    getCheckPhotoList(options.categoryCode, options.streetOrgCode).then((res) => {
      var dataArray = res.data
      for (var i = 0; i < dataArray.length; i++) {
        that.setData({
          photoId: that.data.photoId.concat(dataArray[i]["id"]),
          photoTypeName: that.data.photoTypeName.concat(dataArray[i]["photoTypeName"]),
          checkPhotoList: res.data
        })
      }
    })
    // 查询检查项
    getCheckItem(options.categoryCode, options.streetOrgCode).then((res) => {
      console.log('查检查项', res);
      this.Cates = res.data;
      let leftMenuList = this.Cates.map(v => v.projectName)
      let rightContext = this.Cates[0].checkItemSubjects
      this.setData({
        leftMenuList,
        rightContext
      })
      // left_list 为左侧大类的数据
      let left_list = res.data.map(item => {
        return item.projectName
      })
      left_list = [...new Set(left_list)]
      that.setData({
        question_list: res.data,
        question_index: 0,
        left_list
      })
    })
  },
  handle_name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  handle_address(e) {
    this.setData({
      address: e.detail.value
    })
  },
  handle_user(e) {
    this.setData({
      connectName: e.detail.value
    })
  },
  handle_phone(e) {
    this.setData({
      connectTel: e.detail.value
    })
  },
  submit_basic() {
    if (this.data.reportFormId) {
      console.log('存在id');
      updateReportForm(this.data.address, this.data.name, this.data.connectName, this.data.connectTel, this.data.reportFormId).then((res) => {
        if (res.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          this.setData({
            active: 1,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
      })
    } else {
      insertReportForm(this.data.checkPointId, this.data.address, this.data.name, this.data.connectName, this.data.connectTel).then((res) => {
        console.log('基础信息', res);
        if (res.code == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
          this.setData({
            active: 1,
            reportFormId: res.data.reportFormId
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
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

  },
  // 切换tab方法
  changeTab(e) {
    console.log(e.currentTarget.dataset.index);
    // console.log(e.target);
    let _this = this;
    _this.setData({
      active: e.currentTarget.dataset.index
    })
  }
})