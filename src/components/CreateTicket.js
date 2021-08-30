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
import { db } from ".././firebase";
import UploadButton from "./UploadButton";

import Nav from "./Nav";

function CreateTicket() {
  const { signout, currentUser } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();

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
  const titleRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      console.log(error);
      if (error === "") {
        db.collection("tickets")
          .doc()
          .set({
            role: "User",
          })
          .then(() => {
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

  useEffect(() => {
    getUser();
  }, []);

  function formatPhoneNumber(str) {
    //Filter only numbers from the input
    let cleaned = ("" + str).replace(/\D/g, "");

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }

    return null;
  }

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
                            ref={titleRef}
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
                            ref={titleRef}
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
                            ref={titleRef}
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