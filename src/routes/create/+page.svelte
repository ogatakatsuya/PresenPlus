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



<div>
	{#if user === undefined}
		<p>Loading...</p>
	{:else if user}
		{#if user.email}
			<div class="max-w-sm mx-auto font-noto mt-10 mb-5">
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
			<div class="block lg:hidden max-w-sm mx-auto ">
				<Logout mode="button" />
			</div>
		{:else}
			<div class="text-column">
				<h1>メールアドレス認証を完了させてください．</h1>
			</div>
			<Logout mode="button" />
		{/if}
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
</div>
