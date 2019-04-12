import { useReducer } from "react";

export default function useSetState(initialState) {
  return useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState
  );
}
