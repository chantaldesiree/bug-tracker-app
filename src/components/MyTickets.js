import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { db } from ".././firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TicketPreviewContainer from "./TicketPreviewContainer";

function MyTickets() {
  const { currentUser } = useAuth();
  const [ticket, setTicket] = useState();
  const [user, setUser] = useState();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getTickets() {
    await db
      .collection("tickets")
      .where("ownedBy", "==", currentUser.email)
      .orderBy("lastModifiedAt", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let ticketData = doc.data();
          setTickets((tickets) => [...tickets, ticketData]);
        });
      })
      .then(() => {
        getUser();
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
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
    getTickets();
  }, []);

  return (
    <>
      {!loading && user ? (
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
                <Row>
                  <Container
                    className="d-flex justify-content-center align-items-center bg-primary mt-3"
                    style={{
                      borderRadius: "5px",
                      paddingTop: "9px",
                      paddingBottom: "6px",
                    }}
                  >
                    <h5 style={{ color: "#e8ecfd" }}>My Tickets:</h5>
                  </Container>
                </Row>

                <Row style={{ color: "#e8ecfd" }}>
                  <Col>
                    <TicketPreviewContainer tickets={tickets} user={user} />
                  </Col>
                </Row>
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

export default MyTickets;
