<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let item = {}

  // 点击删除, 调用父组件删除事件
  const handleClick = (id) => {
    dispatch('remove', id)
  }
</script>

<main class="managerItem">
  <div class="managerItem__main">
    <div class="managerItem__title">
      <a href={item.url} target="_blank">{item.title}</a>
    </div>
    <div class="managerItem__tags">
      {#each item.tags as tag}
        <span class="managerItem__tag">#{tag}</span>
      {/each}
      <span
        on:click={() => handleClick(item._id)}
        class="managerItem__tag managerItem__remove">
        删除
      </span>
    </div>
  </div>
</main>
