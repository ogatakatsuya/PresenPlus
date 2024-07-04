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
  import FlowingComment from "./_components/FlowingComment.svelte";
  import PdfViewer from "./_components/Pdf.svelte";
  import CloseButton from "./_components/CloseButton.svelte";

  type Comment = {
    id: string;
    text: string;
    room_id: string;
    time: number;
    past: boolean;
  };

  type Question = {
    id?: string;
    text: string;
    options: string[];
    results: number[];
    open: boolean;
  };

  let commentList: Comment[] = [];
  const room_id: string = $page.params.room_id;
  let question = "";
  let showModal = false;
  let options = [""];
  let results = [0];

  function addOption() {
    options = [...options, ""];
    results = [...results, 0];
  }

  function removeOption(index: number) {
    options = options.filter((_, i) => i !== index);
    results = results.filter((_, i) => i !== index);
  }

  const addQuestion = async () => {
    const questionData: Question = {
      text: question,
      options: options,
      results: results,
      open: true,
    };
    try {
      await addDoc(collection(db, `Rooms/${room_id}/Questions`), questionData);
      showModal = false;
      question = "";
      options = [""];
      results = [0];
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const now: number = Date.now();

  onSnapshot(
    query(collection(db, `/Rooms/${room_id}/Comments`)),
    (snapshot: QuerySnapshot): any => {
      commentList = snapshot.docs.map((doc: any) => {
        const data = doc.data();
        const past = data.time.seconds * 1000 - now > 0 ? false : true;
        const item: Comment = {
          id: doc.id,
          text: data.text,
          room_id: data.room_id,
          time: data.time.seconds,
          past: past,
        };
        return item;
      });
    },
  );
</script>

<svelte:head>
  <title>Organizer Room</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
  <CloseButton />
  <PdfViewer />
  <div class="w-full absolute overflow-x-hidden inset-y-20 inset-x-0">
    {#each commentList as comment (comment.id)}
      {#if !comment.past}
        <FlowingComment text={comment.text} />
      {/if}
    {/each}
  </div>
  <button
    type="submit"
    on:click={() => (showModal = true)}
    class="z-10 m-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    Let's discussion!
  </button>
  {#if showModal}
    <Modal bind:showModal>
      <label for="inputQuestion" class="mt-4">Input Question</label>
      <input
        bind:value={question}
        type="text"
        placeholder="Question"
        id="inputQuestion"
        class="my-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
      />

      <label for="inputOptions">Input Options</label>
      {#each options as option, index}
        <div class="flex items-center my-6">
          <input
            type="text"
            placeholder={`Option${index + 1}`}
            class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
            bind:value={options[index]}
          />
          <button
            class="ml-2 text-red-600 hover:text-red-800"
            on:click={() => removeOption(index)}
          >
            ➖
          </button>
        </div>
      {/each}
      <div>
        <button
          class="ml-2 text-blue-600 hover:text-blue-800"
          on:click={addOption}
        >
          ➕
        </button>
      </div>

      <button
        on:click={addQuestion}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </Modal>
  {/if}
</div>
