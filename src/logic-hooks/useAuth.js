import { useState, useContext } from "react";
import { Platform } from "react-native";
import useFetchWithLocalState from "../util-hooks/useFetchWithLocalState";
import useDeepCompareEffect from "../util-hooks/useDeepCompareEffect";
import { persistMany, remove } from "../utils/storage";
import { signIn as singInRequest } from "../api";
import AppState from "../AppState";

export default function useAuth({ history }) {
  const { setAppState } = useContext(AppState);

  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [signInState, signIn] = useFetchWithLocalState(() =>
    singInRequest({
      name: newUser,
      password: newPassword
    })
  );

  useDeepCompareEffect(() => {
    if (signInState && signInState.data && signInState.data.id) {
      persistMany([["token", signInState.data.id]]);
      setAppState({ token: signInState.data.id });
    }
  }, [signInState]);

  async function signOut() {
    try {
      // ... incluir request de sign-out aqui.
      await remove("token");
      // corrigir no native
      history.go(0);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    signInState,
    signIn,
    newUser,
    setNewUser,
    newPassword,
    setNewPassword,
    signOut
  };
}
