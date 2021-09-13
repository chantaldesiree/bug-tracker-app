import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PremadeProfile from "./PremadeProfiles";
import TicketPreview from "./TicketPreview";
import { db } from ".././firebase";

function TicketPreviewContainer(props) {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    if (tickets) setTickets(props.tickets);
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
              key={t.id}
              number={t.id}
              title={t.title}
              desc={t.desc}
              createdAt={t.createdAt.toDate().toLocaleString()}
              lastModifiedAt={t.lastModifiedAt.toDate().toLocaleString()}
              ownedBy={t.ownedBy}
              ownedByUsername={t.ownedByUsername}
              category={t.category}
              status={t.status}
              priority={t.priority}
            />
          );
        })}
    </Container>
  );
}

export default TicketPreviewContainer;
