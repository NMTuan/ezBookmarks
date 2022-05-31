<script>
  import { get } from 'svelte/store'
  import { replace } from 'svelte-spa-router'
  import MyLoading from '../../components/MyLoading.svelte'
  import Item from '../../components/manager/Item.svelte'
  import App from '../../store/App'

  let app = get(App.app)
  let collection = get(App.collection)
  let loginStatus = get(App.loginStatus)
  let isOfficial = App.isOfficial()
  let managerRef

  let loading = false
  let data = [] // 数据
  let page = 1 // 当前分页
  let limit = 20 // 限制条数
  let pageCount = 0 // 总页数
  let count = 0 // 总条数

  $: {
    // 页码改变时， 拉取新数据
    const skip = (page - 1) * limit
    fetchData(skip)
  }
  $: pageCount = Math.ceil(count / limit) // 页码

  // 获取数据
  const fetchData = async (skip = 0) => {
    loading = true
    const res = await collection
      .where({
        _openid: '{openid}',
      })
      .orderBy('updateAt', 'desc')
      .limit(limit)
      .skip(skip)
      .get()
    loading = false
    managerRef.scrollTop = 0
    data = res.data
  }

  // 获取总条数
  const fetchCount = () => {
    collection
      .where({
        _openid: '{openid}',
      })
      .count()
      .then((res) => {
        count = res.total || 0
      })
  }

  // 删除
  const remove = (payload) => {
    const id = payload.detail
    if (confirm('确定要删除吗?')) {
      loading = true
      if (isOfficial) {
        app
          .callFunction({
            name: 'remove_to_bookmark',
            data: {
              _id: id,
            },
          })
          .then(({ result }) => {
            loading = false
            if (result.code) {
              alert(result.msg)
            } else {
              data = data.filter((item) => item._id !== id)
              fetchCount()
            }
          })
          .catch(() => {
            loading = false
          })
      } else {
        collection
          .doc(id)
          .remove()
          .then((res) => {
            loading = false
            data = data.filter((item) => item._id !== id)
            fetchCount()
          })
          .catch((err) => {
            loading = false
          })
      }
    }
  }

  // 登出
  const logout = () => {
    if (confirm('确定要退出么？')) {
      get(App.auth)
        .signOut()
        .then((res) => {
          replace('/')
        })
    }
  }

  // 处理时间戳
  // const handleTimeStamp = (ts) => {
  //   if (!ts) {
  //     return ''
  //   }
  //   const date = new Date(ts)
  //   const year = date.getFullYear().toString()
  //   const month = (date.getMonth() + 1).toString()
  //   const day = date.getDay().toString()
  //   return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`
  // }

  // 点击分页
  const clickPage = (newPage) => {
    if (page !== newPage) {
      page = newPage
    }
  }

  // 未登录, 则跳转至登录页.
  if (!loginStatus) {
    replace('/')
  }
  fetchCount()
</script>

{#if loginStatus}
  <main class="main">
    <MyLoading
      show={loading}
      color="#ffffffcc"
      bgClass="bg-neutral-500/50 backdrop-blur-[2px]" />

    <div class="container">
      <div class="userInfo">
        <span on:click={logout} class="cursor-pointer">登出</span>
      </div>
      <div class="manager" bind:this={managerRef}>
        {#each data as item}
          <Item {item} on:remove={(id) => remove(id)} />
        {/each}
      </div>
      <div class="foot">
        <div class="pages flex-grow">
          {#each Array(pageCount) as item, index}
            <span
              class="pages__item {index + 1 === page ? 'pages__item--current' : ''}"
              on:click={() => clickPage(index + 1)}>
              {index + 1}
            </span>
          {/each}

          <span>总计：{count}条</span>
        </div>
        <div class="copyright flex-shrink-0">
          <a href="https://github.com/NMTuan" target="_blank">
            无压的书签管理工具
          </a>
        </div>
      </div>
    </div>
  </main>
{/if}
