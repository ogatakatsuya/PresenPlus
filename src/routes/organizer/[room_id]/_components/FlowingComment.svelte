<script lang="ts">
    import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';

    export let text: string;
    let color = "royalblue";//"dimgray";
    let weight = 600;
    const dur = 14000;
    const t = Math.random() * 95;

    const l = tweened(100, {
		duration: dur,
		easing: linear
	});
    const x = tweened(0, {
		duration: dur,
		easing: linear
	});
    l.set(0);
    x.set(-100);

    function highlight() {
        color = "tomato";
        weight = 700;
    }
</script>

{#if !($l==0 && $x==-100)}
	<div class="z-30 absolute whitespace-nowrap text-2xl font-noto text-shadow-flowing" style="top:{t}%; left:{$l}%; transform:translateX({$x}%); color:{color}; font-weight:{weight};" on:click={highlight}>
		{text}
	</div>
{/if}

<style>
    .text-shadow-flowing {
        text-shadow:
        white 2px 0px,  white -2px 0px,
        white 0px -2px, white 0px 2px,
        white 2px 2px , white -2px 2px,
        white 2px -2px, white -2px -2px,
        white 1px 2px,  white -1px 2px,
        white 1px -2px, white -1px -2px,
        white 2px 1px,  white -2px 1px,
        white 2px -1px, white -2px -1px;
    }
</style>