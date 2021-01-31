/* eslint-disable react/forbid-prop-types */
import React from "react";
import { Redirect, Route } from "react-router-native";
import PropTypes from "prop-types";
import { useAuthState } from "../../context";

const AppRoutes = ({ component: Component, path, isPrivate, ...rest }) => {
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

AppRoutes.propTypes = {
  component: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
};

export default AppRoutes;
