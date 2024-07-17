<script lang="ts">
	import {
		addDoc,
		collection,
	} from "firebase/firestore";
	import { signInWithEmailAndPassword } from "firebase/auth";
	import { db, auth } from "$lib/firebase";
	import { goto } from "$app/navigation";
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';

	let email : string = "";
	let password : string = "";

	const schema = yup.object({
		email: yup.string().email().required(),
		password: yup.string()
			.min(6)
			.max(255)
			.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9.?!/-]/, 
				'Password must contain at least \none number, one lowercase letter,\none uppercase letter')
			.required(),
	});

	const { form, errors, isValid } = createForm({
		extend: validator({ schema }),
	});

	const submitHandler = async () => {
		if($isValid) {
			await signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log("successfully login");
				email="";
				password="";
				goto("/create")
			})
			.catch((error) => {
				alert(error);
			});
		}
	}
</script>

<section class="text-column w-full">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full md:h-screen lg:py-0">
		<div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
					Login
				</h1>
				<form use:form class="space-y-4 md:space-y-6 min-w-64 sm:min-w-80" on:submit={submitHandler}>
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
						<input bind:value={email} type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com">
						<div class="text-sm text-red-600 p-1 {$errors.email ? "visible" : "hidden"}">{$errors.email}</div>
					</div>
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
						<input bind:value={password} type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ">
						<div class="text-sm text-red-600 p-1 {$errors.password ? "visible" : "hidden"}" style=" white-space: pre;">{$errors.password}</div>
					</div>
					<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Log in</button>
					<p class="text-sm font-light text-gray-500 dark:text-gray-400">
						Don't have an account yet? <a href="/auth/register" class="font-medium text-blue-600 hover:underline">Sign up</a>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>