<script lang="ts">
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";

  export let text: string;
  let color = "black";
  let weight = 500;
  let shadow = "none";
  const dur = 14000;
  const t = Math.random() * 100;

  const l = tweened(100, {
    duration: dur,
    easing: linear,
  });
  const x = tweened(0, {
    duration: dur,
    easing: linear,
  });
  l.set(0);
  x.set(-100);

  function highlight() {
    color = "tomato";
    weight = 700;
    shadow = "flowing";
  }
</script>

{#if !($l == 0 && $x == -100)}
  <div
    class="z-20 absolute whitespace-nowrap text-2xl font-noto text-shadow-{shadow}"
    style="top:{t}%; left:{$l}%; transform:translateX({$x}%); color:{color}; font-weight:{weight};"
    on:click={highlight}
  >
    {text}
  </div>
{/if}
