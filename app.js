function calcular() {
  const handicapJugador =
    parseInt(document.getElementById("handicap").value) || 0;

  // Ventajas reales por hoyo (Angostura)
  const ventajas = [
    5, 15, 9, 17, 3, 7, 13, 11, 1,
    14, 18, 12, 10, 16, 2, 8, 6, 4
  ];

  // Par por hoyo (ajusta si tu cancha es distinta)
  const pares = [
    4, 5, 3, 4, 4, 4, 3, 5, 4,
    4, 3, 4, 5, 4, 4, 3, 4, 5
  ];

  let totalGross = 0;
  let totalPuntos = 0;

  // Reparto del hándicap
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

    // Suma gross
    totalGross += palos;

    // Golpes de ventaja en este hoyo
    let ventajaHoyo = golpesBase;
    if (ventajas[i - 1] <= golpesExtra) {
      ventajaHoyo++;
    }

    // Neto
    const neto = palos - ventajaHoyo;

    // Diferencia contra par
    const diferencia = pares[i - 1] - neto;

    // Stableford
    let puntos = 0;
    if (diferencia >= 3) puntos = 5;        // Albatross
    else if (diferencia === 2) puntos = 4;  // Eagle
    else if (diferencia === 1) puntos = 3;  // Birdie
    else if (diferencia === 0) puntos = 2;  // Par
    else if (diferencia === -1) puntos = 1; // Bogey
    else puntos = 0;

    celdaPuntos.innerText = puntos;
    totalPuntos += puntos;
  }

  // Mostrar resultados finales
  document.getElementById("resultado").innerHTML = `
    <strong>Palos Gross:</strong> ${totalGross}<br>
    <strong>Puntos Netos:</strong> ${totalPuntos}
  `;
}
