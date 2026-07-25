// ===============================
// DBSTI TAMBOLA APP
// ===============================

// Ticket Folder
const ticketFolder = "tickets/";

// Total Tickets
const totalTickets = 180;

// Grid
const ticketsContainer = document.querySelector(".tickets");

// Search
const searchInput = document.getElementById("search");

// ---------- CREATE TICKETS ----------

ticketsContainer.innerHTML = "";

for (let i = 1; i <= totalTickets; i++) {

    const number = String(i).padStart(3, "0");

    const ticket = document.createElement("div");

    ticket.className = "ticket available";

    ticket.setAttribute("data-ticket", number);

    ticket.innerHTML = `

        <div class="ribbon available-ribbon">
            AVAILABLE
        </div>

        <div class="ticket-icon">
            🎟
        </div>

        <div class="ticket-title">
            TICKET
        </div>

        <div class="ticket-number">
            ${number}
        </div>

        <button class="view-btn">
            VIEW
        </button>

    `;

    ticketsContainer.appendChild(ticket);

}

// ---------- SEARCH ----------

searchInput.addEventListener("keyup", function () {

    const value = this.value.trim();

    document.querySelectorAll(".ticket").forEach(ticket => {

        const number = ticket.dataset.ticket;

        if (number.includes(value)) {

            ticket.style.display = "block";

        } else {

            ticket.style.display = "none";

        }

    });

});

// ---------- POPUP ----------

const popup = document.createElement("div");

popup.className = "popup";

popup.innerHTML = `

<div class="popup-box">

<span class="close-popup">&times;</span>

<img id="popupImage">

<h2 id="popupTitle"></h2>

<p id="popupStatus"></p>

<button id="reserveBtn">

Reserve Ticket

</button>

</div>

`;

document.body.appendChild(popup);

// ---------- OPEN POPUP ----------

document.querySelectorAll(".view-btn").forEach(btn => {

    btn.addEventListener("click", function (e) {

        e.stopPropagation();

        const ticket = this.parentElement;

        const number = ticket.dataset.ticket;

        document.getElementById("popupImage").src =
            ticketFolder + "ticket_" + number + ".jpg";

        document.getElementById("popupTitle").innerHTML =
            "Ticket " + number;

        document.getElementById("popupStatus").innerHTML =
            "🟢 Available";

        popup.classList.add("show");

    });

});

// ---------- CLOSE ----------

document.querySelector(".close-popup").onclick = () => {

    popup.classList.remove("show");

};

popup.onclick = function (e) {

    if (e.target == popup)

        popup.classList.remove("show");

};

// ---------- RESERVE ----------

document.getElementById("reserveBtn").onclick = function () {

    const ticket =
        document.getElementById("popupTitle").innerText.replace("Ticket ", "");

    const phone = "919615285738";

    const message =
`Hello Sir,

I would like to reserve Ticket ${ticket}.

Name :

Phone :
`;

    window.open(

        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,

        "_blank"

    );

};
