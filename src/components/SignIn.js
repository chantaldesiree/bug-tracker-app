import { Form, Button, Card, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import PremadeProfile from "./PremadeProfiles";

function SignIn() {
  const passwordRef = useRef();
  const { signin, currentUser } = useAuth();
  const [error, setError] = useState(``);
  const history = useHistory();
  const emailRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      emailRef.current.value.length < 6 ||
      passwordRef.current.value.length < 6
    ) {
      return setError("Please provide a correct password.");
    }

    try {
      setError(``);
      await signin(emailRef.current.value, passwordRef.current.value).then(
        () => {
          db.collection("users")
            .doc(emailRef.current.value)
            .get()
            .then((doc) => {
              if (!doc.data()) {
                history.push("/account-creation");
              } else {
                auth.onAuthStateChanged((currentUser) => {
                  if (currentUser) history.push("/");
                });
              }
            });
        }
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", backgroundColor: "#00043f" }}
      >
        <div className="w-100 my-3" style={{ maxWidth: "350px" }}>
          <h1 className="text-center mb-4" style={{ color: "#1266F1" }}>
            Bug Tracker App
          </h1>
          <Card style={{ backgroundColor: "#e8ecfd", padding: 10 }}>
            <Card.Body>
              <h2 className="text-center mb-4">Sign In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <FloatingLabel
                    controlId="floatingEmailInput"
                    label="Email"
                    className="text-primary"
                  >
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      required
                      placeholder="email@email.com"
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group id="password" className="my-3">
                  <FloatingLabel
                    controlId="floatingPasswordInput"
                    label="Password"
                    className="text-primary"
                  >
                    <Form.Control
                      type="password"
                      ref={passwordRef}
                      placeholder="password"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Button
                  className="w-100"
                  style={{ padding: "15px" }}
                  type="submit"
                >
                  Sign In
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2 text-light">
            Forgot your password?{" "}
            <Link to="/forgot-password">
              <span style={{ color: "#1266F1" }}>Reset it here.</span>
            </Link>
          </div>
          <div className="w-100 text-center mt-2 text-light">
            New?{" "}
            <Link to="/sign-up">
              <span style={{ color: "#1266F1" }}>Sign up here.</span>
            </Link>
          </div>
          <PremadeProfile />
        </div>
      </div>
    </>
  );
}

export default SignIn;
