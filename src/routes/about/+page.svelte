<script lang="ts">
  import { onMount } from "svelte";
  import { features } from "../feature.js";

  let elements = [];

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
          observer.unobserve(entry.target);
        }
      });
    });

    elements.forEach((el) => {
      observer.observe(el);
    });
  });

  function registerElement(el) {
    if (el) {
      elements.push(el);
    }
  }
</script>

<section class="text-center py-16">
  <h1 class="text-4xl font-bold mb-8 animate-slideIn">Presen+ 概要</h1>
  <p
    class="text-lg mb-16 text-gray-700 leading-relaxed max-w-prose m-auto animate-fadeIn"
  >
    Presen+
    はプレゼンターとオーディエンスによるインタラクティブな対話を可能にするためのツールです。リアルタイムな投票結果表示やコメント表示によりプレゼンを建設的なものにし、パスワードによる入室制限でセキュアで安心なプレゼン体験を提供します。
  </p>

  <h2 class="text-3xl font-bold mb-8 animate-slideIn">アプリのサービス機能</h2>

  <div class="flex flex-col justify-around items-center">
    {#each features as feature}
      <div
        class="flex flex-col lg:flex-row items-center w-full sm:w-1/2 lg:w-2/3 p-4"
        id={feature.id}
        use:registerElement
      >
        <img
          src={feature.image}
          alt={feature.title}
          class="mb-4 animate-fadeIn max-w-full h-auto lg:w-1/2 lg:mr-4"
        />
        <div class="lg:w-1/2">
          <h3 class="text-xl font-bold text-indigo-600 mb-2">
            {feature.title}
          </h3>
          <h4 class="text-lg font-bold text-gray-600 mb-4">
            {feature.subtitle}
          </h4>
          <div class="text-gray-700">
            {@html feature.content}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex justify-center items-center mt-12">
    <a
      href="../create"
      class="inline-block rounded-lg bg-indigo-500 px-6 py-4 sm:px-12 sm:py-6 lg:px-20 lg:py-10 text-center font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 text-xl sm:text-2xl lg:text-3xl"
      >今すぐ体験</a
    >
  </div>
</section>

<style>
  .animate-fadeIn {
    @apply opacity-0;
    animation: fadeIn 2s ease-in forwards;
  }
  .animate-slideIn {
    @apply opacity-0;
    animation: slideIn 2s ease-out forwards;
  }
</style>
