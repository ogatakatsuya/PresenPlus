<script>
    import Logout from "./Logout.svelte";
	import { goto } from "$app/navigation";

    export let user;
</script>

<ul class="py-2 text-sm text-gray-700">
    <li>
        <button on:click={() => {goto(`user/${user.uid}`)}} class="flex hover:bg-gray-100 px-4 py-2 w-full">
            <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                <svg class="absolute w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
            <p class="my-auto truncate ml-3 text-base">{#if user.displayName}{user.displayName}{:else}User{/if}</p>
        </button>
    </li>
    <li>
        <Logout mode="dropdown"/>
    </li>
</ul>