const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");

let selection = "";

const renderSeats = (data) => {
  document.querySelector(".form-container").style.display = "block";

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

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  const validFlightPattern = /^([A-Z]{2}\d{3})$/.test(flightNumber);

  if (validFlightPattern) {
    fetch(`/flights/${flightNumber}`)
      .then((res) => res.json())
      .then((data) => {
        renderSeats(data);
      });
  } else {
    // Will Execute if user tries to alter html of the page and changed
    // the values for the dropdown
    createErrorMessage();
  }
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  // TODO: everything in here!
  fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      givenName: document.getElementById("givenName").value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

flightInput.addEventListener("blur", toggleFormContent);

function createErrorMessage() {
  const err = document.createElement("div");
  err.style.position = "absolute";
  err.style.border = "1px solid #d80026";
  err.style.borderRadius = "4px";
  err.style.padding = "10px";
  err.style.textAlign = "center";
  err.style.backgroundColor = "#fff";
  err.style.left = "50%";
  err.style.top = "50%";
  err.style.transform = "translate(-50%, -50%)";
  const message = document.createElement("p");
  message.innerHTML = "Please enter a valid flight #";
  message.style.margin = "10px";
  const btn = document.createElement("button");
  btn.style.padding = "5px";
  btn.innerHTML = "OK";
  btn.style.backgroundColor = "#d80026";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.borderRadius = "4px";
  btn.addEventListener("click", () => {
    location.reload();
  });
  err.appendChild(message);
  err.appendChild(btn);
  document.body.appendChild(err);
}
