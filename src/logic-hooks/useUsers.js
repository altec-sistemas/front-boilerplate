import { useState } from "react";
import useFetchWithLocalState from "../util-hooks/useFetchWithLocalState";
import { getUser as getUserRequest, getUsers as getUsersRequest } from "../api";

export default function useUsers() {
  const [userId, setUserId] = useState();

  const [getUserState, getUser] = useFetchWithLocalState(() =>
    getUserRequest(userId)
  );

  const [getUsersState, getUsers] = useFetchWithLocalState(getUsersRequest);

  return {
    getUsersState,
    getUsers,
    getUserState,
    getUser,
    userId,
    setUserId
  };
}
