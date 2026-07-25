const container = document.getElementById("tickets");

for(let i=1;i<=180;i++){

const div=document.createElement("div");

div.className="ticket available";

div.innerHTML=String(i).padStart(3,"0");

container.appendChild(div);

}