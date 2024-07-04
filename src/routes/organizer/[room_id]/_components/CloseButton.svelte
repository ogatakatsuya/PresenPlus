<script lang="ts">
  import { db } from "$lib/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  const room_id: string = $page.params.room_id;

  const closeRoom = async () => {
    try {
      const roomRef = doc(db, `Rooms/${room_id}`); // Correctly reference the room's document in the 'Rooms' collection
      await updateDoc(roomRef, {
        exist: false,
      });
      console.log(`Room ${room_id} closed successfully.`);
      goto("/create");
    } catch (e) {
      console.error("Error closing room: ", e);
    }
  };
</script>

<button
  on:click={closeRoom}
  class="z-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
>
  Close Presentation Room
</button>
