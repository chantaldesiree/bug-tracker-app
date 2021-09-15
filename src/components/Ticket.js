import React from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Badge,
  Dropdown,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import Nav from "../components/Nav";
import { useState, useEffect, useRef } from "react";
import { db } from ".././firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function Ticket(props) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState();
  const history = useHistory();

  const [badgeType, setBadgeType] = useState();
  const [priorityType, setPriorityType] = useState();
  const [bTextColor, setBTextColor] = useState();
  const [pTextColor, setPTextColor] = useState();

  const commentRef = useRef();

  const [editURL, setEditURL] = useState();

  async function getTicket() {
    await db
      .collection("tickets")
      .where("ticketID", "==", parseInt(props.match.params.id))
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          setTicket(doc.data());
        });
      })
      .then(() => {
        setBadges();
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  function setBadges() {
    if (ticket) {
      setEditURL("/ticket/edit/" + ticket.id);

      switch (ticket.category) {
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

      switch (ticket.priority) {
        case "Emergency":
          setPriorityType("danger");
          setPTextColor("light");
          break;
        case "High-Priority":
          setPriorityType("warning");
          setPTextColor("dark");
          break;
        case "Medium-Priority":
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
    var t = db.collection("tickets").where("id", "==", ticket.id);
    t.get()
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
    getTicket();
  }, []);

  return (
    <>
      {!loading ? (
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
                {ticket ? (
                  <>
                    <Row>
                      <Container
                        className="d-flex justify-content-center align-items-center bg-primary mt-3"
                        style={{
                          borderRadius: "5px",
                          paddingTop: "9px",
                          paddingBottom: "6px",
                        }}
                      >
                        <h5 style={{ color: "#e8ecfd" }}>
                          [Ticket {String(ticket.ticketID).padStart(5, "0")}]{" "}
                        </h5>
                      </Container>
                    </Row>
                    <Container
                      className="mx-0"
                      style={{
                        backgroundColor: "#020a40",
                        padding: "12px",
                        borderRadius: "5px",
                        color: "#d3d9ff",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <Row style={{ color: "#e8ecfd" }}>
                        <Col>
                          {ticket ? (
                            <>
                              <Container>
                                <Row>
                                  <Col xs={9}>
                                    <h2>
                                      {ticket.title}{" "}
                                      <Badge
                                        pill
                                        bg={priorityType}
                                        text={pTextColor}
                                      >
                                        {ticket.priority}
                                      </Badge>{" "}
                                      <Badge
                                        pill
                                        bg={badgeType}
                                        text={bTextColor}
                                      >
                                        {ticket.category}
                                      </Badge>
                                    </h2>
                                  </Col>
                                  <Col
                                    xs={5}
                                    sm={3}
                                    lg={2}
                                    className="text-primary"
                                    style={{
                                      textAlign: "right",
                                      display: "flex",
                                      flexDirection: "flex-start",
                                    }}
                                  >
                                    {currentUser.email === ticket.ownedBy ? (
                                      <>
                                        <Dropdown>
                                          <Dropdown.Toggle
                                            variant="primary"
                                            id="dropdown-basic"
                                          >
                                            Options
                                          </Dropdown.Toggle>

                                          <Dropdown.Menu>
                                            <Dropdown.Item href={editURL}>
                                              Edit Ticket
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={deleteTicket}
                                            >
                                              Delete Ticket
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Col>
                                </Row>

                                <p style={{ fontSize: 11 }}>
                                  {" "}
                                  Submitted by:{" "}
                                  <Link to="">{ticket.ownedByUsername}</Link> |
                                  Created:{" "}
                                  {ticket.createdAt.toDate().toLocaleString()} |
                                  Last Modified:{" "}
                                  {ticket.lastModifiedAt
                                    .toDate()
                                    .toLocaleString()}{" "}
                                  | Last Modified by:{" "}
                                  <Link to="">{ticket.ownedByUsername}</Link>
                                </p>
                                <Row>
                                  {ticket.desc ? (
                                    <>
                                      <div class="py-2">
                                        <h5>Description:</h5>
                                        <p>{ticket.desc}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {ticket.stepsToReproduce ? (
                                    <>
                                      <div class="py-2">
                                        <h5>Steps to Reproduce:</h5>
                                        <p>{ticket.stepsToReproduce}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {ticket.expectedResults ? (
                                    <>
                                      <div class="py-2">
                                        <h5>Expected Results:</h5>
                                        <p>{ticket.expectedResults}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {ticket.actualResults ? (
                                    <>
                                      <div class="py-2">
                                        <h5>Actual Results:</h5>
                                        <p>{ticket.actualResults}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  <div class="py-2">
                                    <h5>Source URL:</h5>
                                    <Link to={ticket.sourceURL}>
                                      {ticket.sourceURL}
                                    </Link>
                                  </div>
                                </Row>

                                <Row>
                                  <Col>
                                    <div class="py-2">
                                      <h5>Priority:</h5>
                                      <p>{ticket.priority}</p>
                                    </div>
                                  </Col>
                                  <Col>
                                    <div class="py-2">
                                      <h5>Category:</h5>
                                      <p>{ticket.category}</p>
                                    </div>
                                  </Col>
                                  <Col>
                                    <div class="py-2">
                                      <h5>Status:</h5>
                                      <p>{ticket.status}</p>
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <div class="py-2">
                                    <h5>Activity:</h5>
                                    {ticket.activity ? (
                                      <>
                                        <p>{ticket.activity}</p>{" "}
                                      </>
                                    ) : (
                                      <>No activity.</>
                                    )}
                                  </div>
                                </Row>
                                <Row>
                                  <div class="py-2">
                                    <h5>Comments:</h5>
                                    {ticket.comments ? (
                                      <>
                                        <p>{ticket.comments}</p>{" "}
                                      </>
                                    ) : (
                                      <>No comments.</>
                                    )}
                                  </div>

                                  <Form>
                                    <Form.Group id="title">
                                      <FloatingLabel
                                        controlId="floatingInput"
                                        label="Leave a comment"
                                        className="text-primary my-3"
                                      >
                                        <Form.Control
                                          as="textarea"
                                          style={{
                                            height: "175px",
                                            backgroundColor: "#020a40",
                                          }}
                                          placeholder="Leave a comment here"
                                          ref={commentRef}
                                          required
                                          className="text-light"
                                        />
                                      </FloatingLabel>
                                    </Form.Group>
                                  </Form>
                                </Row>
                              </Container>
                            </>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                    </Container>
                  </>
                ) : (
                  <></>
                )}
              </Container>
            </Container>
          </Container>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Ticket;
