// pages/recommendSong/recommendSong.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendList: [], //推荐列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        success: () => {
          // 跳转到登录界面
          wx.reLaunch({
            url: "/pages/login/login",
          });
        },
      });
    }
    // 更新日期数据
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });
    // 获取每日推荐数据
    this.getRecommendList();
  },

  // 获取每日推荐列表数据
  async getRecommendList() {
    let recommendListData = await request("/recommend/songs");
    // console.log(recommendListData);
    this.setData({
      recommendList: recommendListData.recommend,
    });
  },

  // 跳转到songDtail页面
  showDetail(event) {
    let song = event.currentTarget.dataset.song;
    wx.navigateTo({
      url: "/pages/songDtail/songDtail?musicId=" + song.id,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
