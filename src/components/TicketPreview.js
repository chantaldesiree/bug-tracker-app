import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PremadeProfile from "./PremadeProfiles";

function TicketPreview(props) {
  return (
    <Container
      style={{
        backgroundColor: "#131e61",
        paddingTop: "12px",
        paddingBottom: "1px",
        borderRadius: "5px",
        color: "#d3d9ff",
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      <Row className="d-flex justify-content-between">
        <Col>
          <h5>
            <Link to>
              [Ticket {String(props.number).padStart(5, "0")}] {props.title}
            </Link>
          </h5>
        </Col>
        <Col className="text-primary" style={{ textAlign: "right" }}>
          <Link to>...</Link>
        </Col>
      </Row>
      <Row>
        <p>{props.desc}</p>
      </Row>
    </Container>
  );
}

export default TicketPreview;
