import React, { useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Redirect } from "../platform-specific/router";
import AppState from "../AppState";
import useAuth from "../logic-hooks/useAuth";
import useDeepCompareEffect from "../util-hooks/useDeepCompareEffect";
import CustomTextInput from "../components/CustomTextInput";

export default function SignIn({ history, location }) {
  const { appState } = useContext(AppState);

  const {
    signInState,
    signIn,
    newUser,
    setNewUser,
    newPassword,
    setNewPassword
  } = useAuth({ history });

  useDeepCompareEffect(() => {
    console.log({ signInState });
  }, [signInState]);

  const { from } = location.state || { from: { pathname: "/" } };

  return !!appState.token ? (
    <Redirect to={from} />
  ) : (
    <View>
      <CustomTextInput onChangeText={setNewUser} value={newUser} />
      <CustomTextInput
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={signIn} disabled={!newUser || !newPassword}>
        <Text>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
