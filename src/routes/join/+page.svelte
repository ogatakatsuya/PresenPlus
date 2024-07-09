<script lang="ts">
    import {
        collection,
        onSnapshot,
        query,
        QuerySnapshot
    } from "firebase/firestore";
    import { goto } from "$app/navigation";
    import { db } from "$lib/firebase";
    import Modal from './_components/Modal.svelte';
    import neon1 from '$lib/images/neon-1.jpg';

    type Room = {
        id: string;
        name: string;
        password: string;
        description: string;
        exist: boolean;
        showModal: boolean;
    }

    let roomPassword = "";
    let roomList: Room[] = [];
    let filteredRoomList: Room[] = [];
    let errorMessage = "";
    let searchQuery = "";

    onSnapshot(
        query(collection(db, "Rooms")),
        (snapshot: QuerySnapshot): any => {
            roomList = snapshot.docs.map(doc => {
                const data = doc.data();
                const item: Room = {
                    id: doc.id,
                    name: data.name,
                    password: data.password,
                    description: data.description,
                    exist: data.exist,
                    showModal: false,
                };
                return item;
            });
            filterRooms();
        }
    );

    const authenticatePassword = (password: string, room_id: string) => {
        if (roomPassword === password) {
            goto(`/room/${room_id}`);
        } else { 
            errorMessage = "password is wrong";
            roomPassword = "";
        }
    }

    const filterRooms = () => {
        filteredRoomList = roomList.filter(room => 
            room.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
</script>

<h1 class="my-6 text-lg font-bold">Let's join presentation room!</h1>

<div class="flex justify-center intems-center">
	<input 
		type="text" 
		placeholder="Search rooms..." 
		bind:value={searchQuery} 
		class="mb-6 p-2 border border-gray-300 rounded"
	/>
	<button 
	on:click={filterRooms} 
	class="text-white font-noto bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
	>
		検索
	</button>
</div>

<div class="flex gap-5 max-w-none flex-wrap justify-center px-6 sm:px-12 xl:px-20 pb-10">
	{#if filteredRoomList.length === 0}
		<p class="text-lg text-gray-500">No rooms found</p>
	{/if}
    {#each filteredRoomList as room}
        {#if room.exist}
        <div class="flex sm:w-72 w-full sm:flex-col flex-row overflow-hidden rounded-lg shadow-lg">
            <div class="hidden sm:block flex-shrink-0">
                <img class="object-cover sm:w-full sm:h-48 w-24 h-full" src="{neon1}" alt="">
            </div>
            <div class="flex sm:flex-col flex-row justify-between flex-1 p-6 sm:pr-6 pr-14 bg-white relative font-noto">
                <div class="flex-1">
                    <p class="text-xl font-semibold text-neutral-600">{room.name}</p>
                    <p class="mt-3 text-base text-gray-500 line-clamp-3">{room.description}</p>
                </div>
                <div class="sm:mt-6 sm:static absolute right-3 bottom-3">
                    <button 
                        on:click={() => {room.showModal = true;errorMessage="";}}
                        class="hidden sm:flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Join
                    </button>
                    <button 
                        on:click={() => {room.showModal = true;errorMessage="";}}
                        class="flex sm:hidden items-center justify-center w-full px-3 py-3 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 fill-white"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
                    </button>
                </div>
            </div>
        </div>
        {#if room.showModal}
            <Modal bind:showModal={room.showModal}>
                <h2 slot="header" class="font-noto font-bold text-lg relative mb-6 pr-6 after:absolute after:left-0 after:w-full after:-bottom-2 after:h-[2px] after:bg-gray-300">
                    <div class="inline-block font-extralight text-sm mr-2 px-3 py-1 rounded-full text-white bg-gray-500">Room</div>
                    {room.name}
                </h2>
                <div class="relative text-gray-600 font-noto font-light px-4 py-2 mt-2 mb-6 before:absolute before:w-1 before:h-full before:left-1 before:top-0 before:bg-gray-300">
                    {room.description}
                </div>
                <label for="inputPassword" class="mt-6 text-sm">Input Room Password</label>
                <input bind:value={roomPassword} type="password" placeholder="Room password" id="password-input" class="my-2 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
                <div class="text-sm text-red-600 flex pb-5 leading-6" style="visibility: {errorMessage ? "visible" : "hidden"}">
                    <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    {errorMessage}
                </div>
                <button on:click={() => room.showModal = false} class="absolute top-4 right-4 focus:ring-2 focus:outline-none focus:ring-gray-200 font-medium rounded-full p-2.5">
                    <svg class="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
                <button
                    on:click={() => authenticatePassword(room.password, room.id)}
                    class="text-white font-noto bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                >
                    Join Room
                </button>
            </Modal>
        {/if}
        {/if}
    {/each}
</div>
