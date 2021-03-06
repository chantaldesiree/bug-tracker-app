import { Form, Button, Card, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PremadeProfile from "./PremadeProfiles";

function ForgotPassword() {
  const emailRef = useRef();
  const { passwordreset } = useAuth();
  const [error, setError] = useState(``);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError(``);
      await passwordreset(emailRef.current.value);
      history.push("/sign-in");
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
              <h2 className="text-center mb-4">Forgot Password?</h2>
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
                <Button
                  className="w-100"
                  style={{ padding: "15px" }}
                  type="submit"
                >
                  Reset Your Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2 text-light">
            Remember you password?{" "}
            <Link to="/sign-in">
              <span style={{ color: "#1266F1" }}>Sign in here.</span>
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

export default ForgotPassword;
