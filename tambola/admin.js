import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const ticketGrid = document.getElementById("ticketGrid");
const search = document.getElementById("search");

let tickets = [];

loadTickets();

async function loadTickets(){

    const snapshot = await getDocs(collection(db,"tickets"));

    tickets=[];

    snapshot.forEach(docSnap=>{

        tickets.push({

            id:docSnap.id,
            ...docSnap.data()

        });

    });

    tickets.sort((a,b)=>Number(a.id)-Number(b.id));

    drawTickets();

}

function drawTickets(filter=""){

    ticketGrid.innerHTML="";

    tickets.forEach(ticket=>{

        if(filter && !ticket.id.includes(filter)) return;

        const div=document.createElement("div");

        div.className=`adminTicket ${ticket.status}`;

        div.innerHTML=ticket.id;

        div.onclick=()=>changeStatus(ticket);

        ticketGrid.appendChild(div);

    });

}

search.addEventListener("keyup",function(){

    drawTickets(this.value.trim());

});

async function changeStatus(ticket){

    let status=prompt(

`Ticket ${ticket.id}

1 = available
2 = reserved
3 = sold`

);

    if(status===null) return;

    let newStatus="available";

    if(status==="2") newStatus="reserved";

    if(status==="3") newStatus="sold";

    await updateDoc(

        doc(db,"tickets",ticket.id),

        {

            status:newStatus

        }

    );

    loadTickets();

}
