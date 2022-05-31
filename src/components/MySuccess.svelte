<script>
  import { fade } from 'svelte/transition'
  export let show = ''
  export let size = '128'
  export let color = '#57534e'
  export let bgClass = 'bg-neutral-700'
  export let textClass = 'text-neutral-300'
  export let duration = 3000

  let dt

  $: {
    if (show && duration) {
      dt = setTimeout(() => {
        handleClick()
      }, duration)
    }
  }

  const handleClick = () => {
    clearTimeout(dt)
    show = ''
  }

</script>

{#if show}
  <main
    class="absolute z-10 inset-0 flex items-center justify-center bg-neutral-700 {bgClass}
    rounded"
    transition:fade
    on:click={handleClick}>
    <div style="animation-duration: 2s;">
      <svg
        class="mx-auto"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4811"
        width={size}
        height={size}>
        <path
          d="M122.28096
          536.623104c-9.940992-9.925632-11.548672-25.360384-2.78528-36.407296l20.487168-25.828352c8.397824-10.58816
          24.108032-13.246464 35.211264-5.835776l177.3312 118.35904c9.353216
          6.243328 25.452544 5.430272
          34.185216-1.654784l468.5824-380.16c10.532864-8.54528
          27.030528-7.817216 36.261888 1.400832l11.542528 11.52512c10.04544
          10.03008 9.314304 25.951232-1.215488 36.465664l-502.92736
          502.183936c-15.64672 15.624192-41.337856
          14.94016-57.445376-1.142784l-219.22816-218.9056z"
          p-id="4812"
          fill={color} />
      </svg>
      {#if show && show !== 'true'}
        <div class="mt-2 {textClass}">{show}</div>
      {/if}
    </div>
  </main>
{/if}
