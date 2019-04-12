import React, { useContext } from "react";

import { Route, Redirect } from "./platform-specific/router";
import AppState from "./AppState";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { appState } = useContext(AppState);
  return (
    <Route
      {...rest}
      render={props =>
        !!appState.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
