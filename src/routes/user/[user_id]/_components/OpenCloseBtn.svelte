<script lang="ts">
	import { db } from '$lib/firebase';
	import { doc, updateDoc } from 'firebase/firestore';
	export let room_id: string;
	export let makeit: string;

	const opencloseRoom = async () => {
		try {
			const roomRef = doc(db, `Rooms/${room_id}`); // Correctly reference the room's document in the 'Rooms' collection
			if(makeit == "close") await updateDoc(roomRef, { exist: false });
			else if(makeit == "open") await updateDoc(roomRef, { exist: true });
			else throw new Error('Prop Error');
			console.log(`Room ${room_id} closed successfully.`);
			window.location.reload();
		} catch (e) {
			console.error("Error closing room: ", e);
		}
	}
</script>

{#if makeit=="close"}
<button type="button" on:click={opencloseRoom} class="text-gray-600 font-noto bg-gray hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base leading-6 px-5 py-2.5 justify-center inline-flex items-center grow">
	Close
	<svg class="w-[20px] h-[20px] text-gray-600 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
	</svg>
</button>
{:else if makeit="open"}
<button type="button" on:click={opencloseRoom} class="text-white font-noto bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base leading-6 px-5 py-2.5 justify-center inline-flex items-center grow">
	Open
	<svg class="w-6 h-6 text-white ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z"/>
	</svg>
</button>
{/if}