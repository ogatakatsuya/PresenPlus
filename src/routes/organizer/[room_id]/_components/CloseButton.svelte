<script lang="ts">
	import { db } from '$lib/firebase';
	import { doc, updateDoc } from 'firebase/firestore';
    import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	const room_id: string = $page.params.room_id;

	const closeRoom = async () => {
		try {
			const roomRef = doc(db, `Rooms/${room_id}`); // Correctly reference the room's document in the 'Rooms' collection
			await updateDoc(roomRef, { exist: false });
			console.log(`Room ${room_id} closed successfully.`);
            goto('/create');
		} catch (e) {
			console.error("Error closing room: ", e);
		}
	}
</script>

<button type="button" on:click={closeRoom} class="absolute top-6 right-6 m-1 z-20 text-white font-noto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
	Close Room
	<svg class="ml-1 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
		<path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
	</svg>
</button>