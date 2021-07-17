import { Container, Form, Button, Card } from "react-bootstrap";
import { useRef } from "react";

function SignIn() {
  const emailRef = useRef();
  const passwordRef = useRef();

  return (
    <>
      <h1 className="text-center mb-4" style={{ color: "#1266F1" }}>
        Bug Tracker App
      </h1>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign In</h2>
          <Form>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button className="w-100 mt-4" type="submit">
              Sign In
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Container className="w-100 text-center mt-2">
        Forgot your password?{" "}
        <span style={{ color: "#1266F1" }}>Reset it here.</span>
      </Container>
    </>
  );
}

export default SignIn;
