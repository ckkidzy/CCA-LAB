import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const winnerGrid = document.getElementById("winnerGrid");

const modal = document.getElementById("verifyModal");
const verifyPrize = document.getElementById("verifyPrize");
const verifyName = document.getElementById("verifyName");
const verifyTicket = document.getElementById("verifyTicket");

const confirmBtn = document.getElementById("confirmWinner");
const cancelBtn = document.getElementById("cancelWinner");

const prizes = [
    { id: "early5", title: "⭐ Early 5" },
    { id: "lucky7", title: "🌟 Lucky 7" },
    { id: "topLine", title: "🥇 Top Line" },
    { id: "middleLine", title: "🥈 Middle Line" },
    { id: "bottomLine", title: "🥉 Bottom Line" },
    { id: "fourCorners", title: "🔲 Four Corners" },
    { id: "star", title: "⭐ Star" },
    { id: "fullHouse1", title: "👑 1st Full House" },
    { id: "fullHouse2", title: "👑👑 2nd Full House" }
];

let currentPrize = "";
let currentTicket = "";
let currentData = null;

drawCards();
listenToWinners();

function drawCards() {
    winnerGrid.innerHTML = "";

    prizes.forEach(prize => {
        const card = document.createElement("div");
        card.className = "winnerCard";

        card.innerHTML = `
            <h2>${prize.title}</h2>

            <div id="display-${prize.id}" style="margin-bottom:12px; padding:10px; background:#f8fafc; border-radius:10px; font-size:14px; color:#475569; min-height:42px;">
                No winner yet
            </div>

            <input
                type="number"
                placeholder="Ticket Number"
                id="${prize.id}">

            <div style="display:flex; gap:8px;">
                <button class="verifyBtn" data-prize="${prize.id}" style="flex:3;">
                    VERIFY & ADD
                </button>
                <button class="clearBtn" data-prize="${prize.id}" style="flex:1; padding:12px; border:none; border-radius:10px; background:#ef4444; color:white; font-weight:bold; cursor:pointer;">
                    Clear
                </button>
            </div>
        `;

        winnerGrid.appendChild(card);
    });
}

// Live-update the current winners shown on each card
function listenToWinners() {
    onSnapshot(collection(db, "winners"), (snapshot) => {
        snapshot.forEach((docSnap) => {
            const box = document.getElementById("display-" + docSnap.id);
            if (!box) return;

            const data = docSnap.data();
            if (data.name && data.ticket) {
                box.innerHTML = `🏆 <strong>${data.name}</strong><br>🎟 Ticket: ${data.ticket}`;
                box.style.background = "#ecfdf5";
                box.style.color = "#065f46";
            } else {
                box.innerHTML = "No winner yet";
                box.style.background = "#f8fafc";
                box.style.color = "#475569";
            }
        });
    });
}

document.addEventListener("click", async (e) => {
    // Handle CLEAR button
    if (e.target.classList.contains("clearBtn")) {
        const prize = e.target.dataset.prize;
        const prizeTitle = prizes.find(p => p.id === prize).title;

        if (!confirm(`Clear all winners for ${prizeTitle}?`)) return;

        await setDoc(doc(db, "winners", prize), {
            name: "",
            ticket: "",
            phone: "",
            time: ""
        }, { merge: true });

        return;
    }

    // Handle VERIFY button
    if (!e.target.classList.contains("verifyBtn")) return;

    const prize = e.target.dataset.prize;
    const ticket = document.getElementById(prize).value.trim();

    if (ticket === "") {
        alert("Enter Ticket Number");
        return;
    }

    const snap = await getDoc(doc(db, "tickets", ticket));

    if (!snap.exists()) {
        alert("Ticket not found.");
        return;
    }

    const data = snap.data();

    if (data.status !== "sold") {
        alert("This ticket is not SOLD.");
        return;
    }

    currentPrize = prize;
    currentTicket = ticket;
    currentData = data;

    const prizeTitle = prizes.find(p => p.id === prize).title;

    verifyPrize.innerHTML = prizeTitle;
    verifyName.innerHTML = "👤 " + data.name;
    verifyTicket.innerHTML = "🎟 Ticket " + ticket;

    modal.classList.add("show");
});

confirmBtn.onclick = async () => {
    const winnerRef = doc(db, "winners", currentPrize);
    const existingSnap = await getDoc(winnerRef);
    const existing = existingSnap.exists() ? existingSnap.data() : {};

    // Check if this ticket is already listed for this prize
    const existingTickets = existing.ticket ? String(existing.ticket).split(",").map(t => t.trim()) : [];
    if (existingTickets.includes(String(currentTicket))) {
        alert("This ticket is already added as a winner for this prize!");
        modal.classList.remove("show");
        return;
    }

    // Append new winner if one already exists, otherwise set as first winner
    const newName = existing.name ? `${existing.name}, ${currentData.name}` : currentData.name;
    const newTicket = existing.ticket ? `${existing.ticket}, ${currentTicket}` : currentTicket;
    const newPhone = existing.phone
        ? (currentData.phone ? `${existing.phone}, ${currentData.phone}` : existing.phone)
        : (currentData.phone || "");

    await setDoc(winnerRef, {
        name: newName,
        ticket: newTicket,
        phone: newPhone,
        time: new Date().toLocaleString()
    }, { merge: true });

    document.getElementById(currentPrize).value = "";
    modal.classList.remove("show");

    alert("🏆 Winner Added!");
};

cancelBtn.onclick = () => {
    modal.classList.remove("show");
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
};
