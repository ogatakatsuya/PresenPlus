<script>
  export let title = "コメント投稿・表示機能";
  export let subtitle = "ダイナミックなコメント機能";
  export let description =
    "オーディエンスはリアルタイムでコメントを投稿でき、コメントは一定時間表示された後に消えます。Svelteの反応性の高いフレームワークにより、コメントが投稿されるたびに即座に画面に反映されます。さらに、Svelteのスマートなスタイル適用機能を利用して、投稿が多いコメントは自動的に大きく表示され、重要なフィードバックが一目でわかるようになります。これにより、オーディエンスの声を的確に拾い上げることが可能です。";
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
