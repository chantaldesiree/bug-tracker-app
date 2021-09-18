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
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { withRouter } from "react-router";

function TicketPreview(props) {
  const { signout, currentUser } = useAuth();
  let url = "/ticket/" + props.ticketID;
  const [editURL, setEditURL] = useState();
  const [badgeType, setBadgeType] = useState();
  const [priorityType, setPriorityType] = useState();
  const [bTextColor, setBTextColor] = useState();
  const [pTextColor, setPTextColor] = useState();

  const history = useHistory();

  function setBadges() {
    if (props) {
      setEditURL("/ticket/edit/" + props.ticketID);

      switch (props.category) {
        case "Bug":
          setBadgeType("primary");
          setBTextColor("light");
          break;
        case "Account Issue":
          setBadgeType("dark");
          setBTextColor("light");
          break;
        default:
          setBadgeType("secondary");
          setBTextColor("light");
      }

      switch (props.priority) {
        case "Emergency":
          setPriorityType("danger");
          setPTextColor("light");
          break;
        case "High":
          setPriorityType("warning");
          setPTextColor("dark");
          break;
        case "Medium":
          setPriorityType("info");
          setPTextColor("dark");
          break;
        default:
          setPriorityType("success");
          setPTextColor("light");
      }
    }
  }

  function deleteTicket() {
    var ticket = db.collection("tickets").where("id", "==", props.ticketID);
    ticket
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      })
      .then(() => {
        history.push("/");
      });
  }

  useEffect(() => {
    setBadges();
  }, []);

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
        <Col xs={8} xl={10}>
          <h5>
            <Link to={url}>
              [{props.status.toUpperCase()}] [Ticket{" "}
              {String(props.ticketID).padStart(5, "0")}] {props.title}
            </Link>{" "}
            <Badge pill bg={priorityType} text={pTextColor}>
              {props.priority}
            </Badge>{" "}
            <Badge pill bg={badgeType} text={bTextColor}>
              {props.category}
            </Badge>
          </h5>
        </Col>
        <Col
          xs={4}
          xl={2}
          className="text-primary"
          style={{ textAlign: "right" }}
        >
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href={url}>View Ticket</Dropdown.Item>
              {currentUser.email === props.submittedByUsername ||
              currentUser === props.ownedByUsername ||
              props.user.role == "Admin" ||
              props.user.role == "SuperAdmin" ? (
                <>
                  <Dropdown.Item href={editURL}>Edit Ticket</Dropdown.Item>
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
        <Col xs={12} sm={10}>
          <p style={{ fontSize: "1.15em" }}>{props.desc}</p>
        </Col>
        <Col xs={0} sm={2}></Col>
      </Row>
      <Row>
        <p style={{ fontSize: ".75em" }}>
          Submitted by: <Link to="">{props.submittedByUsername}</Link> |
          Created: {props.createdAt} | Last Modified: {props.lastModifiedAt}|
          Last Modified by: <Link to="">{props.ownedByUsername}</Link>
        </p>
      </Row>
    </Container>
  );
}
export default withRouter(TicketPreview);
