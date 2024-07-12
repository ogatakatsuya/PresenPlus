<script>
    import { getDoc, setDoc, doc } from "firebase/firestore"; 
    import { db } from "$lib/firebase";
    import { onMount } from "svelte";
    import { authStore } from "../../../store";
    import { updateProfile } from "firebase/auth";
    let user;
    const unsubscribe = authStore.subscribe(value => {
        user = value.user;
    });

    onMount(() => {
        return () => {
            unsubscribe();
        };
    });

    let user_name = "";
    let user_description = "";
    let userRooms = [];
    let roomDetails = [];

    const update_profile = async () => {
        console.log("update_profile");
        console.log(user_name);
        console.log(user);
        updateProfile(user, {
            displayName: user_name,
        }).then(() => {
            // Profile updated!
            // ...
            console.log("profile updated");
        }).catch((error) => {
            // An error occurred
            // ...
            console.log("error");
        });

        const profile = {
            user_description: user_description,
        }

        try {
            const userRef = doc(db, "User", user.uid); // user.uid を特定の user_id に置き換える
            await setDoc(userRef, profile);
            user_description = "";
            user_name = "";
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const fetchUserRooms = async () => {
        try {
            const userRef = doc(db, "User", user.uid);
            const userDoc = await getDoc(userRef); //User/{user_id}のDocを取ってくる

            if (userDoc.exists()) {
                const userData = userDoc.data();
                userRooms = userData.rooms || []; //room_idをとる

                roomDetails = await Promise.all(userRooms.map(async (roomId) => { //room_idを元にRoomのDocを取ってくる
                    const roomRef = doc(db, "Rooms", roomId);
                    const roomDoc = await getDoc(roomRef);
                    return roomDoc.exists() ? roomDoc.data() : null;
                }));
            } else {
                console.log("No such user document!");
            }
        } catch (e) {
            console.error("Error fetching user rooms: ", e);
        }
    }

    onMount(() => {
        fetchUserRooms(); //初回レンダリング時にfetchUserRoomsを実行
    });
</script>

<div>
    <h1>this is user page</h1>
    {#if user}
        <p>user_name: {user.displayName ? user.displayName : "please tell me your name."}</p>
    {/if}
    <form action="" on:submit|preventDefault={update_profile}>
        <label for="">user_name</label>
        <input type="text" bind:value={user_name}>
        <label for="">user_description</label>
        <input type="text" bind:value={user_description}>
        <button type="button" on:click={update_profile} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Edit Profile
        </button>
    </form>
    <h2>User Rooms</h2>
    <ul>
        {#each roomDetails as room}
            {#if room}
                <li>
                    <p>Room Name: {room.name}</p>
                    <p>Description: {room.description}</p>
                    <p>Room Exists: {room.exist}</p>
                </li>
            {/if}
        {/each}
    </ul>
</div>
