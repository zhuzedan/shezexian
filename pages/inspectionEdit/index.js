var app = getApp();
import {baseUrl} from '../../config/index'
import {
  getReportItemList,
  getReportPhotoList,
  insertReportExamine,
  insertReportFormExamine,
  insertReportItemExamine
} from '../../api/mine'
Page({
  data: {
    active: 0, //顶部tab栏默认选中
    checked: true,
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
  // 切换tab方法
  changeTab(e) {
    console.log(e.currentTarget.dataset.index);
    // console.log(e.target);
    let _this = this;
    _this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  // 基础信息双向绑定
  handle_name(e) {
    this.data.basic_obj.checkPointName = e.detail.value
    this.setData({
      basic_obj: this.data.basic_obj
    })
  },
  handle_address(e) {
    this.data.basic_obj.checkPointNAddress = e.detail.value
    this.setData({
      basic_obj: this.data.basic_obj
    })
  },
  hanlde_username(e) {
    this.data.basic_obj.connectName = e.detail.value
    this.setData({
      basic_obj: this.data.basic_obj
    })
  },
  hanlde_phone(e) {
    this.data.basic_obj.connectTel = e.detail.value
    this.setData({
      basic_obj: this.data.basic_obj
    })
  },
  // 基础信息修改接口
  basicEdit() {
    const {
      checkPointAddress,
      checkPointName,
      connectName,
      connectTel,
      id
    } = this.data.basic_obj
    insertReportFormExamine(checkPointAddress, checkPointName, connectName, connectTel, this.data.reportExamineId, id).then((res) => {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    })
  },
  // 修改按钮
  go_edit() {
    var that = this;
    if (!this.data.reportExamineId) {
      var that = this;
      insertReportExamine(that.data.basic_obj.checkPointAddress, that.data.basic_obj.checkPointName, that.data.basic_obj.id).then((res) => {
        console.log('ididid', res);
        if (res.code == 200) {
          let reportExamineId = res.data.reportExamineId
          this.setData({
            reportExamineId
          })
          that.basicEdit()
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
      })
    } else {
      that.basicEdit()
    }
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
  // 按钮选中进行答题目的操作
  radioChange(e) {
    if (this.data.reportExamineId) {
      this.subjectEdit(e.currentTarget.dataset)
    } else {
      insertReportExamine(this.data.basic_obj.checkPointAddress, this.data.basic_obj.checkPointName, this.data.basic_obj.id).then((res) => {
        console.log('ididid', res);
        if (res.code == 200) {
          let reportExamineId = res.data.reportExamineId
          this.setData({
            reportExamineId
          })
          this.subjectEdit(e.currentTarget.dataset)
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
      })
    }
  },
  // 检查项修改答题
  subjectEdit(asd) {
    console.log('asd', asd);
    var c = 'reportItemlist[' + this.data.currentIndex + '].reportItemVos[' + this.data.question_index + '].itemId'
    console.log('c', c)
    this.setData({
      [c]: asd.itemid
    })
    insertReportItemExamine(asd.itemid, asd.itemname, asd.score, asd.reportitemid, this.data.reportExamineId).then((res) => {
      if (res.code == 200) {
        wx.showToast({
          title: '检查项操作成功',
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
  },
  // 检查项答题-上一道
  sub_step() {
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
  onLoad(options) {
    let basic_obj = JSON.parse(options.item)
    this.setData({
      basic_obj
    })
    console.log('basicobj', this.data.basic_obj);
    this.get_report_item()
    this.get_img()
  },
  // 查询答题完的检查项
  get_report_item() {
    getReportItemList(this.data.basic_obj.id).then((res) => {
      let leftMenuList = res.data.map(v => v.projectName)
      let rightContext = res.data[0].reportItemVos
      console.log('rightcontext', res.data[0].reportItemVos)
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
    getReportPhotoList(this.data.basic_obj.id).then((res) => {
      this.setData({
        img_list: res.data
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
  // 照片选择
  upLoadImage: function (e) {
    let that = this
    let index1 = e.currentTarget.dataset.index1
    let photoId = e.currentTarget.dataset.photoId
    wx.chooseMedia({
      camera: 'back',
      count: 1,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFiles = res.tempFiles[0].tempFilePath
        that.uploadFile(tempFiles, index1, photoId);
      },
    })
  },
  // 上传图片url到oss
  uploadFile(tempFiles, index1, photoId) {
    var that = this;
    wx.uploadFile({
      filePath: tempFiles,
      name: 'file',
      url: baseUrl + '/api/app-check/uploadPic',
      header: {
        "Authorization": "Bearer " + app.globalData.userInfo.token
      },
      success: (res) => {
        // 将返回的json格式数据转换成对象
        var successData = res.data
        var jsonStr = successData.replace(" ", "")
        if (typeof jsonStr != 'object') {
          jsonStr = jsonStr.replace(/\ufeff/g, "");
          var jj = JSON.parse(jsonStr);
          res.data = jj;
        }
        let url = res.data.data.url
        wx.request({
          url: baseUrl + '/api/app-my/insertReportPhotoExamine',
          method: "POST",
          header: {
            "Authorization": "Bearer " + app.globalData.userInfo.token
          },
          data: {
            "picAdd": url,
            "reportExamineId": that.data.reportExamineId,
            "reportPhotoId": photoId
          },
          success: res => {
            that.data.img_list[index1].picAdd = url
            that.setData({
              img_list: that.data.img_list
            })
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        })
      }
    })
  },
  onShow() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
})