import { Form, Button, Card, Alert, Dropdown } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

import { db, currentTimestamp } from ".././firebase";

import { Country, State, City } from "country-state-city";
import postalCodes from "postal-codes-js";

function AccountCreation() {
  const { currentUser } = useAuth();
  const usernameRef = useRef();
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
  }, [country]);

  useEffect(() => {
    setCity("City");
    setCities(City.getCitiesOfState(countryISO, provinceISO));
  }, [province]);

  async function validUsername() {
    let valid = true;

    await db
      .collection("users")
      .doc(usernameRef.current.value)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          valid = false;
        }
      });
    return valid;
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
      var valid = await validUsername();

      if (!valid) {
        setError("Sorry, that username is already taken.");
      }

      if (usernameRef.current.value.length < 6) {
        setError("Sorry, Your usename must be at least 6 characters long.");
      }

      if (usernameRef.current.value.length > 16) {
        setError(
          "Sorry, Your usename must be less than or equal to 16 characters."
        );
      }

      if (phoneNumberRef.current.value.trim() !== 10) {
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
      if (error === "") {
        db.collection("users")
          .doc(currentUser.email)
          .set({
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            streetAddress: streetAddressRef.current.value,
            city: city,
            province: province,
            country: country,
            postalCode: postalCode,
            phoneNumber: phoneNumberRef.current.value,
            joinDate: currentTimestamp,
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
                <Form.Group id="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="username" ref={usernameRef} required />
                </Form.Group>
                <Form.Group id="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="firstName" ref={firstNameRef} required />
                </Form.Group>
                <Form.Group id="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="lastName" ref={lastNameRef} required />
                </Form.Group>
                <Form.Group id="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" ref={phoneNumberRef} required />
                </Form.Group>
                <Form.Group id="streetAddress">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="streetAddress"
                    ref={streetAddressRef}
                    required
                  />
                </Form.Group>
                <Form.Group id="country">
                  <Form.Label>Country</Form.Label>
                  <Dropdown
                    onSelect={(e) => {
                      setCountryISO(e);
                      setCountry(Country.getCountryByCode(e).name);
                    }}
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
                  <Form.Label>Province/State</Form.Label>

                  <Dropdown
                    onSelect={(e) => {
                      setProvinceISO(e);
                      setProvince(
                        State.getStateByCodeAndCountry(e, countryISO).name
                      );
                    }}
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
                  <Form.Label>City</Form.Label>

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
                  <Form.Label>Postal/Zip Code</Form.Label>
                  <Form.Control
                    type="postalCode"
                    ref={postalCodeRef}
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
                </Form.Group>
                <Button className="w-100 mt-4" type="submit">
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
