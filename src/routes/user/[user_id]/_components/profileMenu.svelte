<script lang="ts">
    import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore"; 
    import { db } from "$lib/firebase";
    import { updateProfile } from "firebase/auth";
    import Logout from "./Logout.svelte";
	import { goto } from "$app/navigation";
    import Modal from "./Modal.svelte";
    import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';

    export let user;
    export let user_description: String;
    let showSettingModal = false;
    let username: String;
    let userdescription: String;

    const schema = yup.object({
		userName: yup.string().required().max(12, "username must be less than 12 characters"),
		userDescription: yup.string().required(),
	});

	const { form, errors, isValid, data } = createForm({
		extend: validator({ schema }),
	})
    $: submitDisabled = $isValid === false;    

    const update_profile = async () => {
        console.log("update_profile");
        console.log(username);
        console.log(user);
        updateProfile(user, {
            displayName: username,
        }).then(() => {
            console.log("profile updated");

        }).catch(() => {
            console.log("error");
        });

        const profile = {
            user_description: userdescription,
        }

        try {
            const userRef = doc(db, "Users", user.uid); // typo修正
            await updateDoc(userRef, profile);
            showSettingModal = false;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        window.location.reload();
    }
</script>

{#if user}
<ul class="py-2 text-sm text-gray-700 hidden sm:block">
    <li>
        <button on:click={() => {goto(`./${user.uid}`)}} class="hover:bg-gray-100 px-4 py-2 w-full hidden lg:flex">
            <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                <svg class="absolute w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
            <p class="my-auto truncate ml-3 text-base">{#if user.displayName}{user.displayName}{:else}User{/if}</p>
        </button>
    </li>
    <li>
        <button on:click={() => {userdescription = user_description; username = user.displayName; showSettingModal = true;}} class="flex pl-6 p-2 hover:bg-gray-100 w-full border-t">
            <svg class="w-[28px] h-[28px] text-gray-500 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
            </svg>
            <p class="my-auto">Settings</p>
        </button>
    </li>
    <li>
        <Logout mode="dropdown"/>
    </li>
</ul>
<ul class="py-2 text-sm text-gray-700 block sm:hidden">
    <li>
        <button on:click={() => {userdescription = user_description; username = user.displayName; showSettingModal = true;}} class="flex sm:pl-6 p-2 hover:bg-gray-100 rounded-full m-1 sm:w-full bg-white shadow">
            <svg class="w-[28px] h-[28px] text-gray-500 sm:mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
            </svg>
        </button>
    </li>
    <li>
        <Logout mode="dropdown"/>
    </li>
</ul>


{#if showSettingModal}
    <Modal bind:showModal={showSettingModal}>
        <div class="max-w-sm mx-auto font-noto mt-2 mb-4">
            <h1 class="font-noto flex justify-center font-bold text-lg relative mb-6 after:absolute after:-left-4 after:-right-4 after:-bottom-2 after:h-[2px] after:bg-gray-300">
                <svg class="w-[28px] h-[28px] text-black mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
                Settings
            </h1>
            <form use:form on:submit|preventDefault = {update_profile}>
                <label class="block mb-2 text-base font-medium text-gray-900">
                    UserName
                    <input bind:value={username} type="text" name="userName" placeholder="Your user name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4">
                    <div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="{$errors.userName ? "visibility: visible" : "display: none"}">
                        <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        {$errors.userName}
                    </div>
                </label>
                
                <label class="block mb-2 mt-5 text-base font-medium text-gray-900">
                    User Description
                    <textarea bind:value={userdescription} name="userDescription" rows="4"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-4" placeholder="Write your user description"></textarea>
                    <div class="text-sm text-red-600 flex leading-6 mt-1 mb-5 ml-2" style="{$errors.userDescription ? "visibility: visible" : "display: none"}">
                        <svg class="w-6 h-6 text-red-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        {$errors.userDescription}
                    </div>
                </label>

                <button type="submit" disabled={submitDisabled} class="text-white mt-6 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
                    Edit Profile
                </button>
            </form>
        </div>
    </Modal>
{/if}
{/if}