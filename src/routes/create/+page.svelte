<script lang="ts">
	import {
		addDoc,
		collection,
		doc,
		runTransaction
	} from "firebase/firestore";
	import { db, auth } from "$lib/firebase";
	import { goto } from "$app/navigation";
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import Logout from "./_components/Logout.svelte";
	import ProfileMenu from "./_components/profileMenu.svelte"
	import { authStore } from "../../store";
	import { onMount } from "svelte";
	import Loading from "./_components/Loading.svelte";

	let user;
    const unsubscribe = authStore.subscribe(value => {
        user = value.user;
    });

    onMount(() => {
        return () => {
            // コンポーネントが破棄されるときにサブスクリプションを解除
            unsubscribe();
        };
    });

	type Room = {
		id?: string;
		name: string;
		password: string;
		description: string;
		exist: boolean;
		user_id: string;
	}
	let roomName: string = "";
	let roomPassword: string = "";
	let roomDescription: string = "";

	const schema = yup.object({
		roomName: yup.string().required(),
		roomPassword: yup.string().min(6, "password must be 6 characters long"),
		roomDescription: yup.string().required(),
	});

	//felteフレームワークを使用した関係でvalidateForm関数ごと変えます
	const { form, errors, isValid } = createForm({
		extend: validator({ schema }),
	})

	const addRoom = async () => {
		if ($isValid) {
			console.log(`form content posted: ${roomName} ${roomPassword} ${roomDescription}`);

			const room: Room = {
				name: roomName,
				password: roomPassword,
				description: roomDescription,
				exist: true,
				user_id: user.uid,
			};
			try {
				const docRef = await addDoc(collection(db, "Rooms"), room);
				const room_id = docRef.id;

				// Run a transaction to update the user's rooms array
				await runTransaction(db, async (transaction) => {
					const userRef = doc(db, "Users", user.uid);
					const userDoc = await transaction.get(userRef);

					if (!userDoc.exists()) {
						throw "User does not exist!";
					}

					const userData = userDoc.data();
					const userRooms = userData.rooms || [];

					transaction.update(userRef, {
						rooms: [...userRooms, room_id]
					});
				});

				goto(`/organizer/${room_id}`);
				roomName = "";
				roomPassword = "";
				roomDescription = "";
			} catch (e) {
				console.error("Error adding document: ", e);
			}
			roomName = "";
			roomPassword = "";
			roomDescription = "";
		}
	}
</script>

{#if user === undefined}
	<div class="text-column font-noto">
		<h1 class="text-2xl font-bold">Loading...</h1>
		<p class="text-sm sm:text-base my-4 text-center">If the screen does not change after waiting one minute, <br>please log in again using the button below.</p>
		<div class="mx-auto w-4/5">
			<button on:click={() => goto('/auth/login')}
				class="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
				<svg class="w-8 h-8 -ml-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
				</svg>
				<span class="ml-3">
					Log In
				</span>
			</button>
		</div>
		<div class="mx-auto w-4/5">
			<button on:click={() => goto('/auth/register')}
				class="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
				<svg class="w-8 h-8 -ml-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
				</svg>
				<span class="ml-3">
					Sign Up
				</span>
			</button>
		</div>
	</div>
{:else if user}
	{#if user.emailVerified}
		<div class="w-full px-4 sm:max-w-sm mx-auto font-noto mt-10 mb-5">
			<h1 class="font-noto font-bold text-lg relative mb-6 after:absolute after:-left-4 after:-right-4 after:-bottom-2 after:h-[2px] after:bg-gray-300">
				Create Presentation Room
			</h1>
			<form use:form on:submit|preventDefault = {addRoom}>
				<label for="name-input" class="block mb-2 text-base font-medium text-gray-900">Room Name</label>
				<input bind:value={roomName} type="text" name="roomName" placeholder="Your room name" id="name-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4">
				<div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="visibility: {$errors.roomName ? "visible" : "hidden"}">
					<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
					</svg>
					{$errors.roomName}
				</div>

				<label for="password-input" class="block mb-2 text-base font-medium text-gray-900">Password</label>
				<input bind:value={roomPassword} type="password" name="roomPassword" placeholder="Your room password" id="password-input"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4">
				<div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="visibility: {$errors.roomPassword ? "visible" : "hidden"}">
					<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
					</svg>
					{$errors.roomPassword}
				</div>

				<label for="room-description" class="block mb-2 text-base font-medium text-gray-900">Room Description</label>
				<textarea bind:value={roomDescription} id="room-description" name="roomDescription" rows="4"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4" placeholder="Write your room description"></textarea>
				<div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="visibility: {$errors.roomDescription ? "visible" : "hidden"}">
					<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
					</svg>
					{$errors.roomDescription}
				</div>

				<button type="submit" class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Create</button>
			</form>
		</div>

		<div class="absolute right-6 top-24 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-64 font-noto hidden lg:block">
			<ProfileMenu {user}/>
		</div>
		<div class="block lg:hidden w-full sm:max-w-sm mx-auto px-4">
			<Logout mode="button" />
		</div>
		<button on:click={() => {goto(`user/${user.uid}`)}} class="absolute right-4 top-20 sm:right-14 sm:top-24 w-10 h-10 p-1 w-auto h-auto overflow-hidden bg-gray-100 rounded-full rounded-full shadow font-noto z-0 block lg:hidden">
			<svg class="w-10 h-10 sm:w-[48px] sm:h-[48px] text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
		</button>
	{:else}
		<div class="text-column">
			<h1 class="mb-6">メールアドレス認証を完了させてください．</h1>
			<Logout mode="button" />
		</div>
	{/if}
{:else}
<Loading />
{/if}