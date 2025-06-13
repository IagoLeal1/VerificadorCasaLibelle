document.getElementById('upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const resultados = json.filter(linha => {
      let valor = linha["Valor"];
      let convenio = linha["Convênio"];
      // Robustly get and normalize 'Status secundário' for consistent comparison
      let statusSecundario = linha["Status secundário"] ? String(linha["Status secundário"]).trim().toLowerCase() : ''; 

      // --- 1. PREPARATION AND BASIC CHECKS ---
      // Exclude rows if 'Valor' is missing or invalid
      if (valor === undefined || valor === null) {
        return false; 
      }
      let valorLimpo = String(valor)
        .replace(/[R$\s]/g, '')
        .replace(',', '.')
        .trim();
      let valorNumerico = parseFloat(valorLimpo);

      // If 'Valor' isn't a valid number, we can't process it correctly, so exclude.
      if (isNaN(valorNumerico)) {
        return false;
      }

      // --- 2. EXCLUSION RULES (These take highest priority) ---
      // If ANY of these conditions are true, the row is immediately EXCLUDED.

      // EXCLUSION A: Valor is 0 AND Convênio is "Isento"
      if (valorNumerico === 0 && convenio === "Isento") {
        return false; // Do NOT show
      }

      // EXCLUSION B: Valor is 0 AND Status secundário is "f terapeuta"
      if (valorNumerico === 0 && statusSecundario === "f terapeuta") {
        return false; // Do NOT show
      }

      // EXCLUSION C: Valor is 0 AND Status secundário is "fj paciente"
      if (valorNumerico === 0 && statusSecundario === "fj paciente") {
        return false; // Do NOT show
      }
      
      // --- 3. INCLUSION RULES (If the row passed all exclusions, now check if it should be included) ---
      // If ANY of these conditions are true, the row is INCLUDED.

      // INCLUSION A: Valor is 0 (and it wasn't excluded by "Isento", "F terapeuta", or "FJ Paciente")
      if (valorNumerico === 0) {
        return true; // Show (This covers "Valor 0" and "Convênio NOT Isento")
      }

      // INCLUSION B: Status secundário is "f terapeuta" (and it wasn't excluded by "Valor 0")
      if (statusSecundario === "f terapeuta") {
        return true; // Show (This covers "F terapeuta" with non-zero Valor)
      }

      // INCLUSION C: Status secundário is "fj paciente" (and it wasn't excluded by "Valor 0")
      if (statusSecundario === "fj paciente") {
        return true; // Show (This covers "FJ Paciente" with non-zero Valor)
      }

      // If none of the above inclusion rules are met, the row is not relevant
      return false; 
    });

    // --- DISPLAY RESULTS (remains the same) ---
    const output = document.getElementById('output');

    if (resultados.length === 0) {
      output.innerHTML = "<p>Nenhuma linha encontrada que atenda aos critérios definidos.</p>";
    } else {
      let colunas = new Set();
      resultados.forEach(linha => {
        Object.keys(linha).forEach(coluna => colunas.add(coluna));
      });

      colunas.add("Status secundário"); // Ensure the column is always present

      let html = "<table><tr>";
      for (let coluna of Array.from(colunas)) { 
        html += `<th>${coluna}</th>`;
      }
      html += "</tr>";

      for (let linha of resultados) {
        html += "<tr class='highlight'>";
        for (let coluna of Array.from(colunas)) {
          html += `<td>${linha[coluna] !== undefined ? linha[coluna] : ""}</td>`;
        }
        html += "</tr>";
      }

      html += "</table>";
      output.innerHTML = html;
    }
  };
  reader.readAsArrayBuffer(file);
});

document.getElementById('upload').addEventListener('change', function(e) {
  const fileName = e.target.files[0]?.name || "Nenhum arquivo selecionado";
  document.getElementById('file-name').textContent = fileName;
});