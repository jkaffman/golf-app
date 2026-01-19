// Configuración de la cancha
const pares = [4,5,3,4,4,4,5,3,4,4,3,5,4,4,3,4,5,4];
const ventajas = [5,15,9,17,3,7,13,11,1,14,18,12,10,16,2,8,6,4];
const jugadores = ["j1","j2","j3","j4"];

// Generar tabla dinámica
function generarTabla() {
  const tabla = document.getElementById("tabla-hoyos");
  let html = `<tr>
    <th>Hoyo</th><th>Par</th><th>Ventaja</th>`;
  jugadores.forEach(j =>
    html += `<th>${document.getElementById(j+"_nombre").value} Palos</th><th>Pts</th>`
  );
  html += `</tr>`;

  for (let h = 0; h < 18; h++) {
    html += `<tr>
      <td>${h+1}</td><td>${pares[h]}</td><td>${ventajas[h]}</td>`;
    jugadores.forEach(j => {
      html += `<td><input type="number" id="${j}_h${h+1}"></td>
               <td id="${j}_p${h+1}">-</td>`;
    });
    html += `</tr>`;
  }

  html += `<tr><th colspan="3">TOTAL</th>`;
  jugadores.forEach((j,i) =>
    html += `<th colspan="2" id="t${i+1}">0</th>`
  );
  html += `</tr>`;

  tabla.innerHTML = html;
}

// Calcular puntos Stableford
function calcular() {
  for (let j=0; j<jugadores.length; j++){
    const jugador = jugadores[j];
    const hcp = parseInt(document.getElementById(jugador+"_hcp").value) || 0;
    let totalPuntos = 0;

    for (let h=0; h<18; h++){
      const palosInput = document.getElementById(`${jugador}_h${h+1}`);
      const puntosCell = document.getElementById(`${jugador}_p${h+1}`);
      const palos = parseInt(palosInput.value);

      if (!palos) {
        puntosCell.innerText = "-";
        continue;
      }

      let golpesVentaja = Math.floor(hcp / 18);
      if ((hcp % 18) >= ventajas[h]) golpesVentaja++;

      const neto = palos - golpesVentaja;
      const diff = neto - pares[h];

      let puntos = 0;
      if (diff <= -3) puntos = 5;
      else if (diff === -2) puntos = 4;
      else if (diff === -1) puntos = 3;
      else if (diff === 0) puntos = 2;
      else if (diff === 1) puntos = 1;

      puntosCell.innerText = puntos;
      totalPuntos += puntos;
    }

    document.getElementById(`t${j+1}`).innerText = totalPuntos;
  }
}

// Guardar partida
function guardarPartida(){
  const fecha = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const partida = { fecha, jugadores: [] };

  for (let j=0; j<jugadores.length; j++){
    const jugador = jugadores[j];
    const nombre = document.getElementById(jugador+"_nombre").value;
    const hcp = parseInt(document.getElementById(jugador+"_hcp").value) || 0;
    let puntosTotales = 0;
    let grossTotal = 0;

    for (let h=1; h<=18; h++){
      const palos = parseInt(document.getElementById(`${jugador}_h${h}`)?.value);
      if (palos) grossTotal += palos;
    }

    puntosTotales = parseInt(document.getElementById(`t${j+1}`).innerText) || 0;

    partida.jugadores.push({
      nombre,
      hcp,
      gross: grossTotal,
      puntos: puntosTotales
    });
  }

  let partidas = JSON.parse(localStorage.getItem("partidasGolf") || "[]");
  partidas.push(partida);
  localStorage.setItem("partidasGolf", JSON.stringify(partidas));

  mostrarPartidas();
  alert("Partida guardada ✅");
}

// Mostrar partidas guardadas
function mostrarPartidas(){
  const div = document.getElementById("partidasGuardadas");
  let partidas = JSON.parse(localStorage.getItem("partidasGolf") || "[]");

  if (partidas.length === 0){
    div.innerHTML = "No hay partidas guardadas";
    return;
  }

  let html = "";
  partidas.forEach((p, i) => {
    html += `<div style="margin-bottom:6px">
      <strong>${i+1}. Fecha:</strong> ${p.fecha}<br>`;
    p.jugadores.forEach(jg => {
      html += `&nbsp;&nbsp;${jg.nombre} | HCP ${jg.hcp} | Gross ${jg.gross} | ${jg.puntos} pts<br>`;
    });
    html += `</div>`;
  });

  div.innerHTML = html;
}

// Inicializar
generarTabla();
mostrarPartidas();
function borrarHistorial() {
  if (!confirm("¿Seguro que deseas borrar todas las partidas guardadas?")) return;
  localStorage.removeItem("partidasGolf");
  mostrarPartidas();
}
