<script lang="ts">
	import { fly } from 'svelte/transition';

	export let open :boolean;

    const links = [
		{ name: 'Home', url: '/' },
		{ name: 'Create', url: '/create' },
		{ name: 'Join', url: '/join' },
		{ name: 'About', url: '/about' }
	];

    function handleClick() {
		open = false;
	}
</script>

{#if open}
	<div class="menu" transition:fly={{ y: -200 }}>
		{#each links as link}
			<a href={link.url} on:click={handleClick}>
				<p>
					{link.name}
				</p>
			</a>
		{/each}
	</div>
{/if}

<style>
	.menu {
		position: absolute;
		top: 60px; /* Position below the header */
		left: 0;
		width: 100%;
		background-color: rgba(30, 31, 35, 0.95); /* Background with increased transparency */
		z-index: 5;
		text-align: center;
		font-size: 1.5em;
		letter-spacing: 0.15em;
		padding: 1em;
		color: var(--text-color);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        opacity: 0.95; /* Overall opacity */
	}

	p {
		cursor: pointer;
		width: max-content;
		margin: 1rem auto;
	}

	p:hover {
		text-decoration: underline;
	}

	.bar {
		border-style: solid;
		border-color: white;
		border-width: 1px;
		height: 0;
	}
</style>
