import { useState } from "react";
import useFetchWithLocalState from "../util-hooks/useFetchWithLocalState";
import { getUserPosts as getUserPostsRequest } from "../api";

export default function usePosts() {
  const [userId, setUserId] = useState();

  const [getUserPostsState, getUserPosts] = useFetchWithLocalState(() =>
    getUserPostsRequest(userId)
  );

  return {
    getUserPostsState,
    getUserPosts,
    userId,
    setUserId
  };
}
