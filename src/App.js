import React, { Fragment } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import { AuthProvider } from "./contexts/AuthContext";

import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import AccountCreation from "./components/AccountCreation";
import ForgotPassword from "./components/ForgotPassword";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/accountcreation" component={AccountCreation} />
            <Route path="/signup" component={SignUp} />
            <Route path="/signin" component={SignIn} />
            <Route path="/forgotpassword" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}
