"use strict";
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  const validFlight = allFlights.includes(flightNumber);
  if (validFlight) {
    res.json(flights[flightNumber]);
  } else {
    res.status(404).redirect("/seat-select");
  }
};

const handleSeatSelect = (req, res) => {
  const flightsNumbers = Object.keys(flights);
  res.status(200).render("pages/index", { flightNumbers: flightsNumbers });
};

const handleConfirmed = (req, res) => {
  const reservationId = req.query.id;
  const newReservation = reservations.find((x) => x.id === reservationId);
  console.log(newReservation);
  if (!newReservation) {
    res.status(400).redirect("/seat-select");
  } else {
    res.status(200).render("pages/confirmed", {
      flightNum: newReservation.flight,
      seat: newReservation.seat,
      name: newReservation.givenName + " " + newReservation.surname,
      email: newReservation.email,
    });
  }
};

const handleViewReservation = (req, res) => {
  res.status(200).render("pages/view-reservation");
};

const handlePostCnfirmation = (req, res) => {
  const newReservation = req.body;
  newReservation.id = uuidv4();

  const flight = flights[newReservation.flight];
  const seat = flight.find((x) => x.id === newReservation.seat);

  const reservationExists = reservations.find(
    (x) =>
      x.flight === newReservation.flight &&
      x.givenName === newReservation.givenName &&
      x.surname === newReservation.surname &&
      x.email === newReservation.email
  );

  if (seat.isAvailable && !reservationExists) {
    seat.isAvailable = false;
    reservations.push(newReservation);
    res.status(200).send({ id: newReservation.id });
  } else {
    res.status(400).send({ err: "Invalid Reservation" });
  }
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")
  // endpoints
  .get("/", (req, res) => {
    res.status(200).redirect("/seat-select");
  })
  .get("/seat-select", handleSeatSelect)
  .get("/confirmed", handleConfirmed)
  .get("/reservation", handleViewReservation)
  .get("/flights/:flightNumber", handleFlight)
  .post("/users", handlePostCnfirmation)
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
