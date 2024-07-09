<script lang="ts">
	import {
        collection,
        onSnapshot,
        query,
        QuerySnapshot,
		addDoc,
    } from "firebase/firestore";
	import { db } from "$lib/firebase";
	import { page } from "$app/stores";
	import Modal from "./_components/Modal.svelte";
	import FlowingComment from './_components/FlowingComment.svelte';
	import PdfViewer from "./_components/Pdf.svelte";
	import CloseButton from "./_components/CloseButton.svelte";
	import ShowQuestion from './_components/ShowQuestion.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';

	type Comment = {
		id: string;
		text: string;
		room_id: string;
		time: number;
		past: boolean;
	}
	type Question = {
		id?: string;
		text: string;
		options: string[];
		results: number[];
		open: boolean;
	}

	let commentList: Comment[] = [];
	const room_id: string = $page.params.room_id;
	let question = '';
	let showCreateModal = false;
	let options = [''];
	let results = [0];
	let makingPresen = false;
	let option_err: string = "";

	const schema = yup.object({
        question: yup.string().required("Question Title is required"),
    });

	const { form, errors, isValid } = createForm({
        extend: validator({ schema }),
    });

	function addOption() {
		options = [...options, ''];
		results = [...results, 0];
	}

	function removeOption(index: number) {
        options = options.filter((_, i) => i !== index);
		results = results.filter((_, i) => i !== index);
    }

	function init() {
		showCreateModal = true;
		option_err = '';
		question = '';
		options = [''];
		results = [0];
	}

	const addQuestion = async () => {
		if($isValid) {
			let empty = false;
			options.forEach(op => {
				if(op === '') empty = true;
			});
			if(options.length <= 1) {
				option_err = "There must be 2 or more options.";
			} else if(empty) {
				option_err = "There are empty options.";
			} else {
				const questionData: Question = {
					text: question,
					options: options,
					results: results,
					open: true,
				};
				try {
					await addDoc(collection(db, `Rooms/${room_id}/Questions`), questionData);
					showCreateModal = false;
				} catch (e) {
					console.error("Error adding document: ", e);
				}
			}
		}
	}

	const now: number = Date.now();
	onSnapshot(
		query(collection(db, `/Rooms/${room_id}/Comments`)),
		(snapshot: QuerySnapshot): any => {
			commentList = snapshot.docs.map((doc: any) => {
				const data = doc.data();
				const past = (data.time.seconds*1000 - now > 0) ? false : true;
				const item: Comment = {
					id: doc.id,
					text: data.text,
					room_id: data.room_id,
					time: data.time.seconds,
					past: past,
				};
				return item;
			});
		}
	);

	function noscroll(e){e.preventDefault();}
	function presentation() {
		if(makingPresen){
			makingPresen = false;
			document.removeEventListener('touchmove', noscroll);
			document.removeEventListener('wheel', noscroll);
		} else {
			makingPresen = true;
			location.href = '#presen';
			document.addEventListener('touchmove', noscroll, {passive: false});
			document.addEventListener('wheel', noscroll, {passive: false});
		}
	}
</script>

<svelte:head>
	<title>Organizer Room</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div id="presen" class="h-screen relative">
	<!-- Close Presentation Room -->
	<CloseButton />

	<!-- PDF -->
	<PdfViewer />

	<!-- Comments -->
	<div class="w-full absolute overflow-x-hidden top-36 xl:top-20 bottom-12 inset-x-0">
		{#each commentList as comment (comment.id)}
			{#if !comment.past}
				<FlowingComment text={comment.text}/>
			{/if}
		{/each}
	</div>

	<!-- Create Question -->
	<span class="absolute bottom-6 left-6 z-20 group">
		<span class="whitespace-nowrap rounded bg-black px-2 py-1 text-white absolute -top-10 left-1/2 -translate-x-1/4 before:absolute before:-translate-x-1/2 before:left-1/4 before:top-full before:border-4 before:border-transparent before:border-t-black opacity-0 group-hover:opacity-100 transition pointer-events-none">Create Question</span>
		<button on:click={init} class="m-1 text-white font-noto bg-blue-600 hover:bg-blue-700 focus:ring-f focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-auto p-3 text-center">
			<svg class="w-[28px] h-[28px] dtext-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
			</svg>
		</button>
	</span>

	<!-- Scroll -->
	{#if makingPresen}
	<span class="absolute bottom-6 right-6 z-20 group">
		<span class="whitespace-nowrap rounded bg-black px-2 py-1 text-white absolute -top-10 left-1/2 -translate-x-3/4 before:absolute before:-translate-x-1/2 before:left-3/4 before:top-full before:border-4 before:border-transparent before:border-t-black opacity-0 group-hover:opacity-100 transition pointer-events-none">Stop Presentation</span>
		<button on:click={presentation} class="m-1 text-white font-noto bg-red-600 hover:bg-red-700 focus:ring-f focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm w-auto p-3 text-center">
			<svg class="w-[28px] h-[28px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
				<path fill-rule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clip-rule="evenodd"/>
			</svg>
		</button>
	</span>
	{:else}
	<span class="absolute bottom-6 right-6 z-20 group">
		<span class="whitespace-nowrap rounded bg-black px-2 py-1 text-white absolute -top-10 left-1/2 -translate-x-3/4 before:absolute before:-translate-x-1/2 before:left-3/4 before:top-full before:border-4 before:border-transparent before:border-t-black opacity-0 group-hover:opacity-100 transition pointer-events-none">Start Presentation</span>
		<button on:click={presentation} class="m-1 z-20 text-white font-noto bg-blue-600 hover:bg-blue-700 focus:ring-f focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-auto p-3 text-center">
			<svg class="w-[28px] h-[28px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
				<path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd"/>
			</svg>
		</button>
	</span>
	{/if}

	<ShowQuestion />
</div>

<!-- Modal -->
{#if showCreateModal}
    <Modal bind:showModal={showCreateModal}>
		<form use:form>
			<h2 class="font-noto font-bold text-lg relative mb-6 pr-6 after:absolute after:left-0 after:w-full after:-bottom-2 after:h-[2px] after:bg-gray-300">
				Create Question
			</h2>
			<label for="inputQuestion" class="inline-block mb-2 ml-1 font-noto">Question Title</label>
			<input bind:value={question} name="question" type="text" placeholder="Question" id="inputQuestion" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
			<div class="text-sm text-red-600 flex pb-4 leading-6 ml-2 pt-1" style="visibility: {$errors.question ? "visible" : "hidden"}">
				<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
				</svg>
				{$errors.question}
			</div>
			
			<label for="inputOptions" class="inline-block my-2 ml-1 font-noto">Input Options</label>
			{#each options as option, index}
				<div class="flex items-center">
					<input 
						type="text"
						placeholder={`Option${index + 1}`} 
						class="my-1 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
						bind:value={options[index]}
					>
					<button on:click={() => removeOption(index)} class="ml-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200">
						<svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
						</svg>
					</button>
				</div>
			{/each}
			
			<div class="flex items-center mt-1 mb-4">
				<div class="text-sm text-red-600 flex leading-6 ml-2 w-full" style="visibility: {option_err ? "visible" : "hidden"}">
					<svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
					</svg>
					{option_err}
				</div>
				<button on:click={addOption} class="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300">
					<svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
					</svg>
				</button>
			</div>
			
			<button on:click={addQuestion} class="my-2 text-white font-noto bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
				Create
			</button>
			<button on:click={() => showCreateModal = false} class="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-200 font-medium rounded-full p-2.5">
				<svg class="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
				</svg>
			</button>
		</form>
    </Modal>
{/if}