<script lang="ts">
	import {
		doc,
		addDoc,
		updateDoc,
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

	let text: string = "";
	let time: Date;
	let message = {};
	let chosen = {};
	let disabled = {};
	let hidden = {};

	
	// Reactive assignment
    const room_id: string = $page.params.room_id;

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
        id?: string;
        text: string;
        options: Array<string>;
		results: Array<number>;
		open: boolean;
    }
    let questions: Question[] = [];

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
				if(!(id in message)) {
					if((browser) && (localStorage.hasOwnProperty(id)) && (Number(localStorage.getItem(id)) != -1)) {
						chosen[id] = Number(localStorage.getItem(id));
						Disable(id);
					} else {
						message[id] = "";
						chosen[id] = -1;
						disabled[id] = false;
						hidden[id] = false;
						if(browser) localStorage.setItem(id, '-1');
					}
				} else {
					if((browser) && (localStorage.hasOwnProperty(id)) && (Number(localStorage.getItem(id)) != -1)) {
						chosen[id] = Number(localStorage.getItem(id));
						Disable(id);
					}
				}
                return item;
            });
        }
    );
	const Disable = (question_id: string) => {
		disabled[question_id] = true;
		hidden[question_id] = true;
		message[question_id] = "投票完了";
	}
	const Enable = (question_id: string) => {
		disabled[question_id] = false;
		hidden[question_id] = false;
		message[question_id] = "";
	}
	const vote = (question_id: string, q_index: number) => {
		let chosenIndex = chosen[question_id];
		if (chosenIndex === -1) {
			message[question_id] = "答えを選択してください．";
		} else { 
			message[question_id] = "";
			let cnt = questions[q_index]["results"][chosenIndex];
			let renew = questions[q_index]["results"];
			renew[chosenIndex] = ++cnt;
			try {
				const docRef = updateDoc(doc(db, `Rooms/${room_id}/Questions`, `${question_id}`), {"results": renew});
				Disable(question_id);
				if(browser) localStorage.setItem(question_id, chosen[question_id]);
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
			if(browser) localStorage.setItem(question_id, '-1');
			Enable(question_id);
			const docRef = updateDoc(doc(db, `Rooms/${room_id}/Questions`, `${question_id}`), {"results": renew});
		} catch (e) {
			console.error("Error updating document: ", e);
		}
	}
</script>

<svelte:head>
    <title>Audience Room</title>
    <meta name="description" content="About this app" />
</svelte:head>

<div class="p-8">
	<h2 class="mb-4 font-bold text-center">Questions accepting answer</h2>
	<div class="mx-auto max-w-lg my-4">
		<div>
			{#each questions as question, q_index}
			{#if question.open}
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
				<div class="text-sm text-red-600 font-noto mb-1" style="padding: 10px 1rem; visibility: {message[question.id] ? "visible" : "hidden"}">{message[question.id]}</div>
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

	<h2 class="mt-10 mb-4 font-bold text-center">Send your comment!</h2>
	<form use:form on:submit|preventDefault = {addComment} class="max-w-md mx-auto">
		<div class="relative flex items-center">
			<input bind:value={text} type="comment" name="comment" id="comment" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Input comment" />
			<button type="button" class="inline-flex items-center justify-center rounded-full h-12 p-3 ml-2 text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 transform rotate-90">
					<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
				</svg>
			</button>
		</div>
		<div class="text-sm text-red-600" style="padding-bottom: 10px; visibility: {$errors.comment ? "visible" : "hidden"}">{$errors.comment}</div>
	</form>
</div>