import { Form, Button, Card, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from ".././firebase";

function Dashboard() {
  const buttons = ["Home", "Issues", "Reports", "Members"];
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

  async function handleSignOut(e) {
    e.preventDefault();

    try {
      await signout();
      history.push("/SignUp");
    } catch {}
  }

  return (
    <>
      <div
        className="d-flex"
        style={{
          backgroundColor: "#000550",
          minHeight: "100vh",
        }}
      >
        <div
          className="flex-column"
          style={{
            background: "linear-gradient(#0029e0, #00043f)",
            color: "text-primary",
            fontWeight: "bold",
            minWidth: "200px",
            minHeight: "100vh",
          }}
        >
          <div
            className="p-3"
            style={{
              backgroundColor: "#e8ecfd",
              color: "#0029e0",
              fontSize: "1.75em",
            }}
          >
            Bug Tracker
          </div>

          {buttons.map((b) => {
            return (
              <div
                className="mx-3 my-4"
                style={{ color: "#e8ecfd", fontSize: "1.25em" }}
                key={b}
              >
                {b}
              </div>
            );
          })}
          <Button className="mx-3 mt-2" variant="light">
            + Add Issue
          </Button>
          <Button
            className="mx-3 mt-2 sticky-bottom"
            variant="light"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
        <Container className="flex-row text-primary m-5 p-3">
          {user ? (
            <div>
              <h1 style={{ color: "#e8ecfd" }}>
                {user.firstName} {user.lastName}
              </h1>
              <h3 style={{ opacity: 0.95 }}>Username: {user.username}</h3>
              <h5 className="pt-1 pb-1" style={{ opacity: 0.75 }}>
                Role: {user.role}
              </h5>
              <div style={{ opacity: 0.7 }}>
                <div>City: {user.city}</div>
                <div>Province: {user.province}</div>
                <div>Country: {user.country}</div>
                <div>Phone Number: {user.phoneNumber}</div>
              </div>
              {users.length > 0 ? (
                <>
                  <div className="pt-5">
                    <h3 style={{ color: "#e8ecfd" }}>All Users:</h3>

                    {users.map((u) => {
                      {
                        return (
                          <div key={u.id} className="pt-2 pb-2">
                            <h4 style={{ opacity: 0.9 }}>{u.username}</h4>
                            <div>Email: {u.id}</div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </Container>
      </div>
    </>
  );
}

export default Dashboard;
