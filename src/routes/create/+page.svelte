<script lang="ts">
  import { addDoc, collection } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import * as yup from "yup";
  import Logout from "./_components/Logout.svelte";
  import { authStore } from "../../store";
  import { onMount } from "svelte";

  let user;
  const unsubscribe = authStore.subscribe((value) => {
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
  };
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
  });

  const addRoom = async () => {
    if ($isValid) {
      console.log(
        `form content posted: ${roomName} ${roomPassword} ${roomDescription}`,
      );

      const room: Room = {
        name: roomName,
        password: roomPassword,
        description: roomDescription,
        exist: true,
      };
      try {
        const docRef = await addDoc(collection(db, "Rooms"), room);
        const room_id = docRef.id;
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
  };
</script>

<div class="text-column">
  {#if user === undefined}
    <p>Loading...</p>
  {:else if user}
    {#if user.email}
      <h1 class="mb-4">Let's make a presentation room!!</h1>

      <form use:form on:submit|preventDefault={addRoom}>
        <label for="name-input">Room Name:</label>
        <input
          bind:value={roomName}
          type="text"
          name="roomName"
          placeholder="Your room name"
          id="name-input"
          class="mb-1 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
        />
        <div
          class="text-sm text-red-600"
          style="padding-bottom: 10px; visibility: {$errors.roomName
            ? 'visible'
            : 'hidden'}"
        >
          {$errors.roomName}
        </div>

        <label for="name-input">Password:</label>
        <input
          bind:value={roomPassword}
          type="password"
          name="roomPassword"
          placeholder="Your room password"
          id="password-input"
          class="mb-1 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
        />
        <div
          class="text-sm text-red-600"
          style="padding-bottom: 10px; visibility: {$errors.roomPassword
            ? 'visible'
            : 'hidden'}"
        >
          {$errors.roomPassword}
        </div>

        <label for="room-description">Room Description:</label>
        <textarea
          bind:value={roomDescription}
          id="room-description"
          name="roomDescription"
          rows="4"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your room description"
        ></textarea>
        <div
          class="text-sm text-red-600"
          style="padding-bottom: 10px; visibility: {$errors.roomDescription
            ? 'visible'
            : 'hidden'}"
        >
          {$errors.roomDescription}
        </div>

        <button
          type="submit"
          class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >Submit</button
        >
      </form>
      <Logout />
    {:else}
      <div class="text-column">
        <h1>メールアドレス認証を完了させてください．</h1>
      </div>
      <Logout />
    {/if}
  {:else}
    <div class="text-column">
      <p>You need to authenticate to use this content.</p>
      <a href="/auth/login">
        <button
          type="submit"
          class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
      </a>
      <a href="/auth/register">
        <button
          type="submit"
          class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Sign up
        </button>
      </a>
    </div>
  {/if}
</div>
