<script lang="ts">
    import { auth } from "$lib/firebase";
    import { signOut } from "firebase/auth";

    export let mode: string = "dropdown";

    const clickHandler = () => {
        signOut(auth).then(() => {
            console.log("sign out successfully");
        }).catch((error) => {
            alert(error)
        });
    }
</script>

{#if mode === "dropdown"}
<button on:click={clickHandler} class="flex px-4 py-2 hover:bg-gray-100 w-full">
    <svg class="w-[20px] h-[20px] text-gray-500 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
    </svg>
    Log Out
</button>
{:else if mode === "button"}
<button on:click={clickHandler} class="flex text-gray-500 bg-white hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 justify-center font-noto">
    <svg class="w-[20px] h-[20px] text-gray-500 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
    </svg>
    Log Out
</button>
{/if}