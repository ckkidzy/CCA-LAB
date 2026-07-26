import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const adminGrid = document.getElementById("adminGrid");

async function loadAdmin() {

    adminGrid.innerHTML = "";

    const snapshot = await getDocs(collection(db, "tickets"));

    snapshot.forEach((docSnap)=>{

        const id = docSnap.id;

        const data = docSnap.data();

        let color="green";
        let emoji="🟢";

        if(data.status==="reserved"){

            color="orange";
            emoji="🟠";

        }

        if(data.status==="sold"){

            color="red";
            emoji="🔴";

        }

        adminGrid.innerHTML += `

        <div class="admin-card">

            <h2>${id}</h2>

            <p style="color:${color};font-weight:bold;">

            ${emoji} ${data.status.toUpperCase()}

            </p>

            <button class="changeStatus"

            data-ticket="${id}">

            Change Status

            </button>

        </div>

        `;

    });

}

loadAdmin();