<script>
  import PdfViewer from "svelte-pdf";
  import { onMount } from "svelte";

  let path = '';
  let errorMessage = '';
  let fileInput; // input要素を参照するための変数
  let showButtons = ["navigation", "zoom", "pageInfo"]
  let scale = 1.0; // 初期のスケール値を調整

  onMount(() => {
    fileInput = document.getElementById('fileInput');
  });

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        path = URL.createObjectURL(file);
        errorMessage = ''; // クリアエラーメッセージ
        fileInput.style.display = 'none'; // ファイル選択ボタンを非表示にする
      } else {
        path = '';
        errorMessage = 'PDFファイルを選択してください';
      }
    }
  }

  function clearFile() {
    path = '';
    errorMessage = '';
    fileInput.value = null; // input要素の選択をクリアする
    fileInput.style.display = 'inline-block'; // ファイル選択ボタンを再表示する
  }
</script>

<input id="fileInput" type="file" on:change={handleFileChange} class="absolute top-80 inset-x-0 mx-auto z-10 block w-1/3 bg-white border-2 border-gray-200 shadow-sm rounded-lg text-sm font-noto cursor-pointer focus:border-blue-500 focus:ring-blue-500 file:bg-gray-100 file:border-0 file:me-4 file:py-3 file:px-4">

{#if errorMessage}
  <p style="color: red;">{errorMessage}</p>
{/if}

{#if path}
  <div class="pdf-container overflow-hidden z-10 absolute top-12 bottom-0 w-full xl:-top-4">
      <PdfViewer url={path} scale={scale} showButtons={showButtons} showBorder={false}/>
  </div>
{/if}
