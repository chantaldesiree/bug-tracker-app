import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { db } from "../firebase";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function TicketPreview(props) {
  const { signout, currentUser } = useAuth();
  let url = "/ticket/" + props.number;
  let editUrl = "/ticket/" + props.number + "/edit/";
  let badgeType = "";
  let priorityType = "";
  let textColor = "";

  switch (props.category) {
    case "Bug":
      badgeType = "primary";
      textColor = "light";
      break;
    case "Account Issue":
      badgeType = "dark";
      textColor = "light";
      break;
    default:
      badgeType = "secondary";
      textColor = "light";
  }

  switch (props.priority) {
    case "Emergency":
      priorityType = "danger";
      textColor = "light";
      break;
    case "High-Priority":
      priorityType = "warning";
      textColor = "dark";
      break;
    case "Medium-Priority":
      priorityType = "info";
      textColor = "dark";
      break;
    default:
      priorityType = "success";
      textColor = "light";
  }

  function deleteTicket() {
    var ticket = db.collection("tickets").where("id", "==", props.number);
    ticket
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      })
      .then(() => {
        return props.number;
      });
  }

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
        <Col xs={9}>
          <h5>
            <Link to={url}>
              [{props.status.toUpperCase()}] [Ticket{" "}
              {String(props.number).padStart(5, "0")}] {props.title}
            </Link>{" "}
            <Badge pill bg={priorityType} text={textColor}>
              {props.priority}
            </Badge>{" "}
            <Badge pill bg={badgeType} text={textColor}>
              {props.category}
            </Badge>
          </h5>

          <p style={{ fontSize: "1.15em" }}>{props.desc}</p>
        </Col>
        <Col xs={3} className="text-primary" style={{ textAlign: "right" }}>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href={url}>View Ticket</Dropdown.Item>
              {currentUser.email === props.ownedBy ? (
                <>
                  <Dropdown.Item href={editUrl}>Edit Ticket</Dropdown.Item>
                  <Dropdown.Item onClick={deleteTicket}>
                    Delete Ticket
                  </Dropdown.Item>
                </>
              ) : (
                <></>
              )}
            </Dropdown.Menu>
          </Dropdown>
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
