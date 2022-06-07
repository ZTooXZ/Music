// pages/songDtail/songDtail.js
import request from "../../utils/request";
import PubSub from "pubsub-js";
// 获取全局实例
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    songInfo: {}, //歌曲详情
    musicId: "", //音乐id
    musicLink: "", //音乐的链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    this.setData({
      musicId,
    });
    this.getMusicInfo(musicId);

    /* 如果用户操作系统的控制音乐播放/暂停按钮，页面不知道 ，导致页面显示是否播放的状态和真实的音乐播放状态不一致
      解决方案：
        1、通过控制音频的实例区监听音乐的播放和暂停
        2、
      */

    // 判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true,
      });
    }
    // 创建控制音乐播放的实例对象
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(true);
      // console.log("play");
      // 修改全局音乐播放状态

      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(false);
      // console.log("pause");
      // 修改全局音乐播放状态
    });
    this.backgroundAudioManager.onStop(() => {
      // 修改音乐为停止状态
      this.changePlayState(false);
    });
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay,
    });
    // 修改全局音乐播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取音乐详情
  async getMusicInfo(musicId) {
    let songInfo = await request("/song/detail", { ids: musicId });
    this.setData({
      songInfo: songInfo.songs[0],
    });
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.songInfo.name,
    });
  },

  // 点击播放、暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    /* this.setData({
      isPlay,
    }); */
    let { musicId, musicLink } = this.data;
    this.musicContal(isPlay, musicId, musicLink);
  },

  // 控制音乐播放、暂停的功能函数
  async musicContal(isPlay, musicId, musicLink) {
    // 音乐播放

    if (isPlay) {
      //音乐播放
      if (!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request("/song/url", { id: musicId });
        let musicLink = musicLinkData.data[0].url;
        /* 将 音乐链接存放到data中 */
        this.setData({
          musicLink,
        });
      }

      // 设置音乐链接
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.songInfo.name;
    } else {
      //音乐暂停
      this.backgroundAudioManager.pause();
    }
  },

  // 点击切歌的回调
  handleSwitch(event) {
    // 获取切歌的类型
    let type = event.currentTarget.id;
    // console.log(type);
    /* 关闭当前播放的音乐 */
    this.backgroundAudioManager.stop();
    // 订阅 传回来的musicID
    PubSub.subscribe("getMusicId", (msg, musicId) => {
      // console.log(musicId);
      /* 获取到对应id的音乐详情 */
      this.getMusicInfo(musicId);
      // 自动播放当前音乐
      this.musicContal(true, musicId);
      // 取消订阅
      PubSub.unsubscribe("getMusicId");
    });
    // 发布消息给 RecommendSongs 页面
    PubSub.publish("getType", type);
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
