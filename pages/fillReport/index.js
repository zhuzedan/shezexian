// pages/fillReport/index.js
var app = getApp();
import {
  getCheckPointOne,
  getCheckPhotoList,
  getCheckItem,
  insertReportForm,
  updateReportForm,
  updateReportItem,
  insertReportPhoto,
  uploadPic,
  deleteReportPhoto
} from '../../api/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '', //基础信息
    active: 0, //顶部tab栏默认选中
    editInformation: 1, // 基础信息编辑
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
  },
  Cates: [], //检查项所有数据
  // 切换tab
  changeTab(e) {
    console.log(e.currentTarget.dataset.index);
    // console.log(e.target);
    let _this = this;
    _this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  // 基础信息编辑按钮
  forEdit() {
    this.setData({
      editInformation: 2
    })
  },
  // 修改基础信息表单
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
  // 基础信息确认按钮
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
  // 检查项左侧栏切换
  handleMenuItemChange(e) {
    const index = e.currentTarget.dataset.index;
    let rightContext = this.Cates[index].checkItemSubjects
    this.setData({
      currentIndex: index,
      rightContext,
      question_index: 0
    })
  },
  // 检查项做题
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
    // 修改答的题目
    if (this.data.question_list[this.data.currentIndex].checkItemSubjects[this.data.question_index].reportItemId) {
      updateReportItem(this.data.rightContext[this.data.question_index].checkItemList[index].id,
        this.data.rightContext[this.data.question_index].checkItemList[index].itemName,
        this.data.question_list[this.data.currentIndex].checkItemSubjects[this.data.question_index].reportItemId,
        this.data.rightContext[this.data.question_index].checkItemList[index].score).then((res) => {
        console.log('修改检查项', res);
        if (res.code == 200) {
          wx.showToast({
            title: '修改答案成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'error'
          })
        }
      })
    }
    // 做题目
    else {
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
          if (res.data.code == 200) {
            wx.showToast({
              title: '成功作答',
              icon: 'none'
            })
            console.log('reportItemId', res.data.data.reportItemId);
            var c = 'question_list[' + this.data.currentIndex + '].checkItemSubjects[' + this.data.question_index + '].reportItemId'
            console.log('c', c)
            that.setData({
              [c]: res.data.data.reportItemId
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'error'
            })
          }
        }
      })
    }

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
    uploadPic(tempFilePaths).then((res) => {
      // 将返回的json格式数据转换成对象
      var jsonStr = res.replace(" ", "")
      if (typeof jsonStr != 'object') {
        jsonStr = jsonStr.replace(/\ufeff/g, "");
        var jj = JSON.parse(jsonStr);
        console.log('jj', jj);
        res = jj;
      }
      let img_url = res.data.url
      that.pushApi(index, img_url)

    })
  },
  // 新增图片
  pushApi(index, img_url) {
    insertReportPhoto(this.data.photoid, this.data.phototypename, img_url, this.data.reportFormId, this.data.sort).then((res) => {
      if (res.code == 200) {
        this.setData({
          reportPhotoId: res.data.reportPhotoId
        })
        let temp_obj = {
          'photoTypeName': this.data.phototypename,
          'img_url': img_url,
          'reportPhotoId': this.data.reportPhotoId
        }
        this.data.photo_list.push(temp_obj)
        this.setData({
          photo_list: this.data.photo_list
        })
        wx.showToast({
          title: '图片添加成功',
          icon: 'none'
        })
      }
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    })
  },
  // 删除图片
  deleteImg: function (e) {
    console.log('当前这张图片的数据',e.currentTarget.dataset)
    wx.showModal({
      content: '确认删除该张图片吗',
      title: '',
      success: (res) => {
        if (res.confirm) {
          var photo_list = this.data.photo_list;
          console.log('当前这张图片的数据',e.currentTarget.dataset)
          var index = e.currentTarget.dataset.index;
          deleteReportPhoto(e.target.dataset.reportphotoid).then((res) => {
            if (res.code == 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              photo_list.splice(index, 1);
              this.setData({
                photo_list: photo_list
              });
            }else {
              wx.showToast({
                title: res.msg,
                icon:'error'
              })
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '取消删除',
            icon: 'none'
          })
        }
      },
      fail: (res) => {},
      complete: (res) => {},
    })

  },
  // 预览图片
  previewImg: function (e) {
    let currentUrl = e.target.dataset.src
    console.log('currenturl', currentUrl);
    wx.previewImage({
      //当前显示图片
      current: currentUrl,
      //所有图片
      urls: [currentUrl]
    })
  },
  // 从图片回到检查项
  gotoCheckItem: function (e) {
    this.setData({
      active: 1
    })
  },
  // 跳转到签名
  goSignature(e) {
    wx.navigateTo({
      url: '../signature/index?reportFormId=' + this.data.reportFormId,
    })
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
      this.Cates = res.data;
      let leftMenuList = this.Cates.map(v => v.projectName)
      let rightContext = this.Cates[0].checkItemSubjects
      this.setData({
        leftMenuList,
        rightContext,
        question_list: res.data,
        question_index: 0
      })
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

  },
})