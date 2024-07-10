<script lang="ts">
	import {
		doc,
		addDoc,
		updateDoc,
		getDoc,
		collection,
        onSnapshot,
        query,
        QuerySnapshot,
	} from "firebase/firestore";
	import { db } from "$lib/firebase";
	import { page } from "$app/stores";
	import { createForm } from 'felte';
	import { validateSchema, validator } from '@felte/validator-yup';
	import * as yup from 'yup';
    import { tick } from "svelte";
	import { browser } from "$app/environment";
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from "svelte";
	import { initFirebaseApp } from '$lib/firebase';

	let text: string;
	let time: Date;
	let message: QuestionData = {};
	let chosen: QuestionData = {};
	let disabled: QuestionData = {};
	let hidden: QuestionData = {};
	let keyids: Set<string> = new Set<string>();
	let room_name: string;
	let room_description: string;
	let room_exist: boolean = true;
    let room_id: string = $page.params.room_id;
	let questions: Question[] = [];

    const schema = yup.object({
        comment: yup.string().required("Comment is required"),
    });

    const { form, errors, isValid, setFields, validate } = createForm<yup.InferType<typeof schema>>({
        extend: validator({ schema }),
    });

	type Comment = {
		id?: string;
		text: string;
		room_id: string;
		time: Date;
	}
    type Question = {
        id: string;
        text: string;
        options: Array<string>;
		results: Array<number>;
		open: boolean;
    }
	interface QuestionData {
		[key: string]: any;
	}

	onMount(async() => {
		await initFirebaseApp();
		
		text = "";
		message = {};
		chosen = {};
		disabled = {};
		hidden = {};
		keyids = new Set<string>();
		room_exist = true;
		room_id = $page.params.room_id;
		questions = [];

		let ref = await getDoc(doc(db, `Rooms`, `${room_id}`));
		let snap = ref.data();
		if(snap !== undefined) {
			room_name = snap.name;
			room_description = snap.description;
			room_exist = snap.exist;
		}

		onSnapshot(
			query(collection(db, `/Rooms/${room_id}/Questions`)),
			(snapshot: QuerySnapshot) => {
				questions = snapshot.docs.map((doc) => {
					const data = doc.data();
					const item: Question = {
						id: doc.id,
						text: data.text,
						options: data.options,
						results: data.results,
						open: data.open,
					};
					const id:string = doc.id;
					const keyid:string = room_id + "_" + id;
					keyids.add(keyid);
					if((browser) && (sessionStorage.hasOwnProperty(keyid))) {
						if(Number(sessionStorage.getItem(keyid)) != -1) {
							chosen[id] = Number(sessionStorage.getItem(keyid));
							Disable(id);
						} else {
							chosen[id] = -1;
							Enable(id);
						}
					} else {
						chosen[id] = -1;
						Enable(id);
						if(browser) sessionStorage.setItem(keyid, '-1');
					}
					return item;
				});
			}
		);
	});

	const addComment = async () => {
		time = new Date();
		setFields( {comment: text} );
		const validationResult = await validate();
		if(validationResult){
			const comment: Comment = {
				text : text,
				room_id : room_id,
				time : time,
			};
			try {
				const docRef = await addDoc(collection(db, `Rooms/${room_id}/Comments`), comment);
				text = "";
			} catch (e) {
				console.error("Error adding document: ", e);
			}
		}
	}
	const Disable = (question_id: string) => {
		disabled[question_id] = true;
		hidden[question_id] = true;
		message[question_id] = "Voted";
	}
	const Enable = (question_id: string) => {
		disabled[question_id] = false;
		hidden[question_id] = false;
		message[question_id] = "";
	}
	const vote = (question_id: string, q_index: number) => {
		let chosenIndex = chosen[question_id];
		if (chosenIndex === -1) {
			message[question_id] = "Choose your answer";
		} else { 
			message[question_id] = "";
			let cnt = questions[q_index]["results"][chosenIndex];
			let renew = questions[q_index]["results"];
			renew[chosenIndex] = ++cnt;
			try {
				updateDoc(doc(db, `Rooms/${room_id}/Questions`, `${question_id}`), {"results": renew});
				Disable(question_id);
				if(browser) sessionStorage.setItem(room_id + "_" + question_id, chosen[question_id]);
			} catch (e) {
				console.error("Error updating document: ", e);
			}
		}
	}
	const changevote = (question_id: string, q_index: number) => {
		let chosenIndex = chosen[question_id];
		let cnt = questions[q_index]["results"][chosenIndex];
		let renew = questions[q_index]["results"];
		renew[chosenIndex] = --cnt;
		try {
			if(browser) sessionStorage.setItem(room_id + "_" + question_id, '-1');
			Enable(question_id);
			updateDoc(doc(db, `Rooms/${room_id}/Questions`, `${question_id}`), {"results": renew});
		} catch (e) {
			console.error("Error updating document: ", e);
		}
	}

	beforeNavigate((navigation) => {
		if(navigation.type === 'popstate' || navigation.type === `link`){
			keyids.forEach((keyid) => {
				sessionStorage.removeItem(keyid);
			});
		}
	});
</script>

<svelte:head>
    <title>Audience Room</title>
    <meta name="description" content="About this app" />
</svelte:head>

<div class="p-8">
	<h2 class="font-noto font-bold text-lg relative mb-6 pr-16 after:absolute after:left-0 after:w-full after:-bottom-3 after:h-[2px] after:bg-gray-300">
		<div class="inline-block font-extralight text-sm mr-2 px-3 py-1 rounded-full text-white bg-gray-500">Room</div>
		{#if room_name}{room_name}{/if}
	</h2>
	<div class="relative text-gray-500 text-sm font-noto font-light px-4 py-2 mt-2 mb-6 before:absolute before:w-1 before:h-full before:left-1 before:top-0 before:bg-gray-300">
		{#if room_description}{room_description}{/if}
	</div>
	<a href="/join" class="absolute right-10 top-20 inline-flex items-center justify-center rounded-full p-2 mt-2 bg-gray-400 hover:bg-gray-500 focus:outline-none">
		<svg class="w-[24px] h-[24px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
		</svg>
	</a>

	{#if room_exist}
	<!-- Question -->
	<h2 class="mb-4 font-bold text-center">Questions accepting answer</h2>
	<div class="mx-auto max-w-lg my-4">
		<div>
			{#each questions as question, q_index}
			{#if question !== undefined && question.open}
			<details class="group rounded-lg bg-gray-50 border border-gray-300 my-2">
				<summary class="flex cursor-pointer list-none items-center justify-between p-4 pl-6 font-noto font-medium text-secondary-900">
					{question.text}
					<div class="text-secondary-500">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="block h-5 w-5 transition-all duration-300 group-open:rotate-180">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
						</svg>
					</div>
				</summary>
				<div class="px-6 pb-3 text-secondary-500">
				{#each question.options as option, index}
					<div class="flex items-center space-x-2 rounded p-2 pl-6 hover:bg-gray-100 font-noto">
						<input type="radio" name="{question.id}" id="{question.id}_{index}" value={index} bind:group={chosen[question.id]} disabled={disabled[question.id]} 
							class="h-4 w-4 rounded-full border-gray-300 text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
							>
						<label for="{question.id}_{index}" class="flex w-full space-x-2 text-sm"> {option} </label>
					</div>
				{/each}
				<div class="text-sm text-red-600 flex p-1 pb-4 leading-6" style="visibility: {message[question.id] ? "visible" : "hidden"}">
					{#if message[question.id] != "Voted"}
					<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
					</svg>
					{:else}
					<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
					</svg>
					{/if}
					{message[question.id]}
				</div>
				{#if !hidden[question.id]}
				<button on:click={() => vote(question.id, q_index)}
					class="mb-4 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Vote
				</button>
				{:else}
				<button on:click={() => changevote(question.id, q_index)}
					class="mb-4 block text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
				>
					Change
				</button>
				{/if}
				</div>
			</details>
			{/if}
			{/each}
		</div>
	</div>

	<!-- Send Comment-->
	<h2 class="mt-10 mb-4 font-bold text-center">Send your comment!</h2>
	<form use:form on:submit|preventDefault = {addComment} class="max-w-md mx-auto">
		<div class="relative flex items-center mb-1">
			<input bind:value={text} type="comment" name="comment" id="comment" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Input comment" />
			<button type="submit" class="inline-flex items-center justify-center rounded-full h-12 p-3 ml-2 text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 transform rotate-90">
					<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
				</svg>
			</button>
		</div>
		<div class="text-sm text-red-600 flex ml-5 pb-5 leading-6" style="visibility: {$errors.comment ? "visible" : "hidden"}">
			<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
			</svg>
			{$errors.comment}
		</div>
	</form>

	{:else}
	<div class="m-6">This room is closed. If you have any problem, please contact the organizer.</div>
	{/if}
</div>