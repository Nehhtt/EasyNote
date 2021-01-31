import React, { FunctionComponent } from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuthState } from "../context";

type AppRoutesProps = {
  component: React.LazyExoticComponent<() => JSX.Element>;
  path: string;
  isPrivate: boolean;
};

const AppRoutes: FunctionComponent<AppRoutesProps> = ({
  component: Component,
  path,
  isPrivate,
  ...rest
}) => {
  const userDetails = useAuthState();
  return (
    <Route
      path={path}
      render={(props) =>
        isPrivate && !userDetails.token ? (
          <Redirect to={{ pathname: "/" }} />
        ) : (
          <Component {...props} />
        )
      }
      {...rest}
    />
  );
};

export default AppRoutes;
