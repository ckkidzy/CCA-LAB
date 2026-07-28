import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const winnerGrid=document.getElementById("winnerGrid");

const prizes=[

{id:"early5",title:"⭐ Early 5"},
{id:"lucky7",title:"🌟 Lucky 7"},
{id:"topLine",title:"🥇 Top Line"},
{id:"middleLine",title:"🥈 Middle Line"},
{id:"bottomLine",title:"🥉 Bottom Line"},
{id:"fourCorners",title:"🔲 Four Corners"},
{id:"star",title:"⭐ Star"},
{id:"fullHouse1",title:"👑 1st Full House"},
{id:"fullHouse2",title:"👑👑 2nd Full House"}

];

drawCards();

function drawCards(){

winnerGrid.innerHTML="";

prizes.forEach(prize=>{

const card=document.createElement("div");

card.className="winnerCard";

card.innerHTML=`

<h2>${prize.title}</h2>

<input
type="number"
placeholder="Ticket Number"
id="${prize.id}">

<button
class="verifyBtn"
data-prize="${prize.id}">

VERIFY

</button>

`;

winnerGrid.appendChild(card);

});

}

document.addEventListener("click",async(e)=>{

if(!e.target.classList.contains("verifyBtn")) return;

const prize=e.target.dataset.prize;

const ticket=document.getElementById(prize).value.trim();

if(ticket===""){

alert("Enter ticket number");

return;

}

const snap=await getDoc(doc(db,"tickets",ticket));

if(!snap.exists()){

alert("Ticket not found.");

return;

}

const data=snap.data();

if(data.status!=="sold"){

alert("This ticket is not SOLD.");

return;

}

const ok=confirm(

`Winner

${data.name}

Ticket ${ticket}

Confirm?`

);

if(!ok) return;

await updateDoc(doc(db,"winners",prize),{

name:data.name,

ticket:ticket,

phone:data.phone,

time:new Date().toLocaleString()

});

alert("Winner Saved!");

document.getElementById(prize).value="";

});