import React from "react";
import { TouchableOpacity, FlatList } from "react-native";

export default function CustomList({ children, onPressItem, ...rest }) {
  function Item({ item }) {
    return (
      <TouchableOpacity onPress={() => onPressItem(item)}>
        {children(item)}
      </TouchableOpacity>
    );
  }

  return <FlatList renderItem={Item} {...rest} />;
}
