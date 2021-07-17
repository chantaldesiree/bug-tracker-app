import { Container, Form, Button, Card } from "react-bootstrap";
import { useRef } from "react";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const profileStyle = {
    width: "80px",
    height: "80px",
    color: "white",
    backgroundColor: "#1266F1",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      <h1 className="text-center mb-4" style={{ color: "#1266F1" }}>
        Bug Tracker App
      </h1>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form>
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
                type="passwordConfirm"
                ref={passwordConfirmRef}
                required
              />
            </Form.Group>
            <Button className="w-100 mt-4" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Container className="w-100 text-center mt-2">
        Already have an account?{" "}
        <span style={{ color: "#1266F1" }}>Sign In</span>
      </Container>
      <Container className="mt-5 text-center">
        <h4 className="pb-3">Or use a premade profile:</h4>
        <Container className="d-flex justify-content-between align-items-center flex-wrap-wrap">
          <Container style={profileStyle}>
            <h6>User</h6>
          </Container>
          <Container style={profileStyle}>
            <h6>Support</h6>
          </Container>
          <Container style={profileStyle}>
            <h6>Admin</h6>
          </Container>
          <Container style={profileStyle}>
            <h6>Super Admin</h6>
          </Container>
        </Container>
      </Container>
    </>
  );
}

export default SignUp;
