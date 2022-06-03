<script>
  import { get } from 'svelte/store'
  import App from '../../store/App'
  import { fade } from 'svelte/transition'
  import MyLoading from '../../components/MyLoading.svelte'
  import MySuccess from '../../components/MySuccess.svelte'
  import MyError from '../../components/MyError.svelte'
  import MyConfirm from '../../components/MyConfirm.svelte'
  import NoAccess from '../../components/NoAccess.svelte'

  let loading = true // 加载状态
  let success = '' // 成功状态
  let error = '' // 错误内容
  let showRemoveConfirm = false // 显示移除确认框
  let inputRef = null // 标签input的el
  let app = get(App.app) // 云实例
  let isOfficial = App.isOfficial() /// 是否接入官方云
  let collection = get(App.collection) // 集合
  let loginStatus = get(App.loginStatus)
  let currentTab = null //当前标签页
  let formData = {
    _id: 0,
  }
  let tags = ''

  // 反应
  $: formData.tags = tags
    .replace(/\s/g, '')
    .split(/[,，]/)
    .reduce((total, tag) => {
      // 存在且不重复
      if (tag && total.indexOf(tag) < 0) {
        total.push(tag)
      }
      return total
    }, [])

  // 获取当前窗口信息
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentTab = tabs[0]
    formData.title = tabs[0].title
    formData.url = tabs[0].url
    formData.domain = tabs[0].url.replace(/^.*?:\/\/(.*?)\/.*/g, '$1') // 供查询用

    if (!formData.url || !loginStatus) {
      return
    }

    loading = true
    // 找当前数据, 如果找到, 则为编辑模式
    collection
      .field({
        _openid: false, // 用不到， 写入的时候还要删掉， 所以直接不返回
      })
      .where({
        _openid: '{openid}',
        url: formData.url,
      })
      .limit(1)
      .get()
      .then((res) => {
        loading = false
        if (res.data.length > 0) {
          formData = Object.assign({}, formData, res.data[0])
          tags = formData.tags.join(', ')
        }
        inputRef.focus()
      })
      .catch(() => {
        loading = false
        inputRef.focus()
      })
  })

  // 添加事件
  const createBookmark = () => {
    loading = true
    const ts = new Date().getTime()
    // 官方实例, 走云函数
    if (isOfficial) {
      app
        .callFunction({
          name: 'add_to_bookmark',
          data: {
            ...formData,
            createAt: ts,
            updateAt: ts,
          },
        })
        .then(({ result }) => {
          loading = false
          if (result.code) {
            error = result.msg
          } else {
            successAndClose()
          }
        })
      return
    }
    collection
      .add({
        ...formData,
        createAt: ts,
        updateAt: ts,
        // _id: new Date().getTime().toString(36) + Math.random(),
      })
      .then((res) => {
        loading = false
        successAndClose()
      })
      .catch(() => {
        loading = false
      })
  }

  // 更新事件
  const updateBookmark = () => {
    if (!formData._id) {
      return
    }
    loading = true
    const ts = new Date().getTime()
    const newData = Object.assign({}, formData)
    delete newData._id
    collection
      .where({
        _openid: '{openid}',
        _id: formData._id
      })
      .update({
        ...newData,
        updateAt: new Date().getTime(),
      })
      .then((res) => {
        loading = false
        successAndClose()
      })
      .catch(() => {
        loading = false
      })
  }

  const removeBookmark = () => {
    showRemoveConfirm = true
  }

  // 关闭对话框
  const closeDialog = () => {
    // 向当前窗口发送消息
    chrome.tabs.sendMessage(currentTab.id, 'addToBookmarks')
  }

  // 成功并关闭
  const successAndClose = () => {
    success = 'true'
    setTimeout(() => {
      closeDialog()
    }, 700)
  }

  // confirmSubmit
  const confirmSubmit = () => {
    showRemoveConfirm = false
    loading = true
    if (isOfficial) {
      app
        .callFunction({
          name: 'remove_to_bookmark',
          data: {
            _id: formData._id,
          },
        })
        .then(({ result }) => {
          loading = false
          if (result.code) {
            error = result.msg
          } else {
            successAndClose()
          }
        })
    } else {
      collection
        .doc(formData._id)
        .remove()
        .then((res) => {
          loading = false
          successAndClose()
        })
        .catch(() => {
          loading = false
        })
    }
  }
  // confirmCancel
  const confirmCancel = () => {
    showRemoveConfirm = false
  }

  // ctrl+回车 提交
  const handleKeydown = (e) => {
    const ctrlKey = e.ctrlKey || e.metaKey
    if (ctrlKey && e.keyCode === 13) {
      if (formData._id) {
        updateBookmark()
      } else {
        createBookmark()
      }
    }
  }
</script>

<MyConfirm
  show={showRemoveConfirm}
  on:submit={confirmSubmit}
  on:cancel={confirmCancel}
/>
<MyLoading show={loading} />
<MySuccess show={success} />
<MyError bind:show={error} />

<main class="bg-neutral-700 text-neutral-50 h-screen p-4 rounded">
  <NoAccess logged={loginStatus} />
  {#if loginStatus && !success && !loading}
    <div class="mb-4" in:fade out:fade>
      <input
        class="addBookmark__input"
        type="text"
        bind:value={formData.title}
        placeholder="标题"
      />
    </div>
    <div class="mb-4">
      <input
        class="addBookmark__input"
        type="text"
        bind:value={tags}
        placeholder="标签: 以逗号分割(中英文都可)"
        bind:this={inputRef}
        on:keydown={handleKeydown}
      />
    </div>

    <div class="flex items-center">
      {#if formData._id}
        <div
          on:click={updateBookmark}
          class="addBookmark__button addBookmark__button--update "
        >
          更新书签
          <span class="text-sm text-sky-200/50">
            ( Ctrl+Enter / Command + Enter )
          </span>
        </div>
        <div
          on:click={removeBookmark}
          class="addBookmark__button addBookmark__button--remove"
        >
          移除
        </div>
      {:else}
        <div
          on:click={createBookmark}
          class="addBookmark__button addBookmark__button--create"
        >
          添加书签
          <span class="text-sm text-sky-200/50">
            ( Ctrl+Enter / Command + Enter )
          </span>
        </div>
      {/if}
    </div>
  {/if}
</main>
