import { Form, Button, Card, Alert } from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function ForgotPassword() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { passwordreset } = useAuth();
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError(``);
      setLoading(true);
      await passwordreset(emailRef.current.value);
      history.push("/SignIn");
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
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h1 className="text-center mb-4" style={{ color: "#1266F1" }}>
            Bug Tracker App
          </h1>
          <Card style={{ backgroundColor: "#e8ecfd", padding: 10 }}>
            <Card.Body>
              <h2 className="text-center mb-4">Forgot Your Password?</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Button className="w-100 mt-4" type="submit">
                  Reset Your Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2 text-light">
            Remember you password?{" "}
            <Link to="/SignIn">
              <span style={{ color: "#1266F1" }}>Sign in here.</span>
            </Link>
          </div>
          <div className="w-100 text-center mt-2 text-light">
            New?{" "}
            <Link to="/SignUp">
              <span style={{ color: "#1266F1" }}>Sign up here.</span>
            </Link>
          </div>
          <div className="mt-5 text-center">
            <h4 className="pb-3 text-light">Or use a premade profile:</h4>
            <div className="d-flex justify-content-between align-items-center flex-wrap-wrap">
              <Button style={profileStyle}>
                <h6>User</h6>
              </Button>
              <Button style={profileStyle}>
                <h6>Support</h6>
              </Button>
              <Button style={profileStyle}>
                <h6>Admin</h6>
              </Button>
              <Button style={profileStyle}>
                <h6>Super Admin</h6>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
