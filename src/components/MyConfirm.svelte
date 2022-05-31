<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let show = false

  const submit = () => {
    dispatch('submit')
  }
  const cancel = () => {
    dispatch('cancel')
  }
</script>

{#if show}
  <main class="myConfirm">
    <div class="myConfirm__container">
      <div class="flex-grow">
        <slot>确定要删除吗?</slot>
      </div>
      <div
        class="myConfirm__button myConfirm__button--danger"
        on:click={submit}>
        删除
      </div>
      <div class="myConfirm__button" on:click={cancel}>取消</div>
    </div>
  </main>
{/if}
