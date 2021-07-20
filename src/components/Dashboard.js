import { Form, Button, Card, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const buttons = ["Home", "Issues", "Reports", "Members"];
  const { signout, currentUser } = useAuth();
  const history = useHistory();
  const [error, setError] = useState();

  async function handleSignOut(e) {
    e.preventDefault();

    try {
      setError(``);
      await signout();
      history.push("/SignUp");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div
        className="d-flex"
        style={{
          backgroundColor: "#000550",
          minHeight: "100vh",
        }}
      >
        <div
          className="flex-column"
          style={{
            background: "linear-gradient(#0029e0, #00043f)",
            color: "text-primary",
            fontWeight: "bold",
            maxWidth: "190px",
            minHeight: "100vh",
          }}
        >
          <div
            className="p-3"
            style={{
              backgroundColor: "#e8ecfd",
              color: "#0029e0",
              fontSize: "1.75em",
            }}
          >
            Dashboard
          </div>

          {buttons.map((b) => {
            return (
              <div
                className="mx-3 my-4"
                style={{ color: "#e8ecfd", fontSize: "1.25em" }}
              >
                {b}
              </div>
            );
          })}
          <Button className="mx-3 mt-2" variant="light">
            + Add Issue
          </Button>
          <Button
            className="mx-3 mt-2 sticky-bottom"
            variant="light"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
        <Container
          className="flex-row text-primary m-5 p-3"
          style={{
            background: "linear-gradient(#e8ecfd, #001e7f)",
            borderRadius: 10,
          }}
        >
          <h1 style={{ color: "#0029e0" }}>Signed In User:</h1>
          <div style={{ maxWidth: "500px", display: "block" }}>
            {currentUser.email}
            {/* {Object.keys(currentUser).map((u) => {
              return (
                <>
                  <div>{u}</div>{" "}
                  {Object.values(u).map((v) => {
                    return <div>{v}</div>;
                  })}
                </>
              );
            })} */}
          </div>
        </Container>
      </div>
    </>
  );
}

export default Dashboard;
