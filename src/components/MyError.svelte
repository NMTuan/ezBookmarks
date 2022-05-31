<script>
  import { fade } from 'svelte/transition'
  export let show = ''
  export let size = '64'
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
    in:fade
    out:fade
    on:click={handleClick}>
    <div class="text-center" style="animation-duration: 2s;">
      <svg
        class="mx-auto"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1275"
        width={size}
        height={size}>
        <path
          d="M509.994667 85.333333C275.84 85.333333 85.333333 276.736 85.333333
          512s191.402667 426.666667 426.666667 426.666667 426.666667-191.402667
          426.666667-426.666667S746.368 85.333333 509.994667 85.333333zM512
          853.333333c-188.202667
          0-341.333333-153.130667-341.333333-341.333333s152.192-341.333333
          339.328-341.333333C699.349333 170.666667 853.333333 323.797333
          853.333333 512s-153.130667 341.333333-341.333333 341.333333z"
          fill={color}
          p-id="1276" />
        <path
          d="M469.333333 298.666667h85.333334v256h-85.333334z m0
          341.333333h85.333334v85.333333h-85.333334z"
          fill={color}
          p-id="1277" />
      </svg>
      <div class="mt-2 {textClass}">{show}</div>
    </div>
  </main>
{/if}
