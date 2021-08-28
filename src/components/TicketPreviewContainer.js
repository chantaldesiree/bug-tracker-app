import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PremadeProfile from "./PremadeProfiles";
import TicketPreview from "./TicketPreview";

function TicketPreviewContainer() {
  const tickets = [
    {
      id: 2,
      name: "Navigation Menu",
      desc: "The navigation menu doesn't show up properly on mobile.",
    },
    {
      id: 3,
      name: "Account Creation",
      desc: "Validation doesn't work properly for international phone numbers.",
    },
    {
      id: 4,
      name: "Profile Change",
      desc: "Profile changes are not saved to the users information.",
    },
    {
      id: 5,
      name: "Admin Access",
      desc: "Neither Admins or SuperAdmins are able to see more than a Support or User account.",
    },
  ];

  return (
    <Container
      className="d-flex flex-column-reverse"
      style={{
        paddingBottom: "5px",
        borderRadius: "5px",
      }}
    >
      {tickets.map((t) => {
        return <TicketPreview number={t.id} title={t.name} desc={t.desc} />;
      })}
    </Container>
  );
}

export default TicketPreviewContainer;
