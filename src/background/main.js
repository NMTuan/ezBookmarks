/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2022-05-05 17:44:57
 * @LastEditTime: 2022-05-31 14:53:20
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \ezBookmarks\src\background\main.js
 */

// 监听快捷键
chrome.commands.onCommand.addListener(command => {
  // console.log(`Command: ${command}`);

  // 向当前窗口发送消息
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // "chrome://" content-script不执行.
    if (tabs[0] && tabs[0].url.indexOf("chrome://") < 0) {
      chrome.tabs.sendMessage(tabs[0].id, command);
    }
  });
});

// 点击扩展图标
// chrome.action.onClicked.addListener(() => {
//   chrome.runtime.openOptionsPage();
// });

// 安装后，自动打开设置页面
// chrome.runtime.onInstalled.addListener(function(){
//     chrome.runtime.openOptionsPage()
// })
