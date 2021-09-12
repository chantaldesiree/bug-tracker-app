import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { db } from ".././firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function MyTickets() {
  const { currentUser } = useAuth();
  const [ticket, setTicket] = useState();
  const [tickets, setTickets] = useState([]);

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
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  useEffect(() => {
    if (tickets.length == 0) {
      getTickets();
    }
  }, []);

  return (
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
                  <Row className="py-2">
                    <h5>My Tickets:</h5>
                  </Row>
                  {tickets ? (
                    <>
                      {tickets.map((u) => {
                        let url = `/ticket/`;
                        return (
                          <>
                            <Row>
                              <Link to={url}>
                                <h6>
                                  {" "}
                                  [{u.status.toUpperCase()}] [Ticket{" "}
                                  {String(u.id).padStart(5, "0")}] {u.title} -
                                  Last Modified At:{" "}
                                  {u.lastModifiedAt.toDate().toLocaleString()}
                                </h6>
                              </Link>
                            </Row>
                          </>
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </Container>
          </Container>
        </Container>
      </Container>
      )
    </>
  );
}

export default MyTickets;
