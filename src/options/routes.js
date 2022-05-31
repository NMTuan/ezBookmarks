/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2022-05-06 17:43:34
 * @LastEditTime: 2022-05-29 21:14:31
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: /ezBookmarks/src/options/routes.js
 */
import home from "./views/home.svelte";
import manager from "./views/manager.svelte";
import addBookmark from "./views/addBookmark.svelte";
import searchBar from "./views/searchBar.svelte";

export default {
  "/": home,
  "/manager/": manager,
  "/addBookmark/": addBookmark,
  "/searchBar/": searchBar
};
