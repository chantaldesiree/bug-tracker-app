import { Form, Button, Card, Alert, Dropdown } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

import { db, currentTimestamp } from ".././firebase";

import { Country, State, City } from "country-state-city";
import postalCodes from "postal-codes-js";

function AccountCreation() {
  const { currentUser } = useAuth();
  const usernameRef = useRef();
  const [username, setUsername] = useState();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneNumberRef = useRef();
  const streetAddressRef = useRef();
  const postalCodeRef = useRef();
  const [error, setError] = useState(``);
  const history = useHistory();

  const [countries] = useState(Country.getAllCountries());
  const [country, setCountry] = useState("Country");
  const [countryISO, setCountryISO] = useState();

  const [provinces, setProvinces] = useState();
  const [province, setProvince] = useState("Province/State");
  const [provinceISO, setProvinceISO] = useState();

  const [cities, setCities] = useState();
  const [city, setCity] = useState("City");

  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    setProvince("Province");
    setProvinces(State.getStatesOfCountry(countryISO));
  }, [country, countryISO]);

  useEffect(() => {
    setCity("City");
    setCities(City.getCitiesOfState(countryISO, provinceISO));
  }, [province, provinceISO, countryISO]);

  async function validUsername() {
    let uname = (
      firstNameRef.current.value +
      "-" +
      lastNameRef.current.value
    ).toLowerCase();
    console.log(uname);
    await db
      .collection("users")
      .where("username", ">=", uname)
      .where("username", "<=", uname + "\uf8ff")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          setUsername((uname + (querySnapshot.size + 1)).toLowerCase());
        } else {
          setUsername(uname);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  /*   function validPostalCode(postalCode) {
    postalCode = postalCode.toString().trim();

    var regexUS = new RegExp("^\\d{5}(-{0,1}\\d{4})?$");
    var regexCA = new RegExp(
      /([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i
    );

    if (countryISO === "US" && regexUS.test(postalCode.toString())) {
      return true;
    }

    if (
      countryISO === "CA" &&
      regexCA.test(postalCode.toString().replace(/\W+/g, ""))
    ) {
      return true;
    }
    return false;
  } */

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      validUsername();

      if (username < 6) {
        setError("Sorry, Your usename must be at least 6 characters long.");
      }

      if (username > 16) {
        setError(
          "Sorry, Your usename must be less than or equal to 16 characters."
        );
      }

      if (
        phoneNumberRef.current.value.length < 10 ||
        isNaN(phoneNumberRef.current.value)
      ) {
        setError("Please enter your 10 digit phone number.");
      }

      if (streetAddressRef.current.value.length < 6) {
        setError("Please enter a correct Street Address.");
      }

      if (countryISO === undefined) {
        setError("Please select a country.");
      }
      if (provinceISO === undefined) {
        setError("Please select a province or state.");
      }
      if (city === "City") {
        setError("Please select a city.");
      }

      console.log(error);
      if (error === "" && username !== undefined) {
        db.collection("users")
          .doc(currentUser.email)
          .set({
            username: username,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            streetAddress: streetAddressRef.current.value,
            city: city,
            province: province,
            country: country,
            postalCode: postalCode,
            phoneNumber: phoneNumberRef.current.value.replace(/-/g, ""),
            joinDate: currentTimestamp,
            role: "User",
          })
          .then(() => {
            history.push("/");
          });
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", backgroundColor: "#00043f" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h1 className="text-center mb-4" style={{ color: "#1266F1" }}>
            Bug Tracker App
          </h1>
          <Card style={{ backgroundColor: "#e8ecfd", padding: 10 }}>
            <Card.Body>
              <h2 className="text-center mb-4">Account Creation</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                {/* <Form.Group id="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="username" ref={usernameRef} required />
                </Form.Group> */}
                <Form.Group id="firstName">
                  <FloatingLabel
                    controlId="floatingFirstNameInput"
                    label="First Name"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="firstName"
                      ref={firstNameRef}
                      placeholder="firstName"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group id="lastName">
                  <FloatingLabel
                    controlId="floatingLastNameInput"
                    label="Last Name"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="lastName"
                      ref={lastNameRef}
                      placeholder="lastName"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group id="phoneNumber">
                  <FloatingLabel
                    controlId="floatingPhoneNumberInput"
                    label="Phone Number"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="tel"
                      ref={phoneNumberRef}
                      placeholder="phoneNumber"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group id="streetAddress">
                  <FloatingLabel
                    controlId="floatingStreetAddressInput"
                    label="Street Address"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="streetAddress"
                      ref={streetAddressRef}
                      placeholder="streetAddress"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group id="country">
                  <Dropdown
                    onSelect={(e) => {
                      setCountryISO(e);
                      setCountry(Country.getCountryByCode(e).name);
                    }}
                    style={{ marginBottom: "15px" }}
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="dropdown-basic-button"
                    >
                      {country}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        maxHeight: "500px",
                        overflowX: "hidden",
                      }}
                    >
                      {countries.map((c) => {
                        return (
                          <Dropdown.Item
                            href=""
                            style={{ padding: 10 }}
                            eventKey={c.isoCode}
                          >
                            {c.name}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group id="province">
                  <Dropdown
                    onSelect={(e) => {
                      setProvinceISO(e);
                      setProvince(
                        State.getStateByCodeAndCountry(e, countryISO).name
                      );
                    }}
                    style={{ marginBottom: "15px" }}
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="dropdown-basic-button"
                    >
                      {province}
                    </Dropdown.Toggle>

                    {provinces ? (
                      <Dropdown.Menu
                        style={{
                          maxHeight: "500px",
                          overflowX: "hidden",
                        }}
                      >
                        {provinces.map((p) => {
                          return (
                            <Dropdown.Item
                              href=""
                              style={{ padding: 10 }}
                              eventKey={p.isoCode}
                            >
                              {p.name}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    ) : (
                      <Dropdown.Menu
                        style={{
                          maxHeight: "500px",
                          overflowX: "hidden",
                          disabled: "true",
                          key: province,
                        }}
                      >
                        <Dropdown.Item href="" style={{ padding: 10 }}>
                          {province}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                </Form.Group>

                <Form.Group id="city">
                  <Dropdown
                    onSelect={(e) => {
                      setCity(e);
                    }}
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="dropdown-basic-button"
                    >
                      {city}
                    </Dropdown.Toggle>

                    {cities ? (
                      <Dropdown.Menu
                        style={{
                          maxHeight: "500px",
                          overflowX: "hidden",
                        }}
                      >
                        {cities.map((ci) => {
                          return (
                            <Dropdown.Item
                              href=""
                              style={{ padding: 10 }}
                              eventKey={ci.name}
                            >
                              {ci.name}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    ) : (
                      <Dropdown.Menu
                        style={{
                          maxHeight: "500px",
                          overflowX: "hidden",
                          disabled: "true",
                        }}
                      >
                        <Dropdown.Item href="" style={{ padding: 10 }}>
                          {city}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                </Form.Group>

                <Form.Group id="postalCode">
                  <FloatingLabel
                    controlId="floatingPostalCodeInput"
                    label="PostalCode"
                    className="text-primary my-3"
                  >
                    <Form.Control
                      type="postalCode"
                      ref={postalCodeRef}
                      placeholder="postalCode"
                      onChange={(e) => {
                        let valid = postalCodes.validate(
                          countryISO,
                          e.target.value
                        );
                        console.log(valid);
                        if (valid === true) {
                          setPostalCode(e.target.value);
                        }
                      }}
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Button
                  style={{ padding: "15px" }}
                  className="w-100"
                  type="submit"
                >
                  Create Account
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AccountCreation;
