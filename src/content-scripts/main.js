/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2022-05-05 17:31:03
 * @LastEditTime: 2022-05-13 10:18:37
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \ezBookmarks\src\content-scripts\main.js
 */
import App from './App.svelte'
// import '../css/index.css'

const el = document.createElement('div')
el.id = 'ezBookmark'
document.body.appendChild(el)

const app = new App({
    target: document.getElementById('ezBookmark')
})
