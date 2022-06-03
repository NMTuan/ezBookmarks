<script>
  import { onMount, tick } from 'svelte'
  import { get } from 'svelte/store'
  import App from '../../store/App'
  import { fade } from 'svelte/transition'
  import { debounce } from 'throttle-debounce'
  import ResultItem from '../../components/searchBar/ResultItem.svelte'
  import MyLoading from '../../components/MyLoading.svelte'
  import NoAccess from '../../components/NoAccess.svelte'

  let _ = get(App.db).command // db.command
  let collection = get(App.collection) // 集合
  let isOfficial = App.isOfficial()

  let keyword = ''
  let data = []
  let inputRef
  let resultRef
  let activeIndex = 0
  let loading = false
  let loginStatus = get(App.loginStatus)
  let currentTab = null

  $: {
    if (keyword !== '') {
      // console.log('keyword: ' + keyword)
      debounceQuery()
    } else {
      data = []
      resetSearchBarHeight()
    }
  }

  onMount(() => {
    if (!loginStatus) {
      return
    }
    inputRef.focus()
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      currentTab = tabs[0]
    })
  })

  // 防抖
  const debounceQuery = debounce(240, () => query())
  // 查询

  const query = () => {
    loading = true
    const reg = new RegExp(keyword.replace(/\s/g, ''), 'gi')
    let where
    // console.log('isOfficial', isOfficial)
    if (isOfficial) {
      where = _.and(
        {
          _openid: '{openid}',
        },
        _.or(
          {
            title: reg,
          },
          {
            tags: reg,
          },
          {
            domain: reg,
          },
        ),
      )
    } else {
      where = _.or(
        {
          title: reg,
        },
        {
          tags: reg,
        },
        {
          domain: reg,
        },
      )
    }

    collection
      .field({
        _id: false,
        title: true,
        url: true,
        tags: true,
      })
      .where(where)
      .get()
      .then((res) => {
        loading = false
        data = res.data
        activeIndex = 0
        // 调整对话框高度
        resetSearchBarHeight(data.length)
      })
      .catch(() => {
        loading = false
      })
  }

  // 重置搜索对话框高度
  const resetSearchBarHeight = (resultLength = 0) => {
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'resetSearchBarHeight',
        value: data.length,
      })
    }
  }

  // 处理按键
  const handleKeydown = async (e) => {
    // 上
    if (e.key === 'ArrowUp') {
      if (activeIndex > 0) {
        activeIndex--
      }
    }
    // 下
    if (e.key === 'ArrowDown') {
      if (activeIndex < data.length - 1) {
        activeIndex++
      }
    }
    // 回车
    if (e.key === 'Enter') {
      closeDialog()
      window.open(data[activeIndex].url)
    }

    // 保证高亮项可见
    await tick()
    const showRange = {
      min: resultRef ? resultRef.scrollTop : 0,
      max: resultRef ? resultRef.clientHeight + resultRef.scrollTop : 0,
    }
    const activeItem = document.querySelector('.resultItem--active')
    const activeRange = {
      min: activeItem ? activeItem.offsetTop : 0,
      max: activeItem ? activeItem.offsetTop + activeItem.clientHeight : 0,
    }
    // 区域向上滚, showRange.min < activeRange.min, 滚动至activeRange.min
    if (e.key === 'ArrowUp' && activeRange.min < showRange.min) {
      resultRef.scrollTop = activeRange.min
    }
    // 区域向下滚, activeRange.max > showRange.max, 滚动至activeRange.max-窗口高度
    if (e.key === 'ArrowDown' && activeRange.max > showRange.max) {
      resultRef.scrollTop = activeRange.max - resultRef.clientHeight
    }
  }
  // 关闭对话框
  const closeDialog = () => {
    // 向当前窗口发送消息
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, 'openSearchBar')
    }
  }

  // esc 关闭对话框
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      closeDialog()
    }
  })

</script>

<main
  class="flex flex-col bg-neutral-700 text-neutral-50 p-4 h-screen
  overflow-hidden rounded">
  <NoAccess logged={loginStatus} />
  {#if loginStatus}
    <div class="searchBar__main">
      <input
        class="searchBar__input"
        type="text"
        placeholder="keyword"
        bind:this={inputRef}
        bind:value={keyword}
        on:keydown={handleKeydown} />
      <div class="relative flex-shrink-0 w-16">
        <MyLoading
          show={loading}
          size="28"
          color="#737373"
          bgClass="bg-transparent" />
      </div>
    </div>
    {#if data.length > 0}
      <div
        class="searchBar__results"
        bind:this={resultRef}
        in:fade={{ duration: 150 }}>
        {#each data as item, index}
          <ResultItem {item} {index} bind:activeIndex />
        {/each}
      </div>
    {/if}
  {/if}
</main>
