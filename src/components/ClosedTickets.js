import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { db } from ".././firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TicketPreviewContainer from "./TicketPreviewContainer";

function ClosedTickets() {
  const { currentUser } = useAuth();
  const [ticket, setTicket] = useState();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getTickets() {
    await db
      .collection("tickets")
      .where("status", "==", "Closed")
      .orderBy("lastModifiedAt", "desc")
      .orderBy("id", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let ticketData = doc.data();
          setTickets((tickets) => [...tickets, ticketData]);
        });
      })
      .then(() => {
        setLoading(false);
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
                <Row>
                  <Container
                    className="d-flex justify-content-center align-items-center bg-primary mt-3"
                    style={{
                      borderRadius: "5px",
                      paddingTop: "9px",
                      paddingBottom: "6px",
                    }}
                  >
                    <h5 style={{ color: "#e8ecfd" }}>Closed Tickets:</h5>
                  </Container>
                </Row>

                <Row style={{ color: "#e8ecfd" }}>
                  <Col>
                    {tickets ? (
                      <>
                        <TicketPreviewContainer tickets={tickets} />
                      </>
                    ) : (
                      <></>
                    )}
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

export default ClosedTickets;
