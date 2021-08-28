import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import { AuthProvider } from "./contexts/AuthContext";

import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import AccountCreation from "./components/AccountCreation";
import ForgotPassword from "./components/ForgotPassword";
import Members from "./components/Members";
import Profile from "./components/Profile";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute
              path="/account-creation"
              component={AccountCreation}
            />
            <PrivateRoute path="/members" component={Members} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}
