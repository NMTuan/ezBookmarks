<script>
  export let index = 0
  export let item = {}
  export let activeIndex = 0

  // 鼠标划过， 高亮显示
  const handleHover = () => {
    activeIndex = index
  }

  // 打开
  const handleClick = () => {
    //TODO 改成chrome的打开
    closeDialog()
    window.open(item.url)
  }

  // 关闭对话框
  const closeDialog = () => {
    // 向当前窗口发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // "chrome://" content-script不执行.
      if (tabs[0] && tabs[0].url.indexOf('chrome://') < 0) {
        chrome.tabs.sendMessage(tabs[0].id, 'openSearchBar')
      }
    })
  }
</script>

<main
  class={index === activeIndex ? 'resultItem resultItem--active' : 'resultItem'}
  on:mouseenter={handleHover}
  on:click={handleClick}>
  <div class="resultItem__title">{item.title || item.url}</div>
  <div class="flex flex-row items-center">
    <div class="resultItem__tags">
      {#each item.tags as tag}
        <span class="resultItem__tag">{tag}</span>
      {/each}
    </div>
    {#if item.title}
      <div class="resultItem__url">{item.url}</div>
    {/if}
  </div>
</main>
