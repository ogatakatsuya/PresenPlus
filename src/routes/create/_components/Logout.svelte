<script>
  import { auth } from "$lib/firebase";
  import { signOut } from "firebase/auth";

  const clickHandler = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successfully");
      })
      .catch((error) => {
        alert(error);
      });
  };
</script>

<button on:click={clickHandler}>ログアウト</button>
