import { Form, Button, Card, Alert } from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, signin, currentUser } = useAuth();
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function userLogin() {
    signin("user@user.com", "password");
    history.push("/");
  }
  function supportLogin() {
    signin("support@support.com", "password");
    history.push("/");
  }
  function adminLogin() {
    signin("admin@admin.com", "password");
    history.push("/");
  }
  function superAdminLogin() {
    signin("superadmin@superadmin.com", "password");
    history.push("/");
  }

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
      history.push("/");
    } catch {
      setError("Failed to create account.");
    }
  }

  const profileStyle = {
    width: "80px",
    height: "80px",
    color: "#e8ecfd",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

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
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="passwordConfirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                  />
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-4" type="submit">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2 text-light">
            Already have an account?{" "}
            <Link to="/SignIn">
              <span style={{ color: "#1266F1" }}>Sign In</span>
            </Link>
          </div>
          <div className="mt-5 text-center">
            <h4 className="pb-3 text-light">Or use a premade profile:</h4>
            <div className="d-flex justify-content-between align-items-center flex-wrap-wrap">
              <Button style={profileStyle} onClick={userLogin}>
                <h6>User</h6>
              </Button>
              <Button style={profileStyle} onClick={supportLogin}>
                <h6>Support</h6>
              </Button>
              <Button style={profileStyle} onClick={adminLogin}>
                <h6>Admin</h6>
              </Button>
              <Button style={profileStyle} onClick={superAdminLogin}>
                <h6>Super Admin</h6>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
