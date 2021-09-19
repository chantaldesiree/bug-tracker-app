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
import { db, currentTimestamp } from ".././firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

function Ticket(props) {
  const { currentUser } = useAuth();
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState();
  const [activity, setActivity] = useState([]);
  const [comments, setComments] = useState([]);
  const history = useHistory();

  const [badgeType, setBadgeType] = useState();
  const [priorityType, setPriorityType] = useState();
  const [bTextColor, setBTextColor] = useState();
  const [pTextColor, setPTextColor] = useState();

  const commentRef = useRef();

  const [editURL, setEditURL] = useState();
  const [status, setStatus] = useState();
  const [prevStatus, setPrevStatus] = useState();
  const [assignee, setAssignee] = useState();

  async function getUsers() {
    if (users.length === 0) {
      await db
        .collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let userData = doc.data();
            userData.id = doc.id;
            setUsers((users) => [...users, userData]);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }

  async function getTicket() {
    await db
      .collection("tickets")
      .where("ticketID", "==", parseInt(props.match.params.id))
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let ticketData = doc.data();
          ticketData.id = doc.id;

          setTicket(ticketData);
        });
      })
      .then(() => {
        setEditURL("/ticket/edit/" + props.match.params.id);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  function setBadges() {
    if (ticket) {
      console.log(ticket.category);
      switch (ticket.category) {
        case "Bug":
          setBadgeType("primary");
          setBTextColor("light");
          break;
        case "Account Issue":
          setBadgeType("dark");
          setBTextColor("light");
          break;
        case "Design":
          setBadgeType("light");
          setBTextColor("dark");
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

      setActivity(ticket.activity);
      setComments(ticket.comments);
      setStatus(ticket.status);
      setPrevStatus(ticket.status);
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

  function assignTicket(e) {
    setAssignee(users.find(({ username }) => username === e.target.innerText));
  }

  function assignCommentToDB() {
    if (ticket && comments) {
      try {
        if (error === "") {
          db.collection("tickets")
            .doc(ticket.id)
            .update({
              comments: comments,
            })
            .then(() => {
              history.push("/");
            });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  async function assignStatus(e) {
    if (ticket && ticket.status !== e) {
      try {
        if (e === "Open" || e === "Closed") {
          db.collection("tickets")
            .doc(ticket.id)
            .update({
              status: e,
            })
            .then(() => {
              setStatus(e);
            });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  async function getUser() {
    await db
      .collection("users")
      .doc(currentUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUser(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .then(() => {})
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  function handleComment(e) {
    e.preventDefault();
    setError("");

    let newComment = {
      commentDate: currentTimestamp,
      commentData: { array: commentRef.current.value.split("\n") },
      commentUser: currentUser.email,
      commentUsername: user.username,
    };

    setComments((comments) => [...comments, newComment]);
  }

  useEffect(() => {
    getTicket();
    getUser();
  }, []);

  useEffect(() => {
    if ((user && user.role == "Admin") || (user && user.role == "SuperAdmin")) {
      getUsers();
    }
  }, [user]);

  useEffect(() => {
    setBadges();
  }, [ticket]);

  useEffect(() => {
    if (user && status !== prevStatus) {
      let statusMessage = "Ticket status set to " + status;

      let newActivity = {
        activityDate: currentTimestamp,
        activityData: [statusMessage],
      };

      setActivity((activity) => [...activity, newActivity]);
    }
  }, [status]);

  useEffect(() => {
    if (assignee) {
      let assignMessage =
        user.username + " assigned ticket to " + assignee.username;

      let newActivity = {
        activityDate: currentTimestamp,
        activityData: [assignMessage],
      };

      if (ticket && user && user.role !== "User" && assignee && activity) {
        db.collection("tickets").doc(ticket.id).update({
          ownedBy: assignee.id,
          ownedByUsername: assignee.username,
        });

        setActivity((activity) => [...activity, newActivity]);
      }
    }
  }, [assignee]);

  useEffect(() => {
    if (ticket && user && user.role !== "User") {
      db.collection("tickets")
        .doc(ticket.id)
        .update({
          activity: activity,
        })
        .then(() => {
          history.push("/");
        });
    }
  }, [activity]);

  useEffect(() => {
    assignCommentToDB();
  }, [comments]);

  return (
    <>
      {!loading && user && users && comments ? (
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
                                <Row className="d-flex justify-content-between">
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
                                </Row>

                                <p style={{ fontSize: 11 }}>
                                  {" "}
                                  Submitted by:{" "}
                                  <Link to="">
                                    {ticket.submittedByUsername}
                                  </Link>{" "}
                                  | Created:{" "}
                                  {ticket.createdAt.toDate().toLocaleString()} |
                                  Last Modified:{" "}
                                  {ticket.lastModifiedAt
                                    .toDate()
                                    .toLocaleString()}{" "}
                                  | Last Modified by:{" "}
                                  <Link to="">{ticket.ownedByUsername}</Link>
                                </p>
                                <Row>
                                  <Col lg={9}>
                                    <Row>
                                      {ticket.desc ? (
                                        <>
                                          <div className="py-2">
                                            <h5>Description:</h5>
                                            <p>{ticket.desc}</p>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}

                                      {ticket.stepsToReproduce ? (
                                        <>
                                          <div className="py-2">
                                            <h5>Steps to Reproduce:</h5>
                                            <p>{ticket.stepsToReproduce}</p>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}

                                      {ticket.expectedResults ? (
                                        <>
                                          <div className="py-2">
                                            <h5>Expected Results:</h5>
                                            <p>{ticket.expectedResults}</p>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {ticket.actualResults ? (
                                        <>
                                          <div className="py-2">
                                            <h5>Actual Results:</h5>
                                            <p>{ticket.actualResults}</p>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      <div className="py-2">
                                        <h5>Source URL:</h5>
                                        <Link to={ticket.sourceURL}>
                                          {ticket.sourceURL}
                                        </Link>
                                      </div>
                                    </Row>
                                    <Row>
                                      <div className="py-2">
                                        <h5>Activity:</h5>
                                        {ticket.activity.length > 0 ? (
                                          ticket.activity
                                            .slice(0)
                                            .reverse()
                                            .map((t) => {
                                              return (
                                                <>
                                                  <p key={t.activityDate}>
                                                    {t.activityDate
                                                      .toDate()
                                                      .toLocaleString()}
                                                  </p>{" "}
                                                  <Container
                                                    style={{
                                                      fontSize: ".85em",
                                                    }}
                                                  >
                                                    {t.activityData.map(
                                                      (data) => {
                                                        return (
                                                          <p key={data}>
                                                            {data}
                                                          </p>
                                                        );
                                                      }
                                                    )}
                                                  </Container>
                                                </>
                                              );
                                            })
                                        ) : (
                                          <>No activity.</>
                                        )}
                                      </div>
                                    </Row>
                                    <Row>
                                      <div className="py-2">
                                        <h5>Comments:</h5>
                                        {ticket.comments.length > 0 ? (
                                          ticket.comments
                                            .slice(0)
                                            .reverse()
                                            .map((t) => {
                                              return (
                                                <>
                                                  <p key={t.commentDate}>
                                                    {t.commentDate
                                                      .toDate()
                                                      .toLocaleString()}
                                                  </p>
                                                  <Container
                                                    style={{
                                                      fontSize: ".85em",
                                                    }}
                                                  >
                                                    {Object.values(
                                                      t.commentData
                                                    ).map((data) => {
                                                      return (
                                                        <>
                                                          {data.map((d) => {
                                                            return (
                                                              <div>{d}</div>
                                                            );
                                                          })}
                                                        </>
                                                      );
                                                    })}
                                                  </Container>
                                                </>
                                              );
                                            })
                                        ) : (
                                          <>No comments.</>
                                        )}
                                      </div>

                                      <Form onSubmit={handleComment}>
                                        <Form.Group id="comment">
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
                                        <Button
                                          style={{ padding: "15px" }}
                                          className="w-100"
                                          type="submit"
                                        >
                                          Comment
                                        </Button>
                                      </Form>
                                    </Row>
                                  </Col>
                                  <Col lg={3}>
                                    <Row>
                                      <div className="py-2">
                                        <h5>Priority:</h5>
                                        <p>{ticket.priority}</p>
                                      </div>

                                      <div className="py-2">
                                        <h5>Category:</h5>
                                        <p>{ticket.category}</p>
                                      </div>

                                      <div className="py-2">
                                        <h5>Status:</h5>
                                        {user.role === "Admin" ||
                                        user.role === "SuperAdmin" ? (
                                          <>
                                            <Dropdown>
                                              <Dropdown.Toggle
                                                variant="primary"
                                                id="dropdown"
                                              >
                                                {status}
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={(e) => {
                                                    assignStatus(
                                                      e.target.innerText
                                                    );
                                                  }}
                                                >
                                                  Open
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={(e) => {
                                                    assignStatus(
                                                      e.target.innerText
                                                    );
                                                  }}
                                                >
                                                  Closed
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </>
                                        ) : (
                                          <>{status}</>
                                        )}
                                      </div>
                                      <div className="py-2">
                                        <h5>Owner:</h5>
                                        <p>{ticket.ownedBy}</p>
                                      </div>
                                    </Row>
                                    {user.role !== "User" ? (
                                      <>
                                        <Row>
                                          <div className="py-2">
                                            {user.role === "Support" ? (
                                              <>
                                                <Dropdown>
                                                  <Dropdown.Toggle
                                                    variant="primary"
                                                    id="dropdown-basic"
                                                  >
                                                    Assign Ticket
                                                  </Dropdown.Toggle>

                                                  <Dropdown.Menu>
                                                    <Dropdown.Item
                                                      onSelect={assignTicket}
                                                    >
                                                      {user.username}
                                                    </Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </>
                                            ) : (
                                              <>
                                                {users ? (
                                                  <>
                                                    <Dropdown>
                                                      <Dropdown.Toggle
                                                        variant="primary"
                                                        id="dropdown-basic"
                                                      >
                                                        Assign Ticket
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu>
                                                        {users.map((u) => {
                                                          if (
                                                            u.role !== "User"
                                                          ) {
                                                            return (
                                                              <Dropdown.Item
                                                                onClick={
                                                                  assignTicket
                                                                }
                                                              >
                                                                {u.username}
                                                              </Dropdown.Item>
                                                            );
                                                          }
                                                        })}
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </Row>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    <Row>
                                      {user.username ===
                                        ticket.ownedByUsername ||
                                      user.role == "Admin" ||
                                      user.role == "SuperAdmin" ? (
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
                                    </Row>
                                  </Col>
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
