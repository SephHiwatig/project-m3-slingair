const seatsDiv = document.getElementById("admin-seats-section");
const flightInput = document.getElementById("flight");

const renderSeats = (data) => {
  seatsDiv.innerHTML = "";
  //   document.querySelector(".form-container").style.display = "block";

  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");
      let seatData = data.find((d) => d.id === seatNumber);

      // Two types of seats to render
      const seatAvailable = `<li class="occupant"><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...
      if (seatData.isAvailable) {
        seat.innerHTML = seatAvailable;
      } else {
        const occupant = seatData.occupant
          ? seatData.occupant
          : "Mystery Person";
        const seatOccupied = `<li class="occupant"><label class="seat"><span id="${seatNumber}" class="occ">${seatNumber} <span class="occupant-name">${occupant}</span></span></label></li>`;
        seat.innerHTML = seatOccupied;
        seat.addEventListener(
          "click",
          showDetails.bind(this, seatData.bookingId)
        );
      }

      row.appendChild(seat);
    }
  }
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  const validFlightPattern = /^([A-Z]{2}\d{3})$/.test(flightNumber);
  if (validFlightPattern) {
    fetch(`/flights/${flightNumber}?admin=true`)
      .then((res) => res.json())
      .then((data) => {
        renderSeats(data);
      });
  }
};

flightInput.addEventListener("blur", toggleFormContent);

function showDetails(bookingId) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.zIndex = "10";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.overflow = "auto";
  modal.style.backgroundColor = "rgba(0,0,0,0.4)";

  const details = document.createElement("div");
  details.style.position = "absolute";
  details.style.border = "1px solid #d80026";
  details.style.borderRadius = "4px";
  details.style.padding = "10px";
  details.style.textAlign = "center";
  details.style.backgroundColor = "#fff";
  details.style.left = "50%";
  details.style.top = "50%";
  details.style.transform = "translate(-50%, -50%)";
  const message = document.createElement("p");
  message.style.margin = "10px";
  const btn = document.createElement("button");
  btn.style.padding = "5px";
  btn.innerHTML = "OK";
  btn.style.backgroundColor = "#d80026";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.borderRadius = "4px";
  btn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  fetch("/bookinginfo", {
    method: "POST",
    body: JSON.stringify({ bookingId: bookingId }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((data) => {
      message.innerHTML = `<span class="info">Flight: ${data.flight}</span> <br/><br/>
      <span class="info">Seat: ${data.seat}</span> <br/><br/>
      <span class="info">Name: ${data.givenName}</span> <br/><br/>
      <span class="info">Surname: ${data.surname}</span> <br/><br/>
      <span class="info">Email: ${data.email}</span> <br/><br/>`;
      details.appendChild(message);
      details.appendChild(btn);
      modal.appendChild(details);
      document.body.appendChild(modal);
    });
}
