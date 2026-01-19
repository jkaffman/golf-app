// Configuración de hoyos
const ventajas = [5,15,9,17,3,7,13,11,1,14,18,12,10,16,2,8,6,4];
const pares = [4,5,3,4,4,4,3,5,4,4,3,4,5,4,4,3,4,5];
const numJugadores = 4;

// Genera tabla multi-jugador
function generarTabla() {
  const tablaDiv = document.getElementById("tabla");
  let html = `<table>
    <tr>
      <th>Hoyo</th><th>Par</th><th>Ventaja</th>`;
  for (let j = 1; j <= numJugadores; j++) {
    html += `<th>${document.getElementById("nombre"+j).value}</th><th>Ptos</th>`;
  }
  html += `</tr>`;

  for (let i = 1; i <= 18; i++) {
    html += `<tr>
      <td>${i}</td>
      <td>${pares[i-1]}</td>
      <td>${ventajas[i-1]}</td>`;
    for (let j = 1; j <= numJugadores; j++) {
      html += `<td><input type="number" id="h${i}_j${j}" min="0" max="9"></td>`;
      html += `<td id="p${i}_j${j}"></td>`;
    }
    html += `</tr>`;
  }
  html += `</table>`;
  tablaDiv.innerHTML = html;
}

// Calcula puntos y totales para todos los jugadores
function calcular() {
  let resultadoHTML = `<h3>Resultados - ${document.getElementById("cancha").value}</h3>`;

  for (let j = 1; j <= numJugadores; j++) {
    const handicap = parseInt(document.getElementById("handicap"+j).value) || 0;
    let totalGross = 0;
    let totalPuntos = 0;

    const golpesBase = Math.floor(handicap / 18);
    const golpesExtra = handicap % 18;

    for (let i = 1; i <= 18; i++) {
      const inputPalos = document.getElementById(`h${i}_j${j}`);
      const celdaPuntos = document.getElementById(`p${i}_j${j}`);
      if (!inputPalos || !celdaPuntos) continue;

      const palos = parseInt(inputPalos.value);
      if (isNaN(palos)) {
        celdaPuntos.innerText = "-";
        continue;
      }

      totalGross += palos;

      let ventajaHoyo = golpesBase;
      if (ventajas[i - 1] <= golpesExtra) ventajaHoyo++;

      const neto = palos - ventajaHoyo;
      const diferencia = pares[i - 1] - neto;

      let puntos = 0;
      if (diferencia >= 3) puntos = 5;
      else if (diferencia === 2) puntos = 4;
      else if (diferencia === 1) puntos = 3;
      else if (diferencia === 0) puntos = 2;
      else if (diferencia === -1) puntos = 1;
      else puntos = 0;

      celdaPuntos.innerText = puntos;
      totalPuntos += puntos;
    }

    const nombre = document.getElementById("nombre"+j).value;
    resultadoHTML += `<strong>${nombre}:</strong> Palos Gross: ${totalGross}, Puntos Netos: ${totalPuntos}<br>`;
  }

  document.getElementById("resultado").innerHTML = resultadoHTML;
}

// Guarda la tarjeta en un archivo HTML
function guardarTarjeta() {
  let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Tarjeta de Golf - ${document.getElementById("cancha").value}</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        table { border-collapse: collapse; margin: 0 auto; }
        th, td { border: 1px solid black; padding: 5px; text-align: center; }
        h2 { margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h2>Tarjeta - ${document.getElementById("cancha").value}</h2>
      <table>
        <tr>
          <th>Hoyo</th><th>Par</th><th>Ventaja</th>`;

  for (let j = 1; j <= numJugadores; j++) {
    html += `<th>${document.getElementById("nombre"+j).value}</th><th>Ptos</th>`;
  }
  html += `</tr>`;

  for (let i = 1; i <= 18; i++) {
    html += `<tr>
      <td>${i}</td><td>${pares[i-1]}</td><td>${ventajas[i-1]}</td>`;
    for (let j = 1; j <= numJugadores; j++) {
      const palos = document.getElementById(`h${i}_j${j}`).value || "-";
      const puntos = document.getElementById(`p${i}_j${j}`).innerText || "-";
      html += `<td>${palos}</td><td>${puntos}</td>`;
    }
    html += `</tr>`;
  }

  // Totales finales
  html += `<tr><td colspan="3"><strong>Totales</strong></td>`;
  for (let j = 1; j <= numJugadores; j++) {
    let totalGross = 0;
    let totalPuntos = 0;
    for (let i = 1; i <= 18; i++) {
      const palos = parseInt(document.getElementById(`h${i}_j${j}`).value) || 0;
      const puntos = parseInt(document.getElementById(`p${i}_j${j}`).innerText) || 0;
      totalGross += palos;
      totalPuntos += puntos;
    }
    html += `<td><strong>${totalGross}</strong></td><td><strong>${totalPuntos}</strong></td>`;
  }
  html += `</tr>`;

  html += `</table></body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tarjeta_golf.html";
  link.click();
}

// Ajusta la altura de la imagen según bloque de jugadores
function ajustarAlturaImagen() {
  const bloqueJugadores = document.getElementById("jugadores");
  const imagen = document.getElementById("imagen-jugadores");
  const altura = bloqueJugadores.offsetHeight;
  imagen.style.height = altura + "px";
}

// Inicialización
window.onload = function() {
  generarTabla();
  ajustarAlturaImagen();
};

// Actualiza imagen si cambian nombres o handicaps
for (let j = 1; j <= numJugadores; j++) {
  document.getElementById("nombre"+j).addEventListener("input", ajustarAlturaImagen);
  document.getElementById("handicap"+j).addEventListener("input", ajustarAlturaImagen);
}
