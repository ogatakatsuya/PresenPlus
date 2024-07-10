<script lang="ts">
    import {
        collection,
        onSnapshot,
        query,
        QuerySnapshot,
		updateDoc,
		doc
    } from "firebase/firestore";
	import { db } from "$lib/firebase";
    import { page } from "$app/stores";
	import Modal from "./Modal.svelte";
	import Chart from './PieChart.svelte';
    import { browser } from "$app/environment";

    type Question = {
		id: string;
		text: string;
		options: string[];
		results: number[];
		open: boolean;
	}

    const room_id: string = $page.params.room_id;
	let questionList: Question[] = [];
	let questionName: string = "";
	let question_id: string = "";
	let showChartModal = false;
    let showQ = false;
	let selected: number = 0;
    let Qlist;

	onSnapshot(
        query(collection(db, `/Rooms/${room_id}/Questions`)),
        (snapshot: QuerySnapshot) => {
            questionList = snapshot.docs.map((doc) => {
                const data = doc.data();
                const item: Question = {
                    id: doc.id,
                    text: data.text,
					options: data.options,
					results: data.results,
					open: data.open,
                };
                return item;
            });
        }
    );

	function showChart() {
        question_id = questionList[selected]['id'];
        questionName = questionList[selected]['text'];
        showChartModal = true;
	}

    function selectQuestion(index:number) {
        selected = index;
        showQ = false;
    }

    function changeQopen(index:number) {
        let questionId = questionList[index]['id'];
        let questionOpen = questionList[index]['open'];
        try {
            if(questionOpen) updateDoc(doc(db, `Rooms/${room_id}/Questions`, `${questionId}`), {"open": true});
            else updateDoc(doc(db, `Rooms/${room_id}/Questions`, `${questionId}`), {"open": false});
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }

    function handleClickOutside(event: Event) {
        if (showQ && Qlist && !Qlist.contains(event.target)) {
            showQ = false;
        }
    }
    if(browser) document.addEventListener("click", handleClickOutside);
</script>

<div class="absolute z-20 left-6 top-6 w-80">
    <div bind:this={Qlist} class="mr-2 font-noto">
        <button on:click={() => showQ = !showQ} class="relative w-full h-12 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <span class="flex items-center">
                <span class="ml-3 block truncate">{#if JSON.stringify(questionList) !== JSON.stringify([])}{questionList[selected]['text']}{/if}</span>
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
                </svg>
            </span>
        </button>
        {#if showQ}
        <ul class="mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {#each questionList as questionItem, index}
            <div class="flex relative cursor-default select-none w-full text-gray-900 hover:bg-blue-100">
                <button on:click={() => selectQuestion(index)} class="w-full py-2 px-3 ">
                    <span class="ml-3 block text-left truncate font-normal">{questionItem.text}</span>
                </button>
                <label class="inline-flex items-center cursor-pointer">
                    <input bind:checked={questionList[index]['open']} on:change={() => changeQopen(index)} type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 mr-2 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            {/each}
        </ul>
        {/if}
    </div>
    <span class="absolute top-0 left-80 group">
        <span class="whitespace-nowrap rounded bg-black px-2 py-1 text-white absolute top-14 left-1/2 -translate-x-1/2 before:absolute before:-translate-x-1/2 before:left-1/2 before:-top-2 before:border-4 before:border-transparent before:border-b-black opacity-0 group-hover:opacity-100 transition pointer-events-none">Show Chart</span>
        <button on:click={(showChart)} class="h-12 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full py-2.5 px-3">
            <svg class="w-6 h-6 text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667"/>
            </svg>
        </button>
    </span>
</div>

{#if showChartModal}
<Modal bind:showModal={showChartModal}>
	<div style="width: 30rem;">
		<div class="relative flex justify-center text-2xl font-bold font-noto mb-4 after:absolute after:left-0 after:w-full after:-bottom-2 after:h-[2px] after:bg-gray-300">
            {#if questionList[selected]['open']}<div class="font-extralight h-8 text-sm mr-2 px-3 py-1 rounded-full text-white bg-red-700">Open</div>
            {:else}<div class="font-extralight h-8 text-sm mr-2 px-3 py-1 rounded-full text-white bg-gray-500">Closed</div>
            {/if}
            <h2>{questionName}</h2>
        </div>
		<Chart {room_id} {question_id}/>
        <div class="flex font-noto mt-3 px-6 py-2 border rounded-2xl border-gray-300">
            <h3 class="flex flex-col font-bold">
                Open
                <p class="font-light text-gray-500 text-sm">Accept answers from your auience.</p>
            </h3>
            <label class="ml-auto my-auto cursor-pointer">
                <input bind:checked={questionList[selected]['open']} on:change={() => changeQopen(selected)} type="checkbox" class="sr-only peer">
                <div class="relative w-11 h-6 bg-gray-200 mr-1 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
        <button on:click={() => showChartModal = false} class="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-200 font-medium rounded-full p-2.5">
            <svg class="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
        </button>
	</div>
</Modal>
{/if}