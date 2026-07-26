import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const ticketGrid = document.getElementById("ticketGrid");
const search = document.getElementById("search");

const modal = document.getElementById("statusModal");
const ticketTitle = document.getElementById("ticketTitle");

const availableBtn = document.getElementById("availableBtn");
const reservedBtn = document.getElementById("reservedBtn");
const soldBtn = document.getElementById("soldBtn");
const closeStatus = document.getElementById("closeStatus");

let tickets = [];
let selectedTicket = "";

// ===========================
// REALTIME LISTENER
// ===========================

onSnapshot(collection(db, "tickets"), (snapshot) => {

    tickets = [];

    snapshot.forEach((docSnap) => {

        tickets.push({

            id: docSnap.id,
            ...docSnap.data()

        });

    });

    tickets.sort((a, b) => Number(a.id) - Number(b.id));

    drawTickets(search.value.trim());

});

// ===========================
// DRAW TICKETS
// ===========================

function drawTickets(filter = "") {

    ticketGrid.innerHTML = "";

    tickets.forEach(ticket => {

        if (filter && !ticket.id.includes(filter)) return;

        const div = document.createElement("div");

        div.className = `adminTicket ${ticket.status}`;

        div.innerHTML = ticket.id;

        div.onclick = () => {

            selectedTicket = ticket.id;

            ticketTitle.innerHTML = "🎟 Ticket " + ticket.id;

            modal.classList.add("show");

        };

        ticketGrid.appendChild(div);

    });

}

// ===========================
// SEARCH
// ===========================

search.addEventListener("keyup", () => {

    drawTickets(search.value.trim());
updateCounters();

});

// ===========================
// CHANGE STATUS
// ===========================

availableBtn.onclick = () => changeStatus("available");
reservedBtn.onclick = () => changeStatus("reserved");
soldBtn.onclick = () => changeStatus("sold");

async function changeStatus(status) {

    await updateDoc(

        doc(db, "tickets", selectedTicket),

        {

            status: status

        }

    );

    modal.classList.remove("show");

}

// ===========================
// CLOSE POPUP
// ===========================

closeStatus.onclick = () => {

    modal.classList.remove("show");

};

window.onclick = (e) => {

    if (e.target === modal) {

        modal.classList.remove("show");

    }

};

function updateCounters(){

const available=tickets.filter(
t=>t.status==="available"
).length;

const reserved=tickets.filter(
t=>t.status==="reserved"
).length;

const sold=tickets.filter(
t=>t.status==="sold"
).length;

document.getElementById("availableCount").innerHTML=available;

document.getElementById("reservedCount").innerHTML=reserved;

document.getElementById("soldCount").innerHTML=sold;

}
};