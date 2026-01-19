// Genera la tabla de hoyos automáticamente
function generarTabla() {
  const tablaDiv = document.getElementById("tabla");
  let html = `<table border="1" style="border-collapse: collapse; text-align: center;">
    <tr>
      <th>Hoyo</th>
      <th>Palos</th>
      <th>Puntos</th>
    </tr>`;
  for (let i = 1; i <= 18; i++) {
    html += `<tr>
      <td>${i}</td>
      <td><input type="number" id="h${i}" min="0"></td>
      <td id="p${i}"></td>
    </tr>`;
  }
  html += `</table>`;
  tablaDiv.innerHTML = html;
}

// Calcula puntos y gross
function calcular() {
  const handicapJugador =
    parseInt(document.getElementById("handicap").value) || 0;

  const ventajas = [5,15,9,17,3,7,13,11,1,14,18,12,10,16,2,8,6,4];
  const pares = [4,5,3,4,4,4,3,5,4,4,3,4,5,4,4,3,4,5];

  let totalGross = 0;
  let totalPuntos = 0;

  const golpesBase = Math.floor(handicapJugador / 18);
  const golpesExtra = handicapJugador % 18;

  for (let i = 1; i <= 18; i++) {
    const inputPalos = document.getElementById("h" + i);
    const celdaPuntos = document.getElementById("p" + i);

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

  document.getElementById("resultado").innerHTML = `
    <strong>Palos Gross:</strong> ${totalGross}<br>
    <strong>Puntos Netos:</strong> ${totalPuntos}
  `;
}

// Llama a generar la tabla al cargar la página
window.onload = generarTabla;
