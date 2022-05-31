<script>
  import { get } from 'svelte/store'
  import { replace } from 'svelte-spa-router'
  import IconSet from '../../components/icon/IconSet.svelte'
  import MyLoading from '../../components/MyLoading.svelte'
  import MySuccess from '../../components/MySuccess.svelte'
  import MyError from '../../components/MyError.svelte'
  import App from '../../store/App'

  let loginStatus = get(App.loginStatus) // 登录状态
  let mode = 'login' // 登录 login 注册 reg
  let isOfficial = App.isOfficial() // 官方实例
  let ENVID = get(App.ENVID)
  let envId = ENVID === get(App.envId) ? '' : get(App.envId) // 实例id，非官方， 则显示；官方则不用显示
  let auth = get(App.auth) // 认证
  let collectionName = get(App.collectionName) // 数据库集合名称
  let showOptions = false // 显示设置表单
  let mail = get(App.mail) // 登录邮箱
  let password // 密码
  let loading = false
  let successMsg = ''
  let errorMsg = ''

  // console.log('确保这里能取到， 就没问题', envId)
  // console.log('currentUser', auth.currentUser)

  $: {
    chrome.storage.sync.set({
      mail: mail,
    })
  }

  // 已登录, 则跳转至管理页面.
  if (loginStatus) {
    replace('/manager')
  }

  // 登录
  const handleLogin = () => {
    if (!mail || !password) {
      errorMsg = 'mail and password are required'
      return
    }
    loading = true
    auth
      .signInWithEmailAndPassword(mail, password)
      .then((res) => {
        loading = false
        // loginStatus.set(true)
        // replace('/manager')
      })
      .catch((err) => {
        loading = false
        // loginStatus.set(false)
        errorMsg = err.message
      })
  }

  // 注册
  const handleReg = () => {
    if (!mail || !password) {
      errorMsg = 'mail and password are required'
      return
    }
    loading = true
    auth
      .signUpWithEmailAndPassword(mail, password)
      .then((res) => {
        loading = false
        successMsg = '注册成功, 请查收激活邮件'
      })
      .catch((err) => {
        loading = false
        errorMsg = err.message
      })
  }

  // 回车提交
  const handleKeydown = (e) => {
    if (mode === 'login' && e.keyCode === 13) {
      handleLogin()
    }
  }

  // 切换 登录/注册
  const changeMode = () => {
    mode = mode === 'login' ? 'reg' : 'login'
  }

  // 保存配置
  const saveAndReload = () => {
    chrome.storage.sync.set({
      envId: envId || ENVID,
      collectionName: collectionName || 'bookmarks',
    })
    location.reload()
  }
</script>

<main class="login__dialog ">
  <MyLoading
    show={loading}
    color="#ffffffcc"
    bgClass="bg-neutral-500/50 backdrop-blur-[2px]" />

  <MySuccess
    bind:show={successMsg}
    color="#17171780"
    textClass="text-neutral-900/80"
    bgClass="bg-neutral-500/50 backdrop-blur-[2px]" />

  <MyError
    bind:show={errorMsg}
    duration={0}
    color="#17171780"
    textClass="text-neutral-900/80"
    bgClass="bg-neutral-500/50 backdrop-blur-[2px]" />

  <div class="login__panel">
    <div
      class="absolute top-6 right-6 cursor-pointer"
      on:click={() => (showOptions = !showOptions)}>
      <IconSet color="#d4d4d4" />
    </div>

    <!-- <MyLogo className="login__logo" /> -->
    <div class="login__title">{!isOfficial ? '真 · ' : ''}简单书签</div>
    {#if showOptions}
      <div class="mb-6">
        <div class="text-neutral-600 mb-2">腾讯云实例ID</div>
        <input
          class="login__input"
          bind:value={envId}
          type="text"
          placeholder="留空则使用官方实例" />
      </div>
      <div class="mb-6">
        <div class="text-neutral-600 mb-2">腾讯云数据库集合名称</div>
        <input
          class="login__input"
          bind:value={collectionName}
          type="text"
          placeholder="默认为bookmarks" />
      </div>
      <div class="mb-6 flex">
        <button
          class="login__button login__button--reg"
          on:click={saveAndReload}>
          保存并重载页面
        </button>
      </div>
    {:else}
      <div class="mb-6">
        <input
          class="login__input"
          bind:value={mail}
          type="text"
          placeholder="邮箱" />
      </div>
      <div class="mb-6">
        <input
          class="login__input"
          bind:value={password}
          type="password"
          placeholder="密码"
          on:keydown={handleKeydown} />
      </div>
      <div class="mb-6 flex">
        {#if mode === 'login'}
          <button
            class="login__button login__button--login"
            on:click={handleLogin}>
            登录
          </button>
        {:else}
          <button class="login__button login__button--reg" on:click={handleReg}>
            注册
          </button>
        {/if}
      </div>
      <div class=" text-sm text-right ">
        <span on:click={changeMode} class="text-neutral-500 cursor-pointer">
          {mode === 'login' ? '没有账号?' : '已有账号? 去登录'}
        </span>
      </div>
    {/if}
  </div>
  <div class="copyright mt-4 text-cetner">
    <a href="https://github.com/NMTuan" target="_blank">无压的书签管理工具</a>
  </div>

</main>
