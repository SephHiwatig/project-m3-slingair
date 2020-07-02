"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  console.log("REAL FLIGHT: ", allFlights.includes(flightNumber));
};

const handleSeatSelect = (req, res) => {
  const flightsNumbers = Object.keys(flights);
  res.status(200).render("pages/index", { flightNumbers: flightsNumbers });
};

const handleConfirmed = (req, res) => {
  res.status(200).render("pages/confirmed");
};

const handleViewReservation = (req, res) => {
  res.status(200).render("pages/view-reservation");
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
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
