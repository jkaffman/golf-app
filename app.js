const canchas = {
  angostura: {
    nombre: "Angostura",
    pares: [4,5,3,4,4,4,3,5,4,4,3,4,5,4,4,3,4,5],
    ventajas: [5,15,9,17,3,7,13,11,1,14,18,12,10,16,2,8,6,4]
  },
  araucarias: {
    nombre: "Las Araucarias",
    pares: [4,3,5,4,4,4,4,3,4,5,3,4,5,3,4,4,4,4],
    ventajas: [7,15,11,9,1,17,3,13,5,10,18,16,14,12,4,8,2,6]
  }
};

let canchaActual = "angostura";

function generarTabla() {
  const tabla = document.getElementById("tabla");
  const thead = tabla.querySelector("thead");
  const tbody = tabla.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  const trHead = document.createElement("tr");
  trHead.innerHTML = "<th>Hoyo</th><th>Par</th><th>Vta</th>";

  for (let j = 1; j <= 4; j++) {
    const nombre = document.querySelector(`[name="nombre${j}"]`).value;
    trHead.innerHTML += `<th>${nombre}</th><th>Ptos</th>`;
  }

  thead.appendChild(trHead);

  for (let i = 1; i <= 18; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i}</td>
      <td>${canchas[canchaActual].pares[i-1]}</td>
      <td>${canchas[canchaActual].ventajas[i-1]}</td>
    `;

    for (let j = 1; j <= 4; j++) {
      tr.innerHTML += `
        <td><input type="number" id="h${j}_${i}"></td>
        <td id="p${j}_${i}"></td>
      `;
    }

    tbody.appendChild(tr);
  }
}

function actualizarNombres() {
  generarTabla();
}

function cambiarCancha() {
  canchaActual = document.getElementById("selectorCancha").value;
  generarTabla();
}

function calcular() {
  let salida = "";

  for (let j = 1; j <= 4; j++) {
    const nombre = document.querySelector(`[name="nombre${j}"]`).value;
    const hcp = parseInt(document.querySelector(`[name="handicap${j}"]`).value) || 0;

    let gross = 0;
    let puntos = 0;

    const base = Math.floor(hcp / 18);
    const extra = hcp % 18;

    for (let i = 1; i <= 18; i++) {
      const inp = document.getElementById(`h${j}_${i}`);
      const celda = document.getElementById(`p${j}_${i}`);
      const palos = parseInt(inp.value);

      if (isNaN(palos)) {
        celda.innerText = "";
        continue;
      }

      gross += palos;

      let vta = base;
      if (canchas[canchaActual].ventajas[i-1] <= extra) vta++;

      const neto = palos - vta;
      const diff = canchas[canchaActual].pares[i-1] - neto;

      let p = 0;
      if (diff >= 3) p = 5;
      else if (diff === 2) p = 4;
      else if (diff === 1) p = 3;
      else if (diff === 0) p = 2;
      else if (diff === -1) p = 1;

      celda.innerText = p;
      puntos += p;
    }

    salida += `${nombre}: Gross ${gross} – ${puntos} pts<br>`;
  }

  document.getElementById("resultado").innerHTML = salida;
}

function guardarTarjeta() {
  const fecha = new Date().toLocaleDateString("es-CL");
  const tabla = document.getElementById("tabla").outerHTML;
  const html = `
    <html>
    <head><meta charset="UTF-8"><title>Tarjeta de Golf</title></head>
    <body>
      <h2>Tarjeta – ${canchas[canchaActual].nombre}</h2>
      <p>Fecha: ${fecha}</p>
      ${tabla}
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `tarjeta_${fecha}.html`;
  a.click();
}

generarTabla();
