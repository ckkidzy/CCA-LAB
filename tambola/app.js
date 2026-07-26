// =====================================
// DBSTI TAMBOLA
// APP.JS (PART 1)
// =====================================
import { db } from "./firebase.js";

import {
doc,
setDoc,
getDocs,
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const startTicket = 109;
const totalTickets = 150;
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

document.addEventListener("click",function(e){

if(!e.target.classList.contains("viewTicket")) return;

const card=e.target.closest(".ticket");

selectedTicket=card.dataset.ticket;

modalTitle.innerHTML="Ticket "+selectedTicket;

modalImage.src="tickets/ticket_"+selectedTicket+".jpg";

const status=card.querySelector(".ticket-status").textContent;

modalStatus.innerHTML=status;

if(status.includes("Sold")){

reserveBtn.style.display="none";

}

else{

reserveBtn.style.display="block";

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
// RESERVE BUTTON
// =====================================

reserveBtn.addEventListener("click", function () {

    const phone = "919615285738"; // <-- Replace with your WhatsApp number

    const message =
`Hello,

I would like to reserve Tambola Ticket ${selectedTicket}.

Name:
Phone:

Thank you.`;

    window.open(

`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,

"_blank"

);

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

    for (let i = 109; i <= 258; i++) {

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
                status.innerHTML = "🟠 Reserved";

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