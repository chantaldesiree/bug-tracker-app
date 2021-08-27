import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function PremadeProfile() {
  const { signin, currentUser } = useAuth();
  const history = useHistory();

  const profileStyle = {
    width: "80px",
    height: "80px",
    color: "#e8ecfd",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  function premadeProfileSignIn(email, password) {
    signin(email, password).then(() => {
      if (currentUser !== undefined) {
        history.push("/");
      } else {
        console.log(currentUser);
      }
    });
  }

  return (
    <div className="mt-5 text-center">
      <h4 className="pb-3 text-light">Or use a premade profile:</h4>
      <div className="d-flex justify-content-between align-items-center flex-wrap-wrap">
        <Button
          style={profileStyle}
          onClick={() => {
            premadeProfileSignIn(
              process.env.REACT_APP_LOGIN_USER,
              process.env.REACT_APP_LOGIN_PASSWORD
            );
          }}
        >
          <h6>User</h6>
        </Button>
        <Button
          style={profileStyle}
          onClick={() => {
            premadeProfileSignIn(
              process.env.REACT_APP_LOGIN_SUPPORT,
              process.env.REACT_APP_LOGIN_PASSWORD
            );
          }}
        >
          <h6>Support</h6>
        </Button>
        <Button
          style={profileStyle}
          onClick={() => {
            premadeProfileSignIn(
              process.env.REACT_APP_LOGIN_ADMIN,
              process.env.REACT_APP_LOGIN_PASSWORD
            );
          }}
        >
          <h6>Admin</h6>
        </Button>
        <Button
          style={profileStyle}
          onClick={() => {
            premadeProfileSignIn(
              process.env.REACT_APP_LOGIN_SUPERADMIN,
              process.env.REACT_APP_LOGIN_PASSWORD
            );
          }}
        >
          <h6>Super Admin</h6>
        </Button>
      </div>
    </div>
  );
}

export default PremadeProfile;
