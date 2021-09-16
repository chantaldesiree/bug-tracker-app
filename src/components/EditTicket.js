import {
  Alert,
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { currentTimestamp, db } from ".././firebase";
import firebase from "firebase";
import UploadButton from "./UploadButton";
import { useParams } from "react-router-dom";

import Nav from "./Nav";

function EditTicket(props) {
  const { signout, currentUser } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [ticketDocID, setTicketDocID] = useState();
  const [currentTicket, setCurrentTicket] = useState([]);
  const [error, setError] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  const [priorities, setPriorities] = useState([
    "Emergency",
    "High-Priority",
    "Low-Priority",
  ]);
  const [priority, setPriority] = useState();
  const [categoryTitle, setCategoryTitle] = useState();

  const [categories, setCategories] = useState([
    "Bug",
    "Account Issue",
    "Other",
  ]);
  const stepsRef = useRef();
  const titleRef = useRef();
  const actualRef = useRef();
  const expectedRef = useRef();
  const descRef = useRef();
  const sourceURLRef = useRef();

  async function handleSubmit(e) {
    setActivity(currentTicket[0].activity);
    e.preventDefault();
    setError("");

    let activityArray = [];

    if (currentTicket[0].priority !== priority) {
      activityArray.push(
        user.username + " changed the priority to " + priority
      );
    }

    if (currentTicket[0].category !== categoryTitle) {
      activityArray.push(
        user.username + " changed the category to " + categoryTitle
      );
    }

    if (currentTicket[0].title !== titleRef.current.value) {
      activityArray.push(
        user.username + " changed the title to " + titleRef.current.value
      );
    }

    if (currentTicket[0].desc !== descRef.current.value) {
      activityArray.push(
        user.username + " changed the description to: " + descRef.current.value
      );
    }

    if (currentTicket[0].stepsToReproduce !== stepsRef.current.value) {
      activityArray.push(
        user.username +
          " changed the steps to reproduce to: " +
          stepsRef.current.value
      );
    }

    if (currentTicket[0].expectedResults !== expectedRef.current.value) {
      activityArray.push(
        user.username +
          " changed the expected results to: " +
          expectedRef.current.value
      );
    }

    if (currentTicket[0].actualResults !== actualRef.current.value) {
      activityArray.push(
        user.username +
          " changed the actual results to: " +
          actualRef.current.value
      );
    }

    let newActivity = {
      activityDate: currentTimestamp,
      activityData: activityArray,
    };
    if (activityArray.length > 0) {
      setActivity((activity) => [...activity, newActivity]);
    }
  }

  useEffect(() => {
    try {
      if (error === "") {
        db.collection("tickets")
          .doc(ticketDocID)
          .update({
            lastModifiedAt: currentTimestamp,
            title: titleRef.current.value,
            desc: descRef.current.value,
            stepsToReproduce: stepsRef.current.value,
            actualResults: actualRef.current.value,
            expectedResults: expectedRef.current.value,
            activity: activity,
            comments: [],
            priority: priority,
            category: categoryTitle,
            sourceURL: sourceURLRef.current.value,
            status: "Open",
          })
          .then(() => {
            db.collection("ticketCounter")
              .doc("currentCount")
              .update({
                count: firebase.firestore.FieldValue.increment(1),
              });
            history.push("/");
          });
      }
    } catch (error) {
      setError(error.message);
    }
  }, [activity]);

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
          console.log("user");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  async function getCurrentTicket() {
    await db
      .collection("tickets")
      .where("ticketID", "==", parseInt(props.match.params.id))
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let ticketData = doc.data();
          setTicketDocID(doc.id);
          setCurrentTicket((currentTicket) => [...currentTicket, ticketData]);
        });
      })
      .then(() => {})
      .finally(() => {})
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  async function setData() {
    setCategoryTitle(currentTicket[0].category);
    setPriority(currentTicket[0].priority);
    setLoading(false);
  }

  useEffect(() => {
    getUser();
    getCurrentTicket();
  }, []);

  useEffect(() => {
    if (currentTicket[0] !== undefined) {
      setData();
    }
  }, [currentTicket]);

  return (
    <>
      {!loading ? (
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
                  <h5 style={{ color: "#e8ecfd" }}>
                    Editing Ticket{" "}
                    {String(currentTicket[0].ticketID).padStart(5, "0")}
                  </h5>
                </Container>
              </Row>
              <Container
                className="mx-0"
                style={{
                  backgroundColor: "#020a40",
                  padding: "50px",
                  borderRadius: "5px",
                  color: "#020a40",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Row>
                  <Col className="d-flex flex-column px-0 justify-content-center">
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                      <Col
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          maxHeight: "56px",
                        }}
                        className="mt-4"
                      >
                        <Form.Group
                          id="dropdowns"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            minWidth: "230px",
                          }}
                        >
                          <Dropdown
                            onSelect={(e) => {
                              setPriority(e);
                            }}
                            style={{ display: "inline" }}
                          >
                            <Dropdown.Toggle
                              variant="primary"
                              id="dropdown-basic-button"
                              style={{ padding: "15px" }}
                            >
                              {priority}
                            </Dropdown.Toggle>

                            {priority ? (
                              <Dropdown.Menu
                                style={{
                                  maxHeight: "500px",
                                  overflowX: "hidden",
                                }}
                              >
                                {priorities.map((ci) => {
                                  return (
                                    <Dropdown.Item
                                      href=""
                                      style={{ padding: 10 }}
                                      eventKey={ci}
                                    >
                                      {ci}
                                    </Dropdown.Item>
                                  );
                                })}
                              </Dropdown.Menu>
                            ) : (
                              <Dropdown.Menu
                                style={{
                                  maxHeight: "500px",
                                  overflowX: "hidden",
                                  disabled: "true",
                                }}
                              >
                                <Dropdown.Item href="" style={{ padding: 10 }}>
                                  {priority}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            )}
                          </Dropdown>
                          <Dropdown
                            onSelect={(e) => {
                              setCategoryTitle(e);
                            }}
                            style={{
                              display: "inline",
                            }}
                          >
                            <Dropdown.Toggle
                              variant="primary"
                              id="dropdown-basic-button"
                              style={{
                                padding: "15px",
                              }}
                            >
                              {categoryTitle}
                            </Dropdown.Toggle>

                            {categories ? (
                              <Dropdown.Menu
                                style={{
                                  maxHeight: "500px",
                                  overflowX: "hidden",
                                }}
                              >
                                {categories.map((ci) => {
                                  return (
                                    <Dropdown.Item
                                      href=""
                                      style={{ padding: 10 }}
                                      eventKey={ci}
                                    >
                                      {ci}
                                    </Dropdown.Item>
                                  );
                                })}
                              </Dropdown.Menu>
                            ) : (
                              <Dropdown.Menu
                                style={{
                                  maxHeight: "500px",
                                  overflowX: "hidden",
                                  disabled: "true",
                                }}
                              >
                                <Dropdown.Item href="" style={{ padding: 10 }}>
                                  {categories}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            )}
                          </Dropdown>
                        </Form.Group>
                        <UploadButton>Upload a Screenshot</UploadButton>
                      </Col>
                      <Form.Group id="title">
                        <Form.Label
                          controlId="floatingTitleInput"
                          label="Title"
                          className="text-primary my-2 w-100"
                          style={{ fontSize: ".8em" }}
                        >
                          Title
                          <Form.Control
                            type="text"
                            ref={titleRef}
                            defaultValue={currentTicket[0].title}
                            required
                            className="text-light"
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </Form.Label>
                      </Form.Group>
                      <Form.Group id="title">
                        <Form.Label
                          controlId="floatingInput"
                          label="Description"
                          className="text-primary my-2 w-100"
                          style={{ fontSize: ".8em" }}
                        >
                          Description
                          <Form.Control
                            as="textarea"
                            style={{
                              height: "175px",
                              backgroundColor: "#020a40",
                            }}
                            defaultValue={currentTicket[0].desc}
                            ref={descRef}
                            required
                            className="text-light"
                          />
                        </Form.Label>
                      </Form.Group>
                      <Form.Group id="title">
                        <Form.Label
                          controlId="floatingInput"
                          label="Steps to Recreate"
                          className="text-primary my-2 w-100"
                          style={{ fontSize: ".8em" }}
                        >
                          Steps to Reproduce
                          <Form.Control
                            as="textarea"
                            style={{
                              height: "125px",
                              backgroundColor: "#020a40",
                            }}
                            defaultValue={currentTicket[0].stepsToReproduce}
                            ref={stepsRef}
                            required
                            className="text-light"
                          />
                        </Form.Label>
                      </Form.Group>
                      <Form.Group id="title">
                        <Form.Label
                          controlId="floatingInput"
                          label="Expected Results"
                          className="text-primary my-2 w-100"
                          style={{ fontSize: ".8em" }}
                        >
                          Expected Results
                          <Form.Control
                            defaultValue={currentTicket[0].expectedResults}
                            className="text-light"
                            ref={expectedRef}
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </Form.Label>
                      </Form.Group>
                      <Form.Group id="actualResults">
                        <Form.Label
                          controlId="floatingInput"
                          label="Actual Results"
                          className="text-primary my-2 w-100"
                          style={{ fontSize: ".8em" }}
                        >
                          Actual Results
                          <Form.Control
                            defaultValue={currentTicket[0].actualResults}
                            className="text-light"
                            ref={actualRef}
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </Form.Label>
                      </Form.Group>
                      <hr style={{ color: "white" }} />
                      <Form.Group id="title">
                        <Form.Label
                          controlId="floatingSourceURLInput"
                          label="Source URL"
                          className="text-primary my-1 w-100"
                          style={{ fontSize: ".8em" }}
                        >
                          Source URL
                          <Form.Control
                            type="title"
                            ref={sourceURLRef}
                            required
                            className="text-light"
                            style={{ backgroundColor: "#020a40" }}
                            defaultValue={currentTicket[0].sourceURL}
                            className="text-light"
                          />
                        </Form.Label>
                      </Form.Group>
                      <Button
                        style={{ padding: "15px", marginTop: "25px" }}
                        className="w-100"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </Container>
          </Container>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}

export default EditTicket;
