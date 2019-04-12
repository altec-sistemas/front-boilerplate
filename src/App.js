import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Router, Route, Redirect } from "./platform-specific/router";
import useSetState from "./util-hooks/useSetState";
import AppState from "./AppState";
import PrivateRoute from "./PrivateRoute";
import SignIn from "./views/SignIn";
import { retrieve } from "./utils/storage";
import Users from "./views/Users";
import User from "./views/User";

function Home() {
  return <Redirect to="/users" />;
}

export default function App() {
  const [appState, setAppState] = useSetState({});

  useEffect(() => {
    (async () => {
      const token = await retrieve("token");
      console.log({ token });
      setAppState({ token });
    })();
  }, []);

  return (
    <AppState.Provider value={{ appState, setAppState }}>
      <View style={styles.outer}>
        <Router>
          <View style={styles.container}>
            <Route exact path="/" component={Home} />
            <Route exact path="/sign-in" component={SignIn} />
            <PrivateRoute exact path="/users" component={Users} />
            <PrivateRoute path="/users/:id" component={User} />
          </View>
        </Router>
      </View>
    </AppState.Provider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    ...Platform.select({
      web: {
        height: "100vh"
      }
    })
  },
  container: {
    flex: 1,
    flexDirection: "row"
  }
});
