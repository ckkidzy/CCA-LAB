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

if(data.name && data.ticket){

    name.classList.remove("waiting");

    name.innerHTML = data.name;

    ticket.innerHTML = "🎟️" + data.ticket;

}else{

    name.classList.add("waiting");

    name.innerHTML = "⏳ WAITING FOR WINNER";

    ticket.innerHTML = "—";

}

const card=name.closest(".winnerCard");

card.classList.add("revealed");


}

);

}
