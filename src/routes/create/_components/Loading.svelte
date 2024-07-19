<script>
    import logo from '$lib/images/logo_black.png';
    import fabicon from '$lib/images/fabicon.ico';
    import loginsingin from '$lib/images/loginsignin.svg'
    import { goto } from '$app/navigation';
</script>

<div class="min-h-screen h-full text-gray-900 flex justify-center">
    <div class="max-w-screen-xl sm:rounded-lg flex justify-center flex-1">
        <div class="lg:w-1/2 xl:w-5/12 pt-12 p-6 sm:p-12 sm:pt-16">
            <div>
                <img src={logo} class="hidden lg:block w-32 mx-auto" alt="PresenPlus"/>
                <img src={fabicon} class="block lg:hidden w-16 mx-auto" alt="PresenPlus"/>
            </div>
            <div class="mt-12 flex flex-col items-center">
                <h1 class="text-2xl xl:text-3xl font-extrabold">
                    Log in / Sign up
                </h1>
                <div class="w-full flex-1 mt-8">
                    <div class="flex flex-col items-center">
                        You need to authenticate to use this content.
                    </div>
                    <div class="mx-auto max-w-xs">
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
                    <div class="mx-auto max-w-xs">
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
            </div>
        </div>
        <div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div class="my-auto mx-16 xl:m-16 w-full">
                <img src={loginsingin} alt="" />
            </div>
        </div>
    </div>
</div>