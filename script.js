const weddingDate = new Date("2026-09-11T19:00:00");

function updateCountdown() {

    const now = new Date();

    const diff = weddingDate - now;

    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;

    const minutes = Math.floor(diff / 1000 / 60) % 60;

    const seconds = Math.floor(diff / 1000) % 60;

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

}

setInterval(updateCountdown,1000);

updateCountdown();
