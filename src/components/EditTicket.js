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

  const [priorities, setPriorities] = useState([
    "Emergency",
    "High-Priority",
    "Low-Priority",
  ]);
  const [priority, setPriority] = useState("Urgency");

  const [categoryTitle, setCategoryTitle] = useState("Category");
  const [categories, setCategories] = useState([
    "Bug",
    "Account Issue",
    "Other",
  ]);
  const stepsRef = useRef();
  const titleRef = useRef();
  const descRef = useRef();
  const sourceURLRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (error === "") {
        db.collection("tickets")
          .doc(ticketDocID)
          .update({
            lastModifiedAt: currentTimestamp,
            title: titleRef.current.value,
            desc: descRef.current.value,
            stepsToReproduce: stepsRef.current.value,
            activity: [],
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
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  useEffect(() => {
    getUser();
    getCurrentTicket();
  }, []);

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
                      Editing Ticket{" "}
                      {String(currentTicket[0].ticketID).padStart(5, "0")}
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
                        >
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
                        >
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
                        >
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
                        >
                          <Form.Control
                            defaultValue={currentTicket[0].expectedResults}
                            className="text-light"
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </Form.Label>
                      </Form.Group>
                      <Form.Group id="actualResults">
                        <Form.Label
                          controlId="floatingInput"
                          label="Actual Results"
                          className="text-primary my-2 w-100"
                        >
                          <Form.Control
                            defaultValue={currentTicket[0].actualResults}
                            className="text-light"
                            style={{ backgroundColor: "#020a40" }}
                          />
                        </Form.Label>
                      </Form.Group>
                      <hr style={{ color: "white" }} />
                      <Form.Group id="title">
                        <Form.Label
                          controlId="floatingSourceURLInput"
                          label="Source URL"
                          className="text-primary my-1  w-100"
                        >
                          <Form.Control
                            type="title"
                            ref={sourceURLRef}
                            required
                            className="text-light"
                            style={{ backgroundColor: "#020a40" }}
                            defaultValue={currentTicket[0].sourceURL}
                            className="my-2 text-light"
                          />
                        </Form.Label>
                      </Form.Group>
                      <Button
                        style={{ padding: "15px", marginTop: "15px" }}
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
