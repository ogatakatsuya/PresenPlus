<script lang="ts">
	import './styles.css';
	import Header from './Header.svelte';
	import fabicon from '$lib/images/fabicon.ico'

</script>

<svelte:head>
	<title>Presen+</title>
	<meta name="description" content="Engage your audience in real-time with our interactive voting app. Create voting rooms, restrict access with passwords, and visualize results with ease." />
	<link rel="icon" href={fabicon} />
</svelte:head>

<!-- New rectangle section - start -->
<div class="header-banner flex items-center justify-center bg-gray-800 py-4 px-6 lg:px-12 font-home"style="line-height:1.13;">
    <span class="text-gray-300 font-bold text-center text-[min(110px,13vw)] lg:max-w-2/3 lg:pl-16 mb-6">
        Speak.<br>Connect.<br>Interact.<br><span class="text-gradient text-[min(115px,13.5vw)] mb-6 lg:mb-10">Presen+ </span>
    </span>

	<section class="flex justify-center items-start text-4xl mb-12 lg:pl-16">
        <div class="flex flex-col sm:flex-row sm:justify-center lg:flex-row gap-4">
            <a href="/create" class="inline-block bg-indigo-600 px-8 py-6 text-center font-roboto font-semibold text-gray-300  outline-none ring-gray-300 transition duration-100 hover:bg-indigo-700 focus-visible:ring active:bg-indigo-800 md:text-base no-underline rounded-full " style="font-size: min(24px,8vh); text-decoration: none; width:190px; height: 75px; flex; justify-content: center; align-items: center;">Try now</a>
            <a href="/about" class="inline-block bg-gray-300 px-8 py-6 text-center font-roboto font-semibold text-[#2a2c41] outline-none ring-gray-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base no-underline rounded-full" style="font-size: min(24px,8vh); text-decoration: none; width:190px;height: 75px flex; justify-content: center; align-items: center;">More info</a>
        </div>
    </section>
</div>


<div class="second-banner py-4 px-6 lg:px-12 bg-[#1e2738] font-home flex items-center justify-center">

    <div class="grid place-items-center py-12 bg-gray-200 text-gray-800 rounded-lg mx-4 md:mx-auto md:max-w-5xl"style="width:80vw">
		<h2 class="heading-6 font-home font-bold text-3xl mb-2 lg:mb-4">Presen+</h2>
		<p class="text-gray-800 text-center text-lg lg:text-2xl">
			このサービスは<br>
			・パスワード制プレゼンルーム作成<br>
			・リアルタイム質問・結果表示<br>
			・リアルタイムコメント投稿<br>
			で参加者の声をダイナミックに反映した<br>次世代プレゼン体験を実現します。
		</p>
	</div>	
    <div class="border-t-2 border-white mt-8 pb-12 mx-auto w-11/12"></div>
</div>



<!-- New rectangle section - end -->





<!--この下は機能紹介-->
<div class="py-6 sm:py-8 lg:py-12 bg-[#f2f2f3] font-home">
	<div class="mx-auto max-w-screen-2xl px-4 md:px-8">
		<div class="mb-6 flex items-center justify-center gap-4">
		<h2 class="heading-2 font-home font-bold ">３つの魅力的な機能</h2>
		</div>
	
		<div class="grid gap-x-4 gap-y-6 sm:grid-cols-2 md:gap-x-6  lg:flex justify-center">
		
	
		<!-- product - start -->
		<div >
			<a href="./about#PresenroomFeature" class="group mb-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3">
			<img src="https://illustration-free.net/thumb/png/ifn1208.png" loading="lazy" alt="Photo by engin akyurt" class="h-80 w-80 object-cover rounded-lg object-center transition duration-200 group-hover:scale-110" />
			</a>
	
			<div class="flex flex-col">
			<span class="text-lg text-gray-500 text-center">その１</span>
			<a href="/about#PresenroomFeature" class="text-lg font-bold text-gray-800 text-center transition duration-100 hover:text-gray-500 lg:text-2xl break-words">パスワード制<br>プレゼンルーム作成</a>
			</div>
		</div>
		<!-- product - end -->
	
		<!-- product - start -->
		<div >
			<a href="/about#ResultsFeature" class="group mb-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3">
				<img src="https://iconbox.fun/wp/wp-content/uploads/1108_sy_m.png" loading="lazy" alt="Photo by engin akyurt" class="h-80 w-80 object-cover rounded-lg object-center transition duration-200 group-hover:scale-110" />
			</a>
	
			<div class="flex flex-col">
				<span class="text-lg text-gray-500 text-center">その２</span>
				<a href="/about#ResultsFeature" class="text-lg font-bold text-gray-800 text-center transition duration-100 hover:text-gray-500 lg:text-2xl break-words">リアルタイム<br>質問・結果表示</a>
			</div>
		</div>
			<!-- product - end -->
	
		<!-- product - start -->
		<div >
			<a href="/about#CommentFeature" class="group mb-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3">
				<img src="https://iconbox.fun/wp/wp-content/uploads/1111_sy_m.png" loading="lazy" alt="Photo by engin akyurt" class="h-80 w-80 object-cover rounded-lg object-center transition duration-200 group-hover:scale-110" />
			</a>
	
			<div class="flex flex-col">
				<span class="text-lg text-gray-500 text-center">その３</span>
				<a href="/about#CommentFeature" class="text-lg font-bold text-gray-800 text-center transition duration-100 hover:text-gray-500 lg:text-2xl break-words">リアルタイム<br>コメント投稿・表示</a>
			</div>
		</div>
			<!-- product - end -->
		</div>
	</div>
</div>


<style>


	.header-banner {
		width: 100%;
        height: 100vh ; /* ページ全体の3分の2の高さ */
        background-color: #1E1F23;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px; /* 必要に応じて余白を設定 */
		
	}

	.banner-text {
		font-size: 50px; /* テキストの大きさを調整 */
        color: #FFFFFF;
        font-weight: bold;
	}

	.second-banner {
		width: 100%;
        height: 50vh ; /* ページ全体の3分の2の高さ */
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px; /* 必要に応じて余白を設定 */
		
	}

	h1 {
		width: 100%;
	}

	h2 {
		font-size: 2.0rem;
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

	.text-gradient {
		display: inline-block;
		background: -webkit-linear-gradient(45deg, #54d0ff, #9f92ff 20%, #ff7689 90%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		
		/* 未対応ブラウザのために一応テキスト色を指定しておく */
		color: blue;
		}

		.heading-31 {
			position: relative;
			padding: .3em 0 .2em 1em;
			border-bottom: 3px solid #2589d0;
			color: #333333;
		}

		.heading-31::before {
			position: absolute;
			top: 0;
			left: .3em;
			transform: rotate(55deg);
			height: 11px;
			width: 12px;
			background: #2589d0;
			content: '';
		}

		.heading-31::after {
			position: absolute;
			transform: rotate(15deg);
			top: .6em;
			left: 0;
			height: 8px;
			width: 8px;
			background: #2589d0;
			content: '';
		}

		.heading-6 {
			display: inline-block;
			position: relative;
			padding: 0 2.5em;
			color: #333333;
		}

		.heading-6::before,
		.heading-6::after {
			content: '';
			display: inline-block;
			position: absolute;
			top: 50%;
			width: 45px;
			height: 3px;
			background-color: #1e2738;
		}

		.heading-6::before {
			left: 0;
		}

		.heading-6::after {
			right: 0;
		}

		.heading-2 {
			padding:0 .4em .2em;
			border-bottom: 3px solid #314d81;
			
			color: #333333;
		}
</style>
