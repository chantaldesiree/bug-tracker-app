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
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { currentTimestamp, db } from ".././firebase";
import firebase from "firebase";
import UploadButton from "./UploadButton";

import Nav from "./Nav";

function CreateTicket() {
  const { signout, currentUser } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [currentTicketCount, setCurrentTicketCount] = useState();
  const [error, setError] = useState();

  const [priorities, setPriorities] = useState([
    "Emergency",
    "High",
    "Medium",
    "Low",
  ]);
  const [priority, setPriority] = useState("Priority");

  const [categoryTitle, setCategoryTitle] = useState("Category");
  const [categories, setCategories] = useState([
    "Bug",
    "Account Issue",
    "Design",
    "Other",
  ]);
  const stepsRef = useRef();
  const titleRef = useRef();
  const descRef = useRef();
  const expectedRef = useRef();
  const actualRef = useRef();
  const sourceURLRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (categoryTitle === "Category") {
      setError("Please select a category.");
    }

    if (priority === "Priority") {
      setError("Please select a priority.");
    }

    try {
      console.log("Error: " + error);
      console.log("Category: " + categoryTitle);
      console.log("Priority: " + priority);

      if (error === "") {
        db.collection("tickets")
          .doc()
          .set({
            createdAt: currentTimestamp,
            lastModifiedAt: currentTimestamp,
            title: titleRef.current.value,
            desc: descRef.current.value,
            stepsToReproduce: stepsRef.current.value,
            submittedBy: currentUser.email,
            submittedByUsername: user.username,
            ownedBy: "Unassigned",
            ownedByUsername: user.username,
            activity: [],
            comments: [],
            priority: priority,
            category: categoryTitle,
            ticketID: currentTicketCount,
            sourceURL: sourceURLRef.current.value,
            expectedResults: expectedRef.current.value,
            actualResults: actualRef.current.value,
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
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  async function getCurrentTicketCount() {
    await db
      .collection("ticketCounter")
      .doc("currentCount")
      .get()
      .then((doc) => {
        if (doc.exists) {
          let d = doc.data();
          setCurrentTicketCount(d.count + 1);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  useEffect(() => {
    getUser();
    getCurrentTicketCount();
  }, []);

  return (
    <>
      {user ? (
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
                  <h5 style={{ color: "#e8ecfd" }}></h5>
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
                    <h2 className="text-center mb-4 text-light">
                      Create a Ticket
                    </h2>
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

                          <Dropdown
                            onSelect={(e) => {
                              setPriority(e);
                            }}
                            style={{ display: "inline", marginLeft: "15px" }}
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
                        </Form.Group>
                        <UploadButton>Upload a Screenshot</UploadButton>
                      </Col>
                      <Form.Group id="title">
                        <FloatingLabel
                          controlId="floatingTitleInput"
                          label="Title"
                          className="text-primary my-3"
                        >
                          <Form.Control
                            type="text"
                            ref={titleRef}
                            placeholder="title"
                            required
                            className="text-light"
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group id="title">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Description"
                          className="text-primary my-3"
                        >
                          <Form.Control
                            as="textarea"
                            style={{
                              height: "175px",
                              backgroundColor: "#020a40",
                            }}
                            placeholder="Leave a comment here"
                            ref={descRef}
                            required
                            className="text-light"
                          />
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group id="title">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Steps to Recreate"
                          className="text-primary my-3"
                        >
                          <Form.Control
                            as="textarea"
                            style={{
                              height: "125px",
                              backgroundColor: "#020a40",
                            }}
                            placeholder="Leave a comment here"
                            ref={stepsRef}
                            required
                            className="text-light"
                          />
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group id="title">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Expected Results"
                          className="text-primary my-3"
                        >
                          <Form.Control
                            placeholder="Leave a comment here"
                            className="text-light"
                            ref={expectedRef}
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group id="actualResults">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Actual Results"
                          className="text-primary my-3"
                        >
                          <Form.Control
                            placeholder="Leave a comment here"
                            className="text-light"
                            ref={actualRef}
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </FloatingLabel>
                      </Form.Group>
                      <hr style={{ color: "white" }} />
                      <Form.Group id="title">
                        <FloatingLabel
                          controlId="floatingSourceURLInput"
                          label="Source URL"
                          className="text-primary my-3"
                        >
                          <Form.Control
                            type="title"
                            ref={sourceURLRef}
                            required
                            className="text-light"
                            style={{ backgroundColor: "#020a40" }}
                            placeholder="SourceURL"
                            className="my-3 text-light"
                          />
                        </FloatingLabel>
                      </Form.Group>
                      <Button
                        style={{ padding: "15px" }}
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

export default CreateTicket;
