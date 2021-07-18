import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import DatePicker from "react-datepicker";
import PropTypes from "prop-types";

function AccountCreation() {
  const usernameRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const [date, setDate] = useState();
  const { currentUser } = useAuth();
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setDate(Date.now());
  }, []);

  function handleDateChange(date) {
    setDate(date);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      usernameRef.current.value.length < 6 ||
      firstNameRef.current.value.length < 6
    ) {
      return setError("Please provide a correct firstName.");
    }

    try {
      setError(``);
      setLoading(true);

      history.push("/");
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
              <h2 className="text-center mb-4">Account Creation</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="username" ref={usernameRef} required />
                </Form.Group>
                <Form.Group id="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="firstName" ref={firstNameRef} required />
                </Form.Group>
                <Form.Group id="firstName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="firstName" ref={lastNameRef} required />
                </Form.Group>
                <div className="mt-4 d-flex justify-content-center align-items-center">
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    startDate={date}
                    inline
                  />
                </div>
                <Button className="w-100 mt-4" type="submit">
                  Create Account
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AccountCreation;
