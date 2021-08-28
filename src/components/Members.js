import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { db } from ".././firebase";
import { Link } from "react-router-dom";

function Members() {
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);

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
    if (users.length == 0) {
      getUsers();
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
                <h5 style={{ color: "#e8ecfd" }}>Members List:</h5>
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
                    <h5>Username:</h5>
                  </Row>
                  {users ? (
                    <>
                      {users.map((u) => {
                        let url = `/members/${u.username}`;
                        return (
                          <>
                            <Row>
                              <Link to={url}>
                                <h6>{u.username}</h6>
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

export default Members;
