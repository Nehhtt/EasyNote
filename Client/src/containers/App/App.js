import React, { PureComponent } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import routes from "../../static/routes";
import { AuthProvider } from "../../context";
import AppRoute from "../../Components/AppRoutes";

class App extends PureComponent {
  render() {
    return (
      <AuthProvider>
        <Router>
          <Switch>
            {routes.map((route) => (
              <AppRoute
                key={route.path}
                path={route.path}
                component={route.component}
                isPrivate={route.isPrivate}
              />
            ))}
          </Switch>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
