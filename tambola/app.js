// =====================================
// DBSTI TAMBOLA
// APP.JS (PART 1)
// =====================================
import { db } from "./firebase.js";

import {
doc,
setDoc,
getDoc,
updateDoc,
getDocs,
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const startTicket = 289;
const totalTickets = 216;
const endTicket = startTicket + totalTickets -1;

const ticketGrid = document.getElementById("ticketGrid");
const searchBox = document.getElementById("search");

const modal = document.getElementById("ticketModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalStatus = document.getElementById("modalStatus");

const reserveBtn = document.getElementById("reserveBtn");
const closeBtn = document.getElementById("closeModal");

let selectedTicket = "";
//--------------------------
//NEW TICKETS ONCE
//--------------------------
async function addNewTickets() {

    for (let i = 259; i <= 288; i++) {

        await setDoc(doc(db, "tickets", String(i)), {

            status: "available",
            name: "",
            phone: "",
            time: ""

        });

    }

    alert("30 new tickets added!");

}

// =====================================
// CREATE TICKETS
// =====================================

function createTickets() {

    ticketGrid.innerHTML = "";

    for (let i = startTicket; i <= endTicket; i++) {

        const number = String(i).padStart(3, "0");

        const ticket = document.createElement("div");

        ticket.className = "ticket";

        ticket.dataset.ticket = number;

        ticket.dataset.status = "available";

        ticket.innerHTML = `

        <div class="ribbon available">
            AVAILABLE
        </div>

        <div class="ticket-image">

<img
src="tickets/ticket_${number}.jpg"
alt="Ticket ${number}"
loading="lazy">

</div>

<div class="ticket-info">

<h3>🎟 Ticket ${number}</h3>

<div class="ticket-status status-available">

🟢 Available

</div>

<button class="viewTicket">

View Ticket

</button>

</div>

        `;

        ticketGrid.appendChild(ticket);

    }

}

createTickets();
loadTicketStatus();

// =====================================
// SEARCH
// =====================================

searchBox.addEventListener("keyup", function () {

    const value = this.value.trim();

    const tickets = document.querySelectorAll(".ticket");

    tickets.forEach(ticket => {

        const number = ticket.dataset.ticket;

        if (number.includes(value)) {

            ticket.style.display = "block";

        }

        else {

            ticket.style.display = "none";

        }

    });

});

// =====================================
// OPEN POPUP
// =====================================

document.addEventListener("click", function(e) {

    if (!e.target.classList.contains("viewTicket")) return;

    const card = e.target.closest(".ticket");
    selectedTicket = card.dataset.ticket;

    modalTitle.innerHTML = "Ticket " + selectedTicket;
    modalImage.src = "tickets/ticket_" + selectedTicket + ".jpg";

    const status = card.querySelector(".ticket-status").textContent;
    modalStatus.innerHTML = status;

    const bookingForm = document.getElementById("bookingForm");

    // Hide form if Sold OR already Reserved
    if (status.includes("Sold") || status.includes("Reserved")) {
        bookingForm.style.display = "none";
    } else {
        bookingForm.style.display = "block";
    }

    modal.classList.add("show");
});

// =====================================
// CLOSE
// =====================================

closeBtn.onclick=function(){

modal.classList.remove("show");

}

modal.onclick=function(e){

if(e.target===modal){

modal.classList.remove("show");

}

}

// =====================================
// RESERVE BUTTON (AUTO-LOCK)
// =====================================

reserveBtn.addEventListener("click", async function () {

    const nameInput = document.getElementById("userName").value.trim();

    if (!nameInput) {
        alert("Please enter your Full Name first.");
        return;
    }

    const ticketRef = doc(db, "tickets", selectedTicket);

    try {
        // 1. Double-check live status in Firebase before locking
        const docSnap = await getDoc(ticketRef);
        if (docSnap.exists() && docSnap.data().status !== "available") {
            alert("Sorry! This ticket was just reserved or sold to someone else.");
            modal.classList.remove("show");
            return;
        }

        // 2. Immediately mark as Reserved in Firebase
        await updateDoc(ticketRef, {
            status: "reserved",
            name: nameInput,
            time: new Date().toLocaleString()
        });

        // 3. Close modal & clear input
        modal.classList.remove("show");
        document.getElementById("userName").value = "";

        // 4. Open WhatsApp reliably (avoids pop-up blockers)
        const adminPhone = "918638229523";
        const message = 
`Hello,

I have reserved Tambola Ticket ${selectedTicket}.

Name: ${nameInput}

Please confirm my ticket. Thank you.`;

        window.location.href = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
});

// =====================================
// COUNTERS
// =====================================

function updateCounters(){

    const available =
    document.querySelectorAll(".status-available").length;

    const reserved =
    document.querySelectorAll(".status-reserved").length;

    const sold =
    document.querySelectorAll(".status-sold").length;

    document.getElementById("availableCount").innerHTML=available;

    document.getElementById("reservedCount").innerHTML=reserved;

    document.getElementById("soldCount").innerHTML=sold;

}

updateCounters();


// =====================================
// IMAGE ERROR
// =====================================

modalImage.onerror=function(){

this.src="images/notfound.jpg";

}


// =====================================
// ESC KEY CLOSE
// =====================================

document.addEventListener("keydown",function(e){

if(e.key==="Escape"){

modal.classList.remove("show");

}

});


// =====================================
// SMALL CARD ANIMATION
// =====================================

const cards=document.querySelectorAll(".ticket");

cards.forEach((card,index)=>{

card.style.opacity="0";

card.style.transform="translateY(40px)";

setTimeout(()=>{

card.style.transition=".5s";

card.style.opacity="1";

card.style.transform="translateY(0)";

},index*15);

});


// =====================================
// HOVER EFFECT
// =====================================

cards.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.zIndex="100";

});

card.addEventListener("mouseleave",()=>{

card.style.zIndex="1";

});

});


// =====================================
// RANDOM GLOW
// =====================================

setInterval(()=>{

const allCards=document.querySelectorAll(".ticket");

const random=Math.floor(Math.random()*allCards.length);

allCards[random].style.boxShadow=
"0 0 35px rgba(255,215,0,.7)";

setTimeout(()=>{

allCards[random].style.boxShadow="";

},1200);

},2500);

async function initializeTickets() {

    for (let i = 289; i <= 504; i++) {

        await setDoc(doc(db, "tickets", String(i)), {

            status: "available",

            name: "",

            phone: "",

            time: ""

        });

    }

    alert("150 tickets created successfully!");

}

// Run ONLY ONCE

function loadTicketStatus() {

    onSnapshot(collection(db, "tickets"), (snapshot) => {

        snapshot.forEach((docSnap) => {

            const id = docSnap.id;
            const data = docSnap.data();

            const card = document.querySelector(`[data-ticket="${id}"]`);

            if (!card) return;

            const ribbon = card.querySelector(".ribbon");
            const status = card.querySelector(".ticket-status");

            ribbon.classList.remove("available", "reserved", "sold");
            status.classList.remove("status-available", "status-reserved", "status-sold");

            if (data.status === "available") {

                ribbon.classList.add("available");
                ribbon.innerHTML = "AVAILABLE";

                status.classList.add("status-available");
                status.innerHTML = "🟢 Available";

            }

            else if (data.status === "reserved") {

    ribbon.classList.add("reserved");
    ribbon.innerHTML = "RESERVED";

    status.classList.add("status-reserved");

    if (data.name && data.name.trim() !== "") {

        status.innerHTML = `🟠 Reserved<br><small>Held for ${data.name}</small>`;

    } else {

        status.innerHTML = "🟠 Reserved";

    }

}

            else {

                ribbon.classList.add("sold");
                ribbon.innerHTML = "SOLD";

                status.classList.add("status-sold");

                if (data.name && data.name.trim() !== "") {

                    status.innerHTML = `🔴 Sold<br><small>Booked by ${data.name}</small>`;

                } else {

                    status.innerHTML = "🔴 Sold";

                }

            }

        });

        updateCounters();

    });

}
// =====================================
// CONSOLE
// =====================================

console.log("🍀 DBSTI Tambola Loaded Successfully");
