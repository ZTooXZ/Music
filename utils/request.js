// 发送ajax请求

/* 
  1. 封装功能函数
      1. 功能点明确
      2. 函数内部应该百六固定代码（静态的）
      3. 将动态的数据抽取形参，由使用者根据自身得到情况动态的传入实参
      4. 一个良好的功能函数应该设置形参的默认值（ES6的形参默认值）
  2. 封装功能组件
      1。功能明确
      2. 组件内部保留静态的代码
      3. 将动态的数据抽取成 props 参数，由使用者根据自身使用情况
      以标签属性的形式动态传入propes数据
      4. 一个良好的组件应该设置组件的必要性数据类型
        props:{
          msg:{
            required:true,
            default: 默认值,
            type: string
          }
        }

*/
import config from "./config";
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    // 1. new Promise 初始化promise实例的状态为 pending
    wx.request({
      url: config.mobileHost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync("cookies")
          ? wx.getStorageSync("cookies").find((item) => item.indexOf("MUSIC_U") !== -1)
          : "",
      },
      success: (res) => {
        // console.log(res);
        if (data.isLogin) {
          //登录请求
          // 将用户的cookies存储在本地
          wx.setStorage({
            key: "cookies",
            data: res.cookies,
          });
        }
        resolve(res.data);
      },
      fail: (err) => {
        console.log("请求错误", err);
        reject(err);
      },
    });
  });
};
