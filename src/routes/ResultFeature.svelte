<script>
  export let title = "投票結果の表示機能";
  export let subtitle = "インタラクティブな投票結果表示";
  export let description =
    "投票結果は、Svelteの強力なデータバインディングとアニメーション機能を活用して、リアルタイムで円グラフとして視覚化されます。これにより、オーディエンスは結果を一目で理解でき、プレゼンテーションの効果が一層高まります。Svelteの再レンダリングの速さと効率性により、投票結果の表示はスムーズでシームレスな体験を提供します。";
</script>

<section class="feature">
  <h3>{title}</h3>
  <h4>{subtitle}</h4>
  <p>{description}</p>
</section>

<style>
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

  .feature p {
    font-size: 1rem;
    color: #000;
  }
</style>
