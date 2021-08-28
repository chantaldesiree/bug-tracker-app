import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function PremadeProfile() {
  const { signin, currentUser } = useAuth();
  const history = useHistory();

  const profileStyle = {
    width: "75px",
    height: "75px",
    color: "#e8ecfd",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  function signInProfile(auth) {
    let password = process.env.REACT_APP_LOGIN_PASSWORD;
    let email = "";

    switch (auth) {
      case "Support":
        email = process.env.REACT_APP_LOGIN_SUPPORT;
        break;

      case "Admin":
        email = process.env.REACT_APP_LOGIN_ADMIN;
        break;

      case "SuperAdmin":
        email = process.env.REACT_APP_LOGIN_SUPERADMIN;
        break;

      case "User":
        email = process.env.REACT_APP_LOGIN_USER;
        break;
    }

    signin(email, password).then(() => {
      if (currentUser) {
        history.push("/");
      } else {
        console.log(currentUser);
      }
    });
  }

  return (
    <div className="mt-4 text-center">
      <h4 className="pb-2 text-light">Or use a premade profile:</h4>
      <div className="d-flex justify-content-between align-items-center flex-wrap-wrap">
        <Button
          style={profileStyle}
          onClick={() => {
            signInProfile("User");
          }}
        >
          <h6 className="pt-1">User</h6>
        </Button>
        <Button
          style={profileStyle}
          onClick={() => {
            signInProfile("Support");
          }}
        >
          <h6 className="pt-1">Support</h6>
        </Button>
        <Button
          style={profileStyle}
          onClick={() => {
            signInProfile("Admin");
          }}
        >
          <h6 className="pt-1">Admin</h6>
        </Button>
        <Button
          style={profileStyle}
          onClick={() => {
            signInProfile("SuperAdmin");
          }}
        >
          <h6 className="pt-1">Super Admin</h6>
        </Button>
      </div>
    </div>
  );
}

export default PremadeProfile;
