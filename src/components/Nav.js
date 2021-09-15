import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from ".././firebase";

function DashboardNav() {
  const buttons = ["Reports", "Members"];
  const tickets = ["My Tickets", "Open Tickets", "Closed Tickets"];
  const [user, setUser] = useState();

  const { signout, currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    getUser();
  }, []);

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

  async function handleSignOut(e) {
    e.preventDefault();

    try {
      await signout();
      history.push("/sign-up");
    } catch {}
  }

  return (
    <Navbar
      sticky="top"
      collapseOnSelect
      expand="lg"
      variant="dark"
      style={{ backgroundColor: "#000550" }}
    >
      <Container>
        <Navbar.Brand href="/">Bug Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Button
          className="mx-1 bg-primary"
          onClick={() => {
            history.push("/create-a-ticket");
          }}
        >
          New Ticket
        </Button>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="/">Dashboard</Nav.Link>
            <NavDropdown title="Tickets" id="basic-nav-dropdown">
              <ul style={{ paddingLeft: 0, marginBottom: 0 }}>
                {tickets.map((t) => {
                  return (
                    <div
                      className="py-2"
                      style={{ color: "#e8ecfd", fontSize: "1em" }}
                      key={t}
                    >
                      <NavDropdown.Item
                        href={t.toLowerCase().replace(/\s/g, "-")}
                      >
                        {t}
                      </NavDropdown.Item>
                    </div>
                  );
                })}
              </ul>
            </NavDropdown>
            {buttons.map((b) => {
              return (
                <div style={{ color: "#e8ecfd", fontSize: "1em" }} key={b}>
                  <Nav.Link href={b.toLowerCase()}>{b}</Nav.Link>
                </div>
              );
            })}
            {user ? (
              <Nav.Link href="profile">
                <strong>[ {user.username} ]</strong>
              </Nav.Link>
            ) : (
              <></>
            )}
            <Button
              style={{ backgroundColor: "#e8ecfd" }}
              className="mx-1"
              variant="light"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DashboardNav;
