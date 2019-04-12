import React from "react";
import { Text } from "react-native";

export default function CustomListItem({ label, ...rest }) {
  return <Text {...rest}>{label}</Text>;
}
