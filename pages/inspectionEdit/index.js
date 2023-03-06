var app = getApp();
import {
  baseUrl
} from '../../config/index'
import {
  getReportItemList,
  getReportPhotoList,
  insertReportExamine,
  insertReportFormExamine,
  updateReportFormExamine,
  insertReportItemExamine,
  updateReportItemExamine,
  deleteReportPhoto,
  getJudgeUpdate,
  updateReportForm,
  updateReportItem,
  uploadPic,
  insertReportPhoto,
  insertReportPhotoExamine
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
  // 基础信息审批
  basicEdit() {
    const {
      checkPointAddress,
      checkPointName,
      connectName,
      connectTel,
      id
    } = this.data.basic_obj
    if (this.data.reportFormExamineId) {
      updateReportFormExamine(checkPointAddress, checkPointName, connectName, connectTel, this.data.reportFormExamineId).then((res) => {
        if (res.code == 200) {
          wx.showToast({
            title: '执行基础信息修改成功，等待审批',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'error'
          })
        }
      })
    } else {
      insertReportFormExamine(checkPointAddress, checkPointName, connectName, connectTel, this.data.reportExamineId, id).then((res) => {
        if (res.code == 200) {
          wx.showToast({
            title: '基础信息修改成功，等待审批',
            icon: "none"
          })
          this.setData({
            reportFormExamineId: res.data.reportFormExamineId
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
  // 基础信息按钮
  go_edit() {
    var that = this;
    // 48h之内，直接修改
    const {
      checkPointAddress,
      checkPointName,
      connectName,
      connectTel,
      id
    } = that.data.basic_obj
    if (that.data.updatable == '1') {
      updateReportForm(checkPointAddress, checkPointName, connectName, connectTel, id).then((res) => {
        if (res.code == 200) {
          wx.showToast({
            title: '检查记录基础信息修改成功',
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
    // 48h以上了，走审批
    else {
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
  // 48h之内直接修改检查项
  reportItemEdit(asd) {
    updateReportItem(asd.itemid, asd.itemname, asd.score, this.data.reportItemlist[this.data.currentIndex].reportItemVos[this.data.question_index].id).then((res) => {
      if (res.code == 200) {
        wx.showToast({
          title: '检查项修改成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  },
  // 48h之后检查项审批
  subjectEdit(asd) {
    if (this.data.reportItemlist[this.data.currentIndex].reportItemVos[this.data.question_index].reportItemExamineId) {
      updateReportItemExamine(asd.itemid, asd.itemname, asd.score, this.data.reportItemlist[this.data.currentIndex].reportItemVos[this.data.question_index].reportItemExamineId).then((res) => {
        if (res.code == 200) {
          wx.showToast({
            title: '执行了检查项修改成功,等待审批',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'error'
          })
        }
      })
    } else {
      insertReportItemExamine(asd.itemid, asd.itemname, asd.score, asd.reportitemid, this.data.reportExamineId).then((res) => {
        if (res.code == 200) {
          wx.showToast({
            title: '检查项修改成功,等待审批',
            icon: 'none'
          })
          var rteid = 'reportItemlist[' + this.data.currentIndex + '].reportItemVos[' + this.data.question_index + '].reportItemExamineId'
          this.setData({
            [rteid]: res.data.reportItemExamineId
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
    }
  },
  // 按钮选中进行答题目操作
  radioChange(e) {
    var ti = 'reportItemlist[' + this.data.currentIndex + '].reportItemVos[' + this.data.question_index + '].itemId'
    console.log('ti', ti)
    this.setData({
      [ti]: e.detail.value
    })
    // 直接修改检查项
    if (this.data.updatable == '1') {
      this.reportItemEdit(e.currentTarget.dataset)
    }
    // 48h之后要审批才行改检查项
    else {
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
    }
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
  // 照片选择及上传
  upLoadImage: function (e) {
    var photoId = e.currentTarget.dataset.photoid;
    var photoTypeName = e.currentTarget.dataset.phototypename;
    let index = e.currentTarget.dataset.index;
    var currentLength = this.data.img_list[index].reportPhotos.length
    console.log('length',currentLength);
    console.log(e.currentTarget.dataset);
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths[0]
        wx.showLoading({
          success: res => {
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
              // 直接添加图片
              if (this.data.updatable == '1') {
                insertReportPhoto(photoId, photoTypeName, img_url, this.data.basic_obj.id, this.data.sort).then((res) => {
                  if (res.code == 200) {
                    this.get_img()
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
              }
              // 经过审批才能加图片
              else {
                if (!this.data.reportExamineId) {
                  var that = this;
                  // 无 调用新增审批id的方法
                  insertReportExamine(that.data.basic_obj.checkPointAddress, that.data.basic_obj.checkPointName, that.data.basic_obj.id).then((res) => {
                    console.log('ididid', res);
                    if (res.code == 200) {
                      let reportExamineId = res.data.reportExamineId
                      this.setData({
                        reportExamineId
                      })
                      // 审批-图片添加
                      this.examineInsertPhoto(img_url,index,photoId,photoTypeName,currentLength)
                    } else {
                      wx.showToast({
                        title: res.msg,
                        icon: "none"
                      })
                    }
                  })
                } else {
                  // 审批-图片添加
                  this.examineInsertPhoto(img_url,index,photoId,photoTypeName,currentLength)
                }
              }
            })
          }
        })
      },
    });
  },
  examineInsertPhoto(img_url,index,photoId,photoTypeName,currentLength) {
    console.log(img_url,index,photoId,photoTypeName,currentLength);
    var img_list = this.data.img_list
    insertReportPhotoExamine(photoId,photoTypeName,img_url,this.data.reportExamineId,this.data.basic_obj.id,'',currentLength,0).then((res) => {
      if (res.code == 200) {
        wx.showToast({
          title: '添加成功等待审批',
          icon: 'none',
        })
        let photoObj = {
          'picAdd': img_url,
          'reportFormId': this.data.basic_obj.id,
          'sort': currentLength
        } 
        img_list[index].reportPhotos.push(photoObj)
        console.log(img_list);
        this.setData({
          img_list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  },
  // 删除表单中图片
  deleteImg: function (e) {
    console.log('当前这张图片的数据', e.currentTarget.dataset)
    wx.showModal({
      content: '确认删除该张图片吗',
      title: '',
      success: (res) => {
        if (res.confirm) {
          // 48h以内随意删图片
          if (this.data.updatable == '1') {
            deleteReportPhoto(e.currentTarget.dataset.reportphotoid).then((res) => {
              if (res.code == 200) {
                wx.showToast({
                  title: '成功删除该张图片',
                  icon: 'none'
                })
                this.get_img()
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'error'
                })
              }
            })
          }
          // 48h以上要走审批
          else {
            // 判断有无审批的id
            if (!this.data.reportExamineId) {
              var that = this;
              // 无 调用新增审批id的方法
              insertReportExamine(that.data.basic_obj.checkPointAddress, that.data.basic_obj.checkPointName, that.data.basic_obj.id).then((res) => {
                console.log('ididid', res);
                if (res.code == 200) {
                  let reportExamineId = res.data.reportExamineId
                  this.setData({
                    reportExamineId
                  })
                  // 审批-删除图片
                  this.examineDeletePhoto(e.currentTarget.dataset.reportphotoid, e.currentTarget.dataset.aindex, e.currentTarget.dataset.index)
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: "none"
                  })
                }
              })
            } else {
              // 审批-删除图片
              this.examineDeletePhoto(e.currentTarget.dataset.reportphotoid, e.currentTarget.dataset.aindex, e.currentTarget.dataset.index)
            }
          }
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
  // 审批删图片
  examineDeletePhoto(reportPhotoId, aindex, index) {
    console.log('接收reportPhotoId', reportPhotoId);
    var img_list = this.data.img_list
    insertReportPhotoExamine('', '', '', this.data.reportExamineId, '', reportPhotoId, '', '1').then((res) => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功等待审批',
          icon: 'none',
        })
        img_list[aindex].reportPhotos.splice(index, 1);
        this.setData({
          img_list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  },
  onLoad(options) {
    let basic_obj = JSON.parse(options.item)
    this.setData({
      basic_obj
    })
    console.log('basicobj', this.data.basic_obj);
    this.get_report_item()
    this.get_judge_update()
  },
  // 判断是否在检查完48h之内
  get_judge_update() {
    getJudgeUpdate(this.data.basic_obj.id).then((res) => {
      if (res.code == 200) {
        this.setData({
          updatable: res.data.updatable
        })
      }
    })
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
  onShow() {
    this.get_img()
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
})