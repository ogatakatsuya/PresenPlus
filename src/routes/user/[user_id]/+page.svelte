<script>
    import { getDoc, updateDoc, doc, and } from "firebase/firestore"; 
    import { db } from "$lib/firebase";
    import { onMount } from "svelte";
    import { authStore } from "../../../store";
    import ProfileMenu from "./_components/profileMenu.svelte";
    import OpenCloseBtn from "./_components/OpenCloseBtn.svelte";
    import { goto } from "$app/navigation";
    import Modal from "./_components/Modal.svelte";
    import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
    
    let user;
    let user_description = "";
    let userRooms = [];
    let roomDetails = [];
    let newroom;
    let submitDisabled;

    const schema = yup.object({
		roomName: yup.string().required(),
		roomPassword: yup.string().min(6, "password must be 6 characters long"),
		roomDescription: yup.string().required(),
        roomNewPasswordSet: yup.string().required(),
        roomNewPassword: yup.string().when('roomNewPasswordSet', {
            is: 'yes',
            then: (schema => schema.min(6, "new password must be 6 characters long"))
        })
	});

	const { form, errors, isValid, data } = createForm({
		extend: validator({ schema }),
	})
    $: submitDisabled = $isValid === false;

    const changeRoom = async (newroom) => {
        if($isValid && newroom.inputpass === newroom.password) {
            try {
                const roomRef = doc(db, `Rooms/${newroom.roomid}`); // Correctly reference the room's document in the 'Rooms' collection
                if(newroom.newpass !== "") newroom.password = newroom.newpass;
                delete newroom.roomid;
                delete newroom.showModal;
                delete newroom.inputpass;
                delete newroom.newpass;
                await updateDoc(roomRef, newroom);
                console.log(`Room changed successfully.`);
                window.location.reload();
            } catch (e) {
                console.error("Error changing room: ", e);
            }
        } else if(isValid) {
            alert("Password is wrong.");
        }
    }

    const fetchUserRooms = async () => {
        try {
            const userRef = doc(db, "User", user.uid);
            const userDoc = await getDoc(userRef); //User/{user_id}のDocを取ってくる

            if (userDoc.exists()) {
                const userData = userDoc.data();
                user_description = userData.user_description;
                userRooms = userData.rooms || []; //room_idをとる

                roomDetails = await Promise.all(userRooms.map(async (roomId) => { //room_idを元にRoomのDocを取ってくる
                    const roomRef = doc(db, "Rooms", roomId);
                    const roomDoc = await getDoc(roomRef);
                    let item = null;
                    if(roomDoc.exists()){
                        item = roomDoc.data();
                        item["roomid"] = roomId;
                        item["showModal"] = false;
                        item["inputpass"] = "";
                        item["newpass"] = "";
                    }
                    return item;
                }));
            } else {
                console.log("No such user document!");
            }
        } catch (e) {
            console.error("Error fetching user rooms: ", e);
        }
    }
    
    const unsubscribe = authStore.subscribe(value => {
        user = value.user;
        if(user) fetchUserRooms();
        console.log(user);
    });
    
    onMount(() => {
        return () => {
            unsubscribe();
        };
    });
</script>


{#if user != undefined}
<div class="w-full p-20">
    <div class="w-full flex flex-row font-noto items-center">
        <div class="w-28 h-28 bg-white rounded-full flex justify-center items-center mr-8 shadow">
            <svg class="w-[96px] h-[96px] text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
            </svg>
        </div>
        <div class="">
            {#if user}<p class="text-3xl mb-2">{user.displayName}</p>
            <p class="text-lg">{user.email}</p>
            <p class="text-sm">Created at {new Date(user.metadata.creationTime).toLocaleDateString('ja-JP')}</p>{/if}
        </div>
    </div>
    <div class="my-5 lg:mr-80 p-8 bg-white rounded-lg font-noto shadow">
        {user_description}
    </div>
    <div class="my-5 px-4 py-4 bg-white rounded-lg font-noto shadow">
        <div class="px-4 max-h-96 overflow-y-scroll">
        <ul>
            {#each roomDetails as room}
                {#if room}
                    <li class="py-5 border-b flex items-center">
                        <div>
                            <h2 class="font-bold text-lg relative mb-2 pr-6 flex">
                                {#if room.exist}<div class="font-extralight text-sm mr-2 px-3 py-1 rounded-full text-white bg-red-600">Open</div>
                                {:else}<div class="font-extralight text-sm mr-2 px-3 py-1 rounded-full text-white bg-gray-500">Closed</div>
                                {/if}
                                {room.name}
                                <button on:click={() => {newroom = structuredClone(room);room.showModal = true;}} class="pl-2">
                                    <svg class="w-[24px] h-[24px] text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z"/>
                                    </svg>
                                </button>
                            </h2>
                            {#if room.showModal}
                            <Modal bind:showModal={room.showModal}>
                                <div class="max-w-sm mx-auto font-noto mt-2 mb-4">
                                    <h1 class="font-noto font-bold text-lg relative mb-6 after:absolute after:-left-4 after:-right-4 after:-bottom-2 after:h-[2px] after:bg-gray-300">
                                        Change Room Info
                                    </h1>
                                    <form use:form on:submit|preventDefault = {changeRoom(newroom)}>
                                        <label class="block mb-2 text-base font-medium text-gray-900">
                                            Room Name
                                            <input bind:value={newroom.name} type="text" name="roomName" placeholder="Your room name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4">
                                            <div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="{$errors.roomName ? "visibility: visible" : "display: none"}">
                                                <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>
                                                {$errors.roomName}
                                            </div>
                                        </label>
                                        
                                        <label class="block mb-2 mt-5 text-base font-medium text-gray-900">
                                            Room Description
                                            <textarea bind:value={newroom.description} name="roomDescription" rows="4"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4" placeholder="Write your room description"></textarea>
                                            <div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="{$errors.roomDescription ? "visibility: visible" : "display: none"}">
                                                <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>
                                                {$errors.roomDescription}
                                            </div>
                                        </label>

                                        <div class="block mb-2 mt-5 text-base font-medium text-gray-900 flex items-center">
                                            Change Password?
                                            <label class="ml-6 mx-2 text-sm font-medium text-gray-900 flex items-center">
                                                <input type="radio" value="yes" name="roomNewPasswordSet" class="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
                                                Yes
                                            </label>
                                            <label class="mx-2 text-sm font-medium text-gray-900 flex items-center">
                                                <input checked type="radio" value="no" name="roomNewPasswordSet" class="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
                                                No
                                            </label>
                                            <div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="{$errors.roomNewPasswordSet ? "visibility: visible" : "display: none"}">
                                                <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>
                                                {$errors.roomNewPasswordSet}
                                            </div>
                                        </div>

                                        <label class="block mb-2 mt-5 text-base font-medium text-gray-900" style="{$data.roomNewPasswordSet === 'yes' ? "visibility: visible" : "display: none"}">
                                            New Password
                                            <input bind:value={newroom.newpass} type="password" name="roomNewPassword" placeholder="Your new room password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4">
                                            <div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="{$errors.roomNewPassword ? "visibility: visible" : "display: none"}">
                                                <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>
                                                {$errors.roomNewPassword}
                                            </div>
                                        </label>
                                        
                    
                                        <label class="block mb-2 mt-5 text-base font-medium text-gray-900">
                                            Password
                                            <input bind:value={newroom.inputpass} type="password" name="roomPassword" placeholder="Your room password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4">
                                            <div class="text-sm text-red-600 flex leading-6 mt-1 ml-2" style="{$errors.roomPassword ? "visibility: visible" : "display: none"}">
                                                <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                </svg>
                                                {$errors.roomPassword}
                                            </div>
                                        </label>

                                        <button type="submit" disabled={submitDisabled} class="text-white mt-6 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
                                            Change
                                        </button>
                                    </form>
                                </div>
                            </Modal>
                            {/if}
                            <div class="relative text-gray-600 font-noto font-light px-4 py-2 my-3 before:absolute before:w-1 before:h-full before:left-1 before:top-0 before:bg-gray-300">
                                {room.description}
                            </div>
                            
                        </div>
                        {#if room.exist}
                        <div class="ml-auto flex flex-col">
                            <button type="button" on:click={() => goto(`../organizer/${room.roomid}`)} class="text-white font-noto bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base leading-6 px-5 py-2.5 mb-1 text-center inline-flex items-center">
                                Join
                                <svg class="ml-1 w-6 h-6 text-white ml-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
                                </svg>
                            </button>
                            <OpenCloseBtn room_id={room.roomid} makeit="close"/>
                        </div>
                        {:else}
                        <div class="ml-auto flex flex-col">
                            <OpenCloseBtn room_id={room.roomid} makeit="open"/>
                        </div>
                        {/if}
                    </li>
                {/if}
            {/each}
        </ul>
        </div>
    </div>
    <div class="absolute right-20 top-32 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-64 font-noto hidden lg:block">
        <ProfileMenu {user} {user_description}/>
    </div>
</div>
{:else}
<div class="text-column">
    <p>You need to authenticate to use this content.</p>
    <a href="/auth/login">
        <button type="submit" class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            Login
        </button>
    </a>
    <a href="/auth/register">
        <button type="submit" class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            Sign up
        </button>
    </a>
</div>
{/if}