import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from ".././firebase";

import Nav from "./Nav";
import TicketPreviewContainer from "./TicketPreviewContainer";
import TicketPreview from "./TicketPreview";

function Dashboard() {
  const { signout, currentUser } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [lastTicket, setLastTicket] = useState([]);

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

  async function getLastTicket() {
    await db
      .collection("tickets")
      .where("owner", "==", currentUser.email)
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let ticketData = doc.data();
          setLastTicket((lastTicket) => [...lastTicket, ticketData]);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  async function getUsers() {
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

  useEffect(() => {
    getUser();
    if (lastTicket.length === 0) getLastTicket();
  }, []);

  useEffect(() => {
    if (
      user &&
      users.length == 0 &&
      (user.role === "SuperAdmin" || user.role === "Admin")
    ) {
      getUsers();
    }
  }, [user]);

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
            <Container
              style={{
                marginTop: "25px",
              }}
            >
              <Row lg={4} sm={1}>
                <Col
                  xs={12}
                  lg={4}
                  className="d-flex flex-column justify-content-around align-items-center px-0"
                  style={{
                    minHeight: "300px",
                    color: "white",
                    paddingRight: "10px",
                    marginBottom: "25px",
                  }}
                >
                  <div>
                    <h2>Welcome back,</h2>
                    <h2>
                      {user.firstName}
                      {"."}
                    </h2>
                  </div>
                </Col>
                <Col className="px-1 text-light" xs={12} lg={8}>
                  <Container
                    className="d-flex bg-primary justify-content-center align-items-center px-0"
                    fluid
                    style={{
                      borderRadius: "5px",
                      paddingTop: "8px",
                      paddingBottom: "6px",
                    }}
                  >
                    <h5>Since you've been away:</h5>
                  </Container>
                  <TicketPreviewContainer />
                </Col>
              </Row>
              <Row>
                <Container
                  className="d-flex justify-content-center align-items-center bg-light mt-3"
                  style={{
                    borderRadius: "5px",
                    paddingTop: "9px",
                    paddingBottom: "6px",
                  }}
                >
                  <h5 style={{ color: "#000550" }}>Where you left off:</h5>
                </Container>
                <Container className="px-4">
                  {lastTicket.length > 0 ? (
                    <TicketPreview
                      number={lastTicket[0].id}
                      title={lastTicket[0].title}
                      desc={lastTicket[0].desc}
                      createdAt={lastTicket[0].createdAt
                        .toDate()
                        .toLocaleString()}
                      lastModifiedAt={lastTicket[0].lastModifiedAt
                        .toDate()
                        .toLocaleString()}
                      createdBy={lastTicket[0].ownerUsername}
                    />
                  ) : (
                    <>{console.log(lastTicket)}</>
                  )}
                </Container>
              </Row>
            </Container>
          </Container>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}

export default Dashboard;
