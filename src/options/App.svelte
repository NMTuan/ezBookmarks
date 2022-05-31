<script>
  import Router from 'svelte-spa-router'
  import { location, replace } from 'svelte-spa-router'

  import cloudBase from '@cloudbase/js-sdk'

  import routes from './routes'

  import App from '../store/App'

  let loading = true

  chrome.storage.sync.get(['envId', 'collectionName', 'mail']).then((ss) => {
    App.envId.set(ss.envId)
    App.collectionName.set(ss.collectionName || 'bookmarks')
    App.mail.set(ss.mail || '')

    const app = cloudBase.init({
      env: ss.envId || App.ENVID,
    })

    const auth = app.auth({
      persistence: 'local',
    })
    const loginStatus = auth.hasLoginState() ? true : false
    const db = app.database()
    const collection = db.collection(ss.collectionName || 'bookmarks')

    App.app.set(app)
    App.auth.set(auth)
    App.loginStatus.set(loginStatus)
    App.db.set(db)
    App.collection.set(collection)

    loading = false

    // 监视登录状态
    auth.onLoginStateChanged((loginState) => {
      if (loginState) {
        // 此时用户已经登录
        App.loginStatus.set(true)
        if ($location === '/') {
          replace('/manager')
        }
      } else {
        // 没有登录
        App.loginStatus.set(false)
      }
    })
  })
</script>

<main class="relative">
  {#if !loading}
    <Router {routes} />
  {/if}
</main>
