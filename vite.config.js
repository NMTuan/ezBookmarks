/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2022-05-05 16:11:12
 * @LastEditTime: 2022-05-06 19:37:53
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: /ezBookmarks/vite.config.js
 */
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { chromeExtension } from 'vite-plugin-chrome-extension'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            input: 'src/manifest.json'
        }
    },
    plugins: [svelte(), chromeExtension()]
})
