let bookings =
  JSON.parse(localStorage.getItem("cabBookings")) || [];

let selectedCab = {
  type: "Mini",
  price: 12
};

const cabOptions = document.querySelectorAll(".cab");

const distanceInput =
  document.getElementById("distance");

const fareDisplay =
  document.getElementById("fare");

const bookBtn =
  document.getElementById("bookBtn");

const confirmation =
  document.getElementById("confirmation");


/* Select Cab */

cabOptions.forEach(function (cab) {

  cab.addEventListener("click", function () {

    cabOptions.forEach(function (item) {
      item.classList.remove("active");
    });

    cab.classList.add("active");

    selectedCab = {
      type: cab.dataset.type,
      price: Number(cab.dataset.price)
    };

    calculateFare();

  });

});


/* Calculate Fare */

distanceInput.addEventListener(
  "input",
  calculateFare
);

function calculateFare() {

  const distance =
    Number(distanceInput.value);

  if (!distance || distance <= 0) {
    fareDisplay.textContent = "₹0";
    return;
  }

  /*
    Base fare = ₹50
    Per km = selected cab price
  */

  const baseFare = 50;

  const fare =
    baseFare +
    distance * selectedCab.price;

  fareDisplay.textContent =
    "₹" + Math.round(fare);
}


/* Book Cab */

bookBtn.addEventListener(
  "click",
  bookCab
);

function bookCab() {

  const pickup =
    document.getElementById("pickup").value.trim();

  const drop =
    document.getElementById("drop").value.trim();

  const date =
    document.getElementById("date").value;

  const time =
    document.getElementById("time").value;

  const distance =
    Number(distanceInput.value);

  /* Validation */

  if (!pickup) {
    alert("Please enter pickup location.");
    return;
  }

  if (!drop) {
    alert("Please enter drop location.");
    return;
  }

  if (!date) {
    alert("Please select a date.");
    return;
  }

  if (!time) {
    alert("Please select a time.");
    return;
  }

  if (!distance || distance <= 0) {
    alert("Please enter a valid distance.");
    return;
  }

  /* Calculate fare */

  const fare =
    50 + distance * selectedCab.price;

  /* Generate booking ID */

  const bookingId =
    "CAB" +
    Math.floor(100000 + Math.random() * 900000);

  /* Create booking */

  const booking = {

    id: bookingId,

    cab: selectedCab.type,

    pickup: pickup,

    drop: drop,

    date: date,

    time: time,

    distance: distance,

    fare: Math.round(fare),

    status: "Confirmed"

  };

  bookings.push(booking);

  saveBookings();

  showConfirmation(booking);

  displayBookings();
}


/* Show Confirmation */

function showConfirmation(booking) {

  document.getElementById("bookingId")
    .textContent = booking.id;

  document.getElementById("confirmCab")
    .textContent = booking.cab;

  document.getElementById("confirmPickup")
    .textContent = booking.pickup;

  document.getElementById("confirmDrop")
    .textContent = booking.drop;

  document.getElementById("confirmDate")
    .textContent = formatDate(booking.date);

  document.getElementById("confirmTime")
    .textContent = booking.time;

  document.getElementById("confirmFare")
    .textContent = "₹" + booking.fare;

  confirmation.classList.remove("hidden");
}


/* Close Confirmation */

function closeConfirmation() {

  confirmation.classList.add("hidden");

  document.getElementById("pickup").value = "";
  document.getElementById("drop").value = "";
  document.getElementById("distance").value = "";

  fareDisplay.textContent = "₹0";
}


/* Display Booking History */

function displayBookings() {

  const list =
    document.getElementById("bookingList");

  const noBookings =
    document.getElementById("noBookings");

  list.innerHTML = "";

  if (bookings.length === 0) {

    noBookings.style.display = "block";
    return;

  }

  noBookings.style.display = "none";

  bookings
    .slice()
    .reverse()
    .forEach(function (booking) {

      const div =
        document.createElement("div");

      div.className = "booking-item";

      div.innerHTML = `

        <div>

          <h3>🚕 ${booking.cab}</h3>

          <p>
            <strong>${booking.id}</strong>
          </p>

          <p>
            📍 ${escapeHTML(booking.pickup)}
            →
            🏁 ${escapeHTML(booking.drop)}
          </p>

          <p>
            📅 ${formatDate(booking.date)}
            &nbsp;
            ⏰ ${booking.time}
          </p>

          <p>
            ${booking.distance} km
          </p>

        </div>

        <div class="booking-fare">
          ₹${booking.fare}
        </div>

      `;

      list.appendChild(div);

    });
}


/* Save Bookings */

function saveBookings() {

  localStorage.setItem(
    "cabBookings",
    JSON.stringify(bookings)
  );

}


/* Format Date */

function formatDate(date) {

  const dateObject =
    new Date(date + "T00:00:00");

  return dateObject.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}


/* Prevent HTML injection */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* Load bookings */

displayBookings();
