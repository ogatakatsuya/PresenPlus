<script lang="ts">
    import { onMount } from 'svelte';
    import { features } from '../feature.js';

    let elements = [];

    onMount(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                    observer.unobserve(entry.target);
                }
            });
        });

        elements.forEach(el => {
            observer.observe(el);
        });
    });

    function registerElement(el) {
        if (el) {
            elements.push(el);
        }
    }
</script>

<section class="text-center">
    <!-- Part 1 -->
     <div class="bg-gray-800 pt-16 pb-8">
        <div class="part1 py-12 bg-gray-200 text-gray-800 shadow-lg rounded-lg mx-4 md:mx-auto md:max-w-3xl">
            <h1 class="text-4xl font-bold mb-8 animate-slideInFromTop font-roboto">Presen+ 概要</h1>
            <p class="px-4 lg:px-0 text-lg mb-16 leading-relaxed max-w-prose m-auto text-left animate-fadeIn font-openSans">Presen+ はプレゼンターとオーディエンスによるインタラクティブな対話を可能にするためのツールです。リアルタイムな投票結果表示やコメント表示によりプレゼンを建設的なものにし、パスワードによる入室制限でセキュアで安心なプレゼン体験を提供します。</p>
        </div>
            <!-- Divider -->
        <div class="border-t-2 border-white mt-8 pb-12 mx-auto w-11/12 md:max-w-3xl"></div>
    </div>

    <!-- Part 2 -->
    <div class="bg-gray-300 py-8">
        <div class="part2 py-12 bg-gray-100 text-gray-800 shadow-lg rounded-lg mt-12 mx-4 md:mx-auto md:max-w-3xl lg:max-w-4xl lg:mx-auto">
            <h2 class="text-3xl font-bold mb-8 animate-slideInFromTop font-roboto">アプリのサービス機能</h2>
            <div class="flex flex-col justify-around items-center">
                {#each features as feature, index}
                    <div class="flex flex-col lg:flex-row items-center mb-4 w-full lg:w-5/6 p-4" id={feature.id} use:registerElement>
                        <div class="relative w-2/3 lg:w-3/7 mt-8 items-center">
                            <img src={feature.image} alt={feature.title} class="mb-4 animate-fadeIn max-w-full h-auto rounded-lg shadow-md hover:border-gray-300 hover:border-4 transition-transform duration-300 ease-in-out hover:scale-105" />
                            <div class="absolute -top-4 -left-4 bg-gray-800 text-white px-2 py-1 rounded-br-lg z-10">
                                機能 {index + 1}
                            </div>
                        </div>
                        <div class="w-4/5 sm:w-2/3 lg:w-4/7 lg:ml-12">
                            <h3 class="text-left text-2xl font-bold text-indigo-600 mb-2 font-openSans sm:whitespace-nowrap">{feature.title}</h3>
                            <h4 class="text-left text-lg font-bold text-gray-600 mb-4 font-openSans">{feature.subtitle}</h4>
                            <div class="text-left text-gray-700 leading-loose font-openSans">
                                {@html feature.content}
                            </div>    
                        </div>
                    </div>
                {/each}
            </div>
        </div>    
                    <!-- Divider -->
        <div class="border-t-2 border-white my-8 mx-auto w-11/12 md:max-w-3xl"></div>
    </div>

    <div class="flex justify-center items-center my-12">
        <a href="../create" class="inline-block rounded-lg bg-indigo-600 px-6 py-4 sm:px-12 sm:py-6 lg:px-20 lg:py-10 text-center font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-700 focus-visible:ring active:bg-indigo-800 text-xl sm:text-2xl lg:text-2xl">今すぐ体験</a>
    </div>
</section>

<style>
    .animate-fadeIn {
        @apply opacity-0;
        animation: fadeIn 0.8s ease-in forwards;
    }
    .animate-slideInFromTop {
        @apply opacity-0;
        animation: slideInFromTop 1s ease-out forwards;
    }
    .animate-slideInFromBottom {
        @apply opacity-0;
        animation: slideInFromBottom 1s ease-out forwards;
    }
</style>
