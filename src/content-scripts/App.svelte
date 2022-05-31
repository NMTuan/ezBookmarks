<script>
  import { fade } from 'svelte/transition'
  let bookmarkDialog = false
  const bookmarkUrl = chrome.runtime.getURL('options/index.html#/addBookmark')
  let searchBarDialog = false
  const searchBarUrl = chrome.runtime.getURL('options/index.html#/searchBar')

  let searchBarRef
  let searchBarHeight = 82

  // 接受消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request === 'closeAllDialog'){
      bookmarkDialog = false
      searchBarDialog = false
    }
    // 切换添加对话框
    if (request === 'addToBookmarks' && !searchBarDialog) {
      bookmarkDialog = !bookmarkDialog
    }
    // 切换搜索对话框
    if (request === 'openSearchBar' && !bookmarkDialog) {
      searchBarDialog = !searchBarDialog
      handleSearchBarHeight() // 重置高度
    }
    if (
      typeof request === 'object' &&
      request.action === 'resetSearchBarHeight'
    ) {
      // 处理搜索对话框高度
      handleSearchBarHeight(request.value)
    }

    // 回调
    sendResponse()
  })

  // 处理对话框高度
  const handleSearchBarHeight = (resultLength = 0) => {
    const height = 82 // 搜索框高度
    if (resultLength > 5) {
      resultLength = 5
    }
    // 搜索框高度 + 结果高度/68 + 搜索框和结果之间的间距/16
    searchBarHeight = height + resultLength * 68 + (resultLength > 0 ? 16 : 0)
    // console.log('searchBarHeight', searchBarHeight)
  }

  // 点击搜索框之外的区域, 关闭搜索框
  document.addEventListener('click', (e) => {
    if (searchBarRef && !searchBarRef.contains(e.target)) {
      searchBarDialog = false
    }
  })
</script>

<main>
  {#if bookmarkDialog}
    <div
      class="dialog__bookmark"
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 400 }}
    >
      <iframe
        title="addBookmark"
        style="width:100%; height: 100%;"
        src={bookmarkUrl}
        frameborder="0"
      />
    </div>
  {/if}
  {#if searchBarDialog}
    <div
      class="dialog__search"
      style="height: {searchBarHeight}px"
      transition:fade={{ duration: 150 }}
      bind:this={searchBarRef}
    >
      <iframe
        title="searchBar"
        style="width:100%; height: 100%; overflow: hidden;"
        src={searchBarUrl}
        scrolling="no"
        frameborder="0"
      />
    </div>
  {/if}
</main>

<style>
  .dialog__bookmark {
    width: 640px;
    height: 209px;
    overflow: hidden;
    margin: -106px 0 0 -320px;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    opacity: 0.98;
  }
  .dialog__search {
    width: 640px;
    overflow: hidden;
    /* 最大高度 498px */
    margin: -249px 0 0 -320px;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    opacity: 0.98;
  }
</style>
