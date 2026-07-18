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

    const total = guestChecks.length;
    const selected = [...guestChecks].filter(c => c.checked).length;

    guestCounter.textContent = `${selected} de ${total} invitados seleccionados`;

    if (selected === 0) {
        confirmButton.disabled = true;
        confirmButton.textContent = 'Selecciona al menos un invitado';
        confirmButton.style.opacity = '0.5';
        confirmButton.style.cursor = 'not-allowed';
    } else {
        confirmButton.disabled = false;
        confirmButton.textContent = 'Confirmar asistencia';
        confirmButton.style.opacity = '1';
        confirmButton.style.cursor = 'pointer';
    }

}

guestChecks.forEach(check => {
    check.addEventListener('change', updateGuestCounter);
});

updateGuestCounter();
