import { db } from "./firebase.js";

import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const prizes = [
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

function loadWinner(prize) {
  onSnapshot(doc(db, "winners", prize), (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.data();
    const name = document.getElementById(prize + "Name");
    const ticket = document.getElementById(prize + "Ticket");

    if (!name || !ticket) return;

    const card = name.closest(".winnerCard");

    // Reset size classes first
    name.classList.remove("multi-winner", "many-winners");
    ticket.classList.remove("multi-ticket");

    if (data.name && data.ticket) {
      name.classList.remove("waiting");
      name.innerHTML = data.name;
      ticket.innerHTML = "🎟️ " + data.ticket;

      // Shrink name font if multiple winners or long text
      if (data.name.length > 32) {
        name.classList.add("many-winners");
      } else if (data.name.includes(",") || data.name.length > 16) {
        name.classList.add("multi-winner");
      }

      // Shrink ticket badge slightly if multiple tickets
      if (String(data.ticket).includes(",")) {
        ticket.classList.add("multi-ticket");
      }

      card.classList.add("revealed");
      setTimeout(() => {
        card.classList.remove("revealed");
      }, 1200);
    } else {
      name.classList.add("waiting");
      name.innerHTML = "⏳ WAITING FOR WINNER";
      ticket.innerHTML = "—";
      card.classList.remove("revealed");
    }
  });
}
