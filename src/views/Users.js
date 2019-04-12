import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { withRouter } from "../platform-specific/router";
import useAuth from "../logic-hooks/useAuth";
import useUsers from "../logic-hooks/useUsers";
import CustomList from "../components/CustomList";
import CustomListItem from "../components/CustomListItem";

export default withRouter(Users);

function Users({ history }) {
  const { signOut } = useAuth({ history });
  const {
    getUsersState: { status: getUsersStatus, data: getUsersData },
    getUsers
  } = useUsers();

  useEffect(() => {
    getUsers();
  }, []);

  function handlePressItem(item) {
    history.push(`/users/${item.id}`);
  }

  useEffect(() => {
    console.log({ getUsersData });
  }, [getUsersData]);

  return (
    <View>
      <Text>Users (private view)</Text>
      <TouchableOpacity onPress={signOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>
      <CustomList
        data={Array.isArray(getUsersData) ? getUsersData : []}
        keyExtractor={({ id }) => id.toString()}
        onRefresh={getUsers}
        refreshing={getUsersStatus === "pending"}
        onPressItem={item => handlePressItem(item)}
      >
        {item => <CustomListItem label={item.name} />}
      </CustomList>
    </View>
  );
}
