import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PremadeProfile from "./PremadeProfiles";
import TicketPreview from "./TicketPreview";
import { db } from ".././firebase";

function TicketPreviewContainer() {
  const [tickets, setTickets] = useState([]);

  async function getTickets() {
    await db
      .collection("tickets")
      .orderBy("id", "desc")
      .limit(5)
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
    if (tickets.length === 0) getTickets();
  }, []);

  return (
    <Container
      className="d-flex flex-column"
      style={{
        paddingBottom: "5px",
        borderRadius: "5px",
      }}
    >
      {tickets &&
        tickets.map((t) => {
          return (
            <TicketPreview
              number={t.id}
              title={t.title}
              desc={t.desc}
              createdAt={t.createdAt.toDate().toLocaleString()}
              lastModifiedAt={t.lastModifiedAt.toDate().toLocaleString()}
              ownedByUsername={t.ownedByUsername}
              category={t.category}
              status={t.status}
            />
          );
        })}
    </Container>
  );
}

export default TicketPreviewContainer;
