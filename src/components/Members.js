import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Nav from "../components/Nav";

function Members() {
  return (
    <>
      <Container
        style={{
          backgroundColor: "#000550",
          minHeight: "100vh",
          minWidth: "100%",
          paddingTop: "15px",
        }}
      >
        <Nav />
        <Container className="d-flex flex-column justify-contents-center">
          <Container className="mx-1">
            <Row>
              <Container
                className="d-flex justify-content-center align-items-center bg-primary mt-3"
                style={{
                  borderRadius: "5px",
                  paddingTop: "9px",
                  paddingBottom: "6px",
                }}
              >
                <h5 style={{ color: "#e8ecfd" }}>Members List:</h5>
              </Container>
            </Row>
            <Container
              className="mx-0"
              style={{
                backgroundColor: "#131e61",
                padding: "12px",
                borderRadius: "5px",
                color: "#d3d9ff",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <Row style={{ color: "#e8ecfd" }}>
                <Col>Username:</Col>
                <Col>Last Name:</Col>
                <Col>First Name:</Col>
                <Col>Tickets Assigned:</Col>
                <Col>Tickets Completed:</Col>
              </Row>
            </Container>
          </Container>
        </Container>
      </Container>
      )
    </>
  );
}

export default Members;
