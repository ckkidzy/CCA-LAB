import { db } from "./firebase.js";

import {
doc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const prizes=[

"early5",
"lucky7",
"topLine",
"middleLine",
"bottomLine",
"fourCorners",
"star",
"fullHouse1",
"fullHouse2"

];

prizes.forEach(loadWinner);

function loadWinner(prize){

onSnapshot(

doc(db,"winners",prize),

(snapshot)=>{

if(!snapshot.exists()) return;

const data=snapshot.data();

const name=document.getElementById(prize+"Name");

const ticket=document.getElementById(prize+"Ticket");

if(!name || !ticket) return;

name.classList.remove("waiting");

name.innerHTML=data.name || "Winner";

ticket.innerHTML="🎟 Ticket "+data.ticket;

const card=name.closest(".winnerCard");

card.classList.add("revealed");

setTimeout(()=>{

card.classList.remove("revealed");

},1200);

}

);

}