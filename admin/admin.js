document.querySelectorAll(".metric-card").forEach(card=>{

    card.addEventListener("click",()=>{

        document.getElementById("detailTitle").innerHTML=card.innerText;

        document.getElementById("detailContent").innerHTML=`

        <p>Carlos Segura</p>

        <p>Adriana Villagómez</p>

        <p>Alejandro Ruiz</p>

        <p>Ana Lilia Chávez</p>

        `;

    });

});
