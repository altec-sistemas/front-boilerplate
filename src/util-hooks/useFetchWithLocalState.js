import useSetState from "./useSetState";

export default function useFetchWithLocalState(requestFn) {
  const initialState = {
    status: "notAsked",
    data: null,
    error: null
  };
  const [state, setState] = useSetState(initialState);

  async function fetchFn() {
    setState({
      status: "pending"
    });

    try {
      const response = await requestFn();

      let payload;

      if (response.statusText === "No Content") {
        payload = {};
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          payload = await response.json();
        } else {
          payload = JSON.parse(await response.text());
        }
      }

      if (response.ok) {
        return setState({
          status: "fulfilled",
          data: payload
        });
      }

      if (response.status === 401) {
        // ... redirecionar para sign-in
      }

      return setState({
        status: "rejected",
        error: payload
      });
    } catch (error) {
      console.log("Error message", error.message);
      setState({
        status: "rejected",
        error: error.message
      });
    }
  }
  return [state, fetchFn];
}
