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

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...
      let seatData = data.find((d) => d.id === seatNumber);
      if (seatData.isAvailable) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
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
        console.log(data);
        renderSeats(data);
      });
  }
};

flightInput.addEventListener("blur", toggleFormContent);
