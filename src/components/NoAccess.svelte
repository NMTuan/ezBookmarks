<script>
  import { fade } from 'svelte/transition'
  export let logged = false
  let currentTab = null //当前标签页

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentTab = tabs[0]
  })

  const handleClick = () => {
    chrome.runtime.openOptionsPage()
    chrome.tabs.sendMessage(currentTab.id, 'closeAllDialog')
  }
</script>

{#if !logged}
  <main
    class="noAccess"
    on:click={handleClick}
    transition:fade>
      未登录， 请先登录
  </main>
{/if}
