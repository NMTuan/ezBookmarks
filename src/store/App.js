/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2022-05-13 10:21:48
 * @LastEditTime: 2022-05-31 14:53:31
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \ezBookmarks\src\store\App.js
 */

// import cloudBase from "@cloudbase/js-sdk";
import config from "../../config";
import { writable, readable, get } from "svelte/store";

const ENVID = readable(config.ENVID); // 官方的云开发实例ID
const envId = writable(""); // 配置的云开发实例ID
const collectionName = writable(""); //云开发数据库集合名称
const mail = writable(""); // 帐号
const app = writable(null); // 云实例
const auth = writable(null);
const loginStatus = writable(false);
const db = writable(null);
const collection = writable(null);

const isOfficial = () => {
  return get(ENVID) === get(envId) && get(collectionName) === "bookmarks";
};

export default {
  ENVID,
  envId,
  isOfficial,
  collectionName,
  mail,
  app,
  auth,
  loginStatus,
  db,
  collection
};
