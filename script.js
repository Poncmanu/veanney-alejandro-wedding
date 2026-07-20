const weddingDate = new Date("September 11, 2026 19:00:00").getTime();

function updateCountdown(){

    const now = new Date().getTime();

    const distance = weddingDate - now;

    if(distance < 0){

        return;

    }

    const days = Math.floor(distance / (1000*60*60*24));

    const hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));

    const minutes = Math.floor((distance % (1000*60*60))/(1000*60));

    const seconds = Math.floor((distance % (1000*60))/1000);

    document.getElementById("days").textContent = days;

    document.getElementById("hours").textContent = hours.toString().padStart(2,"0");

    document.getElementById("minutes").textContent = minutes.toString().padStart(2,"0");

    document.getElementById("seconds").textContent = seconds.toString().padStart(2,"0");

}

updateCountdown();

setInterval(updateCountdown,1000);

// ===== RSVP =====

const guestChecks = document.querySelectorAll('#guestList input[type="checkbox"]');
const guestCounter = document.getElementById('guestCounter');
const confirmButton = document.getElementById('confirmButton');

function updateGuestCounter() {

    const guestChecks = document.querySelectorAll('#guestList input[type="checkbox"]');
    const total = guestChecks.length;
    const selected = [...guestChecks].filter(c => c.checked).length;

    guestCounter.textContent =
    `${selected} de ${total} ${total === 1 ? "lugar confirmado" : "lugares confirmados"}`;

if (selected === 0) {

    confirmButton.disabled = false;

    confirmButton.textContent = 'Confirmar que no habrá asistencia';

    confirmButton.style.opacity = '1';

    confirmButton.style.cursor = 'pointer';

    confirmButton.style.background = '#666666';

} else {

    confirmButton.disabled = false;

    confirmButton.textContent = 'Confirmar asistencia';

    confirmButton.style.opacity = '1';

    confirmButton.style.cursor = 'pointer';

    confirmButton.style.background = '#d4af37';

}

}


updateGuestCounter();
