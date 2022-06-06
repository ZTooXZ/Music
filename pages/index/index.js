// pages/index/index.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图
    personalizedList: [], //推荐歌单
    topList: [], //排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图
    let bannerListData = await request("/banner", { type: 2 });
    this.setData({
      bannerList: bannerListData.banners,
    });

    // 获取推荐歌单
    let personalizedListData = await request("/personalized", { limit: 10 });
    this.setData({
      personalizedList: personalizedListData.result,
    });

    // 排行榜数据
    /* 
    需求分析：
      1. 需要根据idx的值获取对应的数据  
      2. idx的取值范围是0~20，我们需要0~4
    */
    let index = 0;
    let resultArr = [];
    while (index < 5) {
      let topListData = await request("/top/list", { idx: index++ });
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3),
      };
      resultArr.push(topListItem);
      // 在这个位置，不需要等五次请求结束才更新，用户体验较好，但是这里的渲染次数会多一些
      this.setData({
        topList: resultArr,
      });
    }
    // 更新topList的状态值,放在当前位置更新数据，会导致请求过程中页面长时间白屏，用户体验差
    /* this.setData({
      topList: resultArr,
    }); */
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
