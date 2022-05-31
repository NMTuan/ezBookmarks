/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2022-05-05 17:25:04
 * @LastEditTime: 2022-05-22 22:16:45
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: /ezBookmarks/src/options/main.js
 */
import App from "./App.svelte";
import cssString from "../css/index.css";
const style = document.createElement("style");
document.head.append(style);
style.textContent = cssString;

const app = new App({
  target: document.getElementById("app")
});

export default app;
