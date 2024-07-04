<script lang="ts">
  import "./styles.css";
  import Header from "./Header.svelte";
  import fabicon from "$lib/images/fabicon.ico";
</script>

<svelte:head>
  <title>Presen+</title>
  <meta
    name="description"
    content="Engage your audience in real-time with our interactive voting app. Create voting rooms, restrict access with passwords, and visualize results with ease."
  />
  <link rel="icon" href={fabicon} />
</svelte:head>

<!-- New rectangle section - start -->
<div
  class="header-banner flex items-center justify-between bg-gray-800 py-4 px-6 lg:px-12"
>
  <span
    class="text-white text-left text-4xl md:text-6xl lg:text-6xl lg:max-w-2/3 lg:pl-16 mb-6"
    >次世代のプレゼン体験を<br /> Presen+で</span
  >
  <p
    class="text-gray-300 text-left text-lg lg:text-xl lg:max-w-2/3 lg:pl-16 mb-6"
  >
    Presen+は、パスワード制のプレゼンルーム作成、<br />
    リアルタイム質問・結果表示、<br />
    コメントの投稿・消去・強調表示機能を提供。<br />
    参加者の声をダイナミックに反映した<br />次世代プレゼン体験を実現します。
  </p>

  <section class="flex justify-center items-start text-4xl mb-12 lg:pl-16">
    <div class="flex flex-col sm:flex-row sm:justify-center lg:flex-row">
      <a
        href="/create"
        class="inline-block bg-gray-300 px-8 py-6 text-center font-semibold text-[##2a2c41] outline-none ring-gray-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base no-underline rounded-full"
        style="font-size: 24px; text-decoration: none;">今すぐ体験</a
      >
    </div>
  </section>
</div>

<!-- New rectangle section - end -->

<!--この下は機能紹介-->
<div class="py-6 sm:py-8 lg:py-12 bg-[#F0F8FF]">
  <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
    <div class="mb-6 flex items-end justify-between gap-4">
      <h2 class="text-4xl mx-auto font-bold lg:text-4xl">
        ~魅力的な３つの機能~
      </h2>
    </div>

    <div
      class="grid gap-x-4 gap-y-6 sm:grid-cols-2 md:gap-x-6 lg:flex justify-center"
    >
      <!-- product - start -->
      <div>
        <a
          href="./about#PresenroomFeature"
          class="group mb-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
        >
          <img
            src="https://illustration-free.net/thumb/png/ifn1208.png"
            loading="lazy"
            alt="Photo by engin akyurt"
            class="h-80 w-80 object-cover rounded-lg object-center transition duration-200 group-hover:scale-110"
          />
        </a>

        <div class="flex flex-col">
          <span class="text-lg text-gray-500 text-center">その１</span>
          <a
            href="/about#PresenroomFeature"
            class="text-lg font-bold text-gray-800 text-center transition duration-100 hover:text-gray-500 lg:text-2xl break-words"
            >パスワード制の<br />プレゼンルーム作成</a
          >
        </div>
      </div>
      <!-- product - end -->

      <!-- product - start -->
      <div>
        <a
          href="/about#ResultsFeature"
          class="group mb-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
        >
          <img
            src="https://iconbox.fun/wp/wp-content/uploads/1108_sy_m.png"
            loading="lazy"
            alt="Photo by engin akyurt"
            class="h-80 w-80 object-cover rounded-lg object-center transition duration-200 group-hover:scale-110"
          />
        </a>

        <div class="flex flex-col">
          <span class="text-lg text-gray-500 text-center">その２</span>
          <a
            href="/about#ResultsFeature"
            class="text-lg font-bold text-gray-800 text-center transition duration-100 hover:text-gray-500 lg:text-2xl break-words"
            >リアルタイム<br />質問・結果表示</a
          >
        </div>
      </div>
      <!-- product - end -->

      <!-- product - start -->
      <div>
        <a
          href="/about#CommentFeature"
          class="group mb-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
        >
          <img
            src="https://iconbox.fun/wp/wp-content/uploads/1111_sy_m.png"
            loading="lazy"
            alt="Photo by engin akyurt"
            class="h-80 w-80 object-cover rounded-lg object-center transition duration-200 group-hover:scale-110"
          />
        </a>

        <div class="flex flex-col">
          <span class="text-lg text-gray-500 text-center">その３</span>
          <a
            href="/about#CommentFeature"
            class="text-lg font-bold text-gray-800 text-center transition duration-100 hover:text-gray-500 lg:text-2xl break-words"
            >リアルタイム<br />コメント投稿・表示</a
          >
        </div>
      </div>
      <!-- product - end -->
    </div>
  </div>
</div>

<style>
  .header-banner {
    width: 100%;
    height: calc(100vh * (4 / 5)); /* ページ全体の3分の2の高さ */
    background-color: #2a2c41;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 20px; /* 必要に応じて余白を設定 */
  }

  .banner-text {
    font-size: 36px; /* テキストの大きさを調整 */
    color: #ffffff;
    font-weight: bold;
  }

  h1 {
    width: 100%;
  }

  h2 {
    font-size: 2rem;
    color: #2a2c41;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
  .feature {
    margin-bottom: 1.5rem;
  }

  .feature h3 {
    font-size: 1.75rem;
    color: #0056b3;
    font-weight: bolder;
  }

  .feature h4 {
    font-size: 1.25rem;
    color: #000;
  }
</style>
