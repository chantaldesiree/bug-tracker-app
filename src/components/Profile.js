import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from ".././firebase";

import Nav from "./Nav";
import TicketPreviewContainer from "./TicketPreviewContainer";
import TicketPreview from "./TicketPreview";

function Profile() {
  const { signout, currentUser } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);

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
                  <h5 style={{ color: "#e8ecfd" }}>Your Profile:</h5>
                </Container>
              </Row>
              <Container
                className="mx-0"
                style={{
                  backgroundColor: "#020a40",
                  padding: "50px",
                  borderRadius: "5px",
                  color: "#d3d9ff",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Row>
                  <Col
                    xs={12}
                    lg={4}
                    className="d-flex flex-column px-0 justify-content-center align-items-end"
                    style={{
                      color: "white",
                      paddingRight: "10px",
                      marginBottom: "25px",
                    }}
                  >
                    <div>
                      <h1 className="text-primary">
                        {user.firstName} {user.lastName}
                      </h1>
                    </div>
                  </Col>
                  <Col lg={4}></Col>
                  <Col
                    lg={4}
                    className="d-flex flex-column px-0"
                    style={{ color: "white" }}
                  >
                    <div>
                      <h5>{user.streetAddress}</h5>
                      <h5>
                        {user.city}, {user.province}
                      </h5>
                      <h5>
                        {user.postalCode} {user.country}
                      </h5>
                      <hr />
                      <h5>{formatPhoneNumber(user.phoneNumber)}</h5>
                      <h5>{currentUser.email}</h5>
                    </div>
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

export default Profile;
