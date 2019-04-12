import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";

export default function CustomTextInput({ label, ...rest }) {
  return (
    <>
      <Text>{label}</Text>
      <TextInput style={styles.container} {...rest} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "blue"
  }
});
