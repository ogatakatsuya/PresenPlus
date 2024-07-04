import { writable } from "svelte/store";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

// ユーザーの初期状態を設定
const initialState = {
  user: undefined,
};

// ストアを作成
export const authStore = writable(initialState);

// Firebase認証状態の監視
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  authStore.set({ user });
});
