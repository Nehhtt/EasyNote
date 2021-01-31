import React from "react";
import "react-native-gesture-handler";

import { Router } from "react-router-native";
import routes from "./src/routes/routes";
import AppRoute from "./src/containers/App/AppRoute";
import { AuthProvider } from "./src/context";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {routes.map((route) => (
          <AppRoute
            key={route.path}
            path={route.path}
            component={route.component}
            isPrivate={route.isPrivate}
          />
        ))}
      </Router>
    </AuthProvider>
  );
};
export default App;
