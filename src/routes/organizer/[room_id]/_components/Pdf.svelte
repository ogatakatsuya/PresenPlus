<script>
  import PdfViewer from "svelte-pdf";
  import { onMount } from "svelte";

  let path = "";
  let errorMessage = "";
  let fileInput; // input要素を参照するための変数
  let showButtons = ["navigation", "timeInfo", "pageInfo"];
  let scale = 1.0; // 初期のスケール値を調整

  onMount(() => {
    fileInput = document.getElementById("fileInput");
  });

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        path = URL.createObjectURL(file);
        errorMessage = ""; // クリアエラーメッセージ
        fileInput.style.display = "none"; // ファイル選択ボタンを非表示にする
      } else {
        path = "";
        errorMessage = "PDFファイルを選択してください";
      }
    }
  }

  function clearFile() {
    path = "";
    errorMessage = "";
    fileInput.value = null; // input要素の選択をクリアする
    fileInput.style.display = "inline-block"; // ファイル選択ボタンを再表示する
  }
</script>

<input id="fileInput" type="file" on:change={handleFileChange} class="z-10" />

{#if errorMessage}
  <p style="color: red;">{errorMessage}</p>
{/if}

{#if path}
  <div class="pdf-container z-10">
    <PdfViewer url={path} {scale} {showButtons} showBorder={false} />
  </div>
{/if}

<style>
  .pdf-container {
    height: 100vh; /* 画面全高 */
    overflow: hidden; /* スクロールバーを非表示 */
  }
</style>
