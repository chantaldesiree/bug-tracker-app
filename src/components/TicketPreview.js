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
        backgroundColor: "#020a40",
        paddingTop: "12px",
        paddingBottom: "1px",
        borderRadius: "5px",
        color: "#d3d9ff",
        marginTop: "10px",
      }}
    >
      <Row className="d-flex justify-content-between">
        <Col xs={8} lg={9}>
          <h5>
            <Link to>
              [{props.status.toUpperCase()}] [Ticket{" "}
              {String(props.number).padStart(5, "0")}] {props.title}
            </Link>
          </h5>
          <p style={{ fontSize: "1.15em" }}>{props.desc}</p>
        </Col>
        <Col
          xs={4}
          lg={3}
          className="text-primary"
          style={{ textAlign: "right" }}
        >
          <Link to>...</Link>
          <p>{props.category}</p>
        </Col>
      </Row>
      <Row>
        <p style={{ fontSize: ".75em" }}>
          Submitted by: <Link to="">{props.ownedByUsername}</Link> | Created:{" "}
          {props.createdAt} | Last Modified: {props.lastModifiedAt}
        </p>
      </Row>
    </Container>
  );
}

export default TicketPreview;
