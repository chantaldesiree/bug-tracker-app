import { Form, Button, Card, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import PremadeProfile from "./PremadeProfiles";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, signin } = useAuth();
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    } else if (passwordRef.current.value.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    try {
      setError(``);
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value).then(
        () => {
          signin(emailRef.current.value, passwordRef.current.value);
        }
      );
      history.push("/sign-in");
    } catch {
      setError("Failed to create account.");
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
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <FloatingLabel
                    controlId="floatingEmailInput"
                    label="Email"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      placeholder="email@email.com"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group id="password">
                  <FloatingLabel
                    controlId="floatingPasswordInput"
                    label="Password"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="password"
                      ref={passwordRef}
                      placeholder="password"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group id="passwordConfirm">
                  <FloatingLabel
                    controlId="floatingPasswordConfirmInput"
                    label="Password Confirmation"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="password"
                      ref={passwordConfirmRef}
                      placeholder="Password Confirmation"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Button
                  disabled={loading}
                  className="w-100"
                  style={{ padding: "15px" }}
                  type="submit"
                >
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2 text-light">
            Already have an account?{" "}
            <Link to="/sign-in">
              <span style={{ color: "#1266F1" }}>Sign In</span>
            </Link>
          </div>
          <PremadeProfile />
        </div>
      </div>
    </>
  );
}

export default SignUp;
