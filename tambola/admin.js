import { db } from "./firebase.js";

import {
collection,
doc,
updateDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const ticketGrid=document.getElementById("ticketGrid");
const search=document.getElementById("search");

const modal=document.getElementById("statusModal");
const ticketTitle=document.getElementById("ticketTitle");

const availableBtn=document.getElementById("availableBtn");
const reservedBtn=document.getElementById("reservedBtn");
const soldBtn=document.getElementById("soldBtn");
const closeStatus=document.getElementById("closeStatus");

const availableCount=document.getElementById("availableCount");
const reservedCount=document.getElementById("reservedCount");
const soldCount=document.getElementById("soldCount");

const filterButtons=document.querySelectorAll(".filterBtn");

let tickets=[];
let selectedTicket="";
let currentFilter="all";


// ======================================
// FIREBASE REALTIME
// ======================================

onSnapshot(collection(db,"tickets"),(snapshot)=>{

tickets=[];

snapshot.forEach((docSnap)=>{

tickets.push({

id:docSnap.id,
...docSnap.data()

});

});

tickets.sort((a,b)=>Number(a.id)-Number(b.id));

updateCounters();

drawTickets();

});


// ======================================
// COUNTERS
// ======================================

function updateCounters(){

const available=tickets.filter(t=>t.status==="available").length;

const reserved=tickets.filter(t=>t.status==="reserved").length;

const sold=tickets.filter(t=>t.status==="sold").length;

availableCount.innerHTML=available;

reservedCount.innerHTML=reserved;

soldCount.innerHTML=sold;

}


// ======================================
// DRAW TICKETS
// ======================================

function drawTickets(){

ticketGrid.innerHTML="";

let keyword=search.value.trim();

tickets.forEach(ticket=>{

if(keyword){

if(!ticket.id.includes(keyword)) return;

}

if(currentFilter!=="all"){

if(ticket.status!==currentFilter) return;

}

const div=document.createElement("div");

div.className=`adminTicket ${ticket.status}`;

if(ticket.status==="available"){

div.style.background="#16a34a";

}

else if(ticket.status==="reserved"){

div.style.background="#f59e0b";

}

else{

div.style.background="#dc2626";

}

div.innerHTML=ticket.id;

div.onclick=()=>{

selectedTicket=ticket.id;

ticketTitle.innerHTML="🎟 Ticket "+ticket.id;

modal.classList.add("show");

};

ticketGrid.appendChild(div);

});

}


// ======================================
// SEARCH
// ======================================

search.addEventListener("keyup",()=>{

drawTickets();

});


// ======================================
// FILTER BUTTONS
// ======================================

filterButtons.forEach(btn=>{

btn.onclick=()=>{

filterButtons.forEach(b=>{

b.classList.remove("active");

});

btn.classList.add("active");

currentFilter=btn.dataset.filter;

drawTickets();

};

});

// ======================================
// CHANGE STATUS
// ======================================

availableBtn.onclick=()=>changeStatus("available");

reservedBtn.onclick=()=>changeStatus("reserved");

soldBtn.onclick=()=>changeStatus("sold");

async function changeStatus(status){

try{

await updateDoc(

doc(db,"tickets",selectedTicket),

{

status:status

}

);

modal.classList.remove("show");

}

catch(err){

alert("Failed to update ticket.");

console.error(err);

}

}


// ======================================
// CLOSE POPUP
// ======================================

closeStatus.onclick=()=>{

modal.classList.remove("show");

};

window.addEventListener("click",(e)=>{

if(e.target===modal){

modal.classList.remove("show");

}

});

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

modal.classList.remove("show");

}

});


// ======================================
// SMALL HOVER EFFECT
// ======================================

ticketGrid.addEventListener("mouseover",(e)=>{

const card=e.target.closest(".adminTicket");

if(!card) return;

card.style.transform="scale(1.08)";

card.style.transition=".20s";

card.style.boxShadow="0 12px 25px rgba(0,0,0,.20)";

});

ticketGrid.addEventListener("mouseout",(e)=>{

const card=e.target.closest(".adminTicket");

if(!card) return;

card.style.transform="scale(1)";

card.style.boxShadow="0 6px 15px rgba(0,0,0,.15)";

});


// ======================================
// RANDOM GLOW
// ======================================

setInterval(()=>{

const cards=document.querySelectorAll(".adminTicket");

if(cards.length===0) return;

const random=Math.floor(Math.random()*cards.length);

cards[random].style.filter="brightness(1.25)";

setTimeout(()=>{

cards[random].style.filter="brightness(1)";

},700);

},3000);


// ======================================
// READY
// ======================================

console.log("✅ DBSTI Admin Panel Loaded Successfully");