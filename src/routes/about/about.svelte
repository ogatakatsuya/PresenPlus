<script lang="ts">
    import password from '$lib/images/password.jpg';
    import graph from '$lib/images/graph.jpg';
    import comment from '$lib/images/comment.jpg';

</script>

<svelte:head>
  <title>About Presen+</title>
  <meta name="description" content="Learn more about Presen+, the interactive presentation tool that enhances audience engagement with real-time voting, comments, and results visualization." />
</svelte:head>

<script>
    // スクリプト部分が必要な場合はここに記述します
</script>



<section class="text-center py-16 bg-blue-100">
    <h1 class="text-4xl font-bold mb-8">About Presen+</h1>
    <p class="text-lg mb-16">Presen+ is an interactive presentation tool designed to enhance audience engagement through real-time voting, comments, and results visualization.</p>
  
    <h2 class="text-3xl font-bold mb-8">アプリのサービス機能</h2>
  
    <div class="flex flex-wrap justify-around">
      <div class="w-full sm:w-1/2 lg:w-1/3 p-4">
        <img src={password} alt="Secure Feature" class="mb-4" />
        <h3 class="text-xl font-bold">Voting Feature</h3>
        <p>投票結果は、Svelteの強力なデータバインディングとアニメーション機能を活用して、リアルタイムで円グラフとして視覚化されます。これにより、オーディエンスは結果を一目で理解でき、プレゼンテーションの効果が一層高まります。Svelteの再レンダリングの速さと効率性により、投票結果の表示はスムーズでシームレスな体験を提供します。</p>
      </div>
  
      <div class="w-full sm:w-1/2 lg:w-1/3 p-4">
        <img src={featureImage3} alt="Results Feature" class="mb-4" />
        <h3 class="text-xl font-bold">投票結果の表示機能</h3>
        <p>投票結果は、Svelteの強力なデータバインディングとアニメーション機能を活用して、リアルタイムで円グラフとして視覚化されます。これにより、オーディエンスは結果を一目で理解でき、プレゼンテーションの効果が一層高まります。Svelteの再レンダリングの速さと効率性により、投票結果の表示はスムーズでシームレスな体験を提供します。</p>
      </div>
  
      <div class="w-full sm:w-1/2 lg:w-1/3 p-4">
        <img src={comment} alt="Comment Feature" class="mb-4" />
        <h3 class="text-xl font-bold">コメント投稿・表示機能</h3>
        <p>オーディエンスはリアルタイムでコメントを投稿でき、コメントは一定時間表示された後に消えます。Svelteの反応性の高いフレームワークにより、コメントが投稿されるたびに即座に画面に反映されます。さらに、Svelteのスマートなスタイル適用機能を利用して、投稿が多いコメントは自動的に大きく表示され、重要なフィードバックが一目でわかるようになります。これにより、オーディエンスの声を的確に拾い上げることが可能です</p>
      </div>
    </div>
</section>