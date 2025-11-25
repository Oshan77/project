const API = "http://localhost:5000/api/apod";

// Load Today
async function loadToday() {
    const res = await fetch(`${API}/today`);
    const data = await res.json();

    document.getElementById("today").innerHTML = `
      <h3>${data.title}</h3>
      <img src="${data.url}">
      <p>${data.explanation}</p>
    `;
}

// Load by Date
async function loadByDate() {
    const date = document.getElementById("apod-date").value;
    if (!date) return alert("Select a date!");

    const res = await fetch(`${API}/${date}`);
    const data = await res.json();

    document.getElementById("date-result").innerHTML = `
      <h3>${data.title}</h3>
      <img src="${data.url}">
      <p>${data.explanation}</p>
    `;
}

// Load Recent Gallery
async function loadRecent() {
    const res = await fetch(`${API}/recent`);
    const data = await res.json();

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    data.reverse().forEach(apod => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h4>${apod.title}</h4>
            <img src="${apod.url}">
        `;
        gallery.appendChild(card);
    });
}

loadToday();
loadRecent();
