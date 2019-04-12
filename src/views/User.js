import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { withRouter } from "../platform-specific/router";
import useAuth from "../logic-hooks/useAuth";
import useUsers from "../logic-hooks/useUsers";
import usePosts from "../logic-hooks/usePosts";
import CustomList from "../components/CustomList";
import CustomListItem from "../components/CustomListItem";

export default withRouter(User);

function User({ history }) {
  const { signOut } = useAuth({ history });

  const {
    getUserState: { status: getUserStatus, data: getUserData },
    getUser,
    userId,
    setUserId
  } = useUsers();

  const {
    getUserPostsState: { status: getUserPostsStatus, data: getUserPostsData },
    getUserPosts,
    userId: userIdForPosts,
    setUserId: setUserIdForPosts
  } = usePosts();

  useEffect(() => {
    const userIdFromUrl = history.location.pathname.split("/")[2];
    setUserId(userIdFromUrl);
    setUserIdForPosts(userIdFromUrl);
  });

  useEffect(() => {
    userId && getUser();
  }, [userId]);

  useEffect(() => {
    userIdForPosts && getUserPosts();
  }, [userIdForPosts]);

  return (
    <View>
      <Text>User (private view)</Text>
      <TouchableOpacity onPress={signOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>

      <Text>{getUserData && getUserData.name}'s posts</Text>
      <CustomList
        data={Array.isArray(getUserPostsData) ? getUserPostsData : []}
        keyExtractor={({ id }) => id.toString()}
        onRefresh={getUserPosts}
        refreshing={getUserPostsStatus === "pending"}
        onPressItem={() => {}}
      >
        {item => <CustomListItem label={item.title} />}
      </CustomList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});
