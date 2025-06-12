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

      if (valor === undefined || valor === null) return false;

      let valorLimpo = String(valor)
        .replace(/[R$\s]/g, '')
        .replace(',', '.')
        .trim();

      let valorNumerico = parseFloat(valorLimpo);

      return !isNaN(valorNumerico) && valorNumerico === 0;
    });

    const output = document.getElementById('output');

    if (resultados.length === 0) {
      output.innerHTML = "<p>Nenhuma linha com valor igual a 0 encontrada.</p>";
    } else {
      let colunas = new Set();
      resultados.forEach(linha => {
        Object.keys(linha).forEach(coluna => colunas.add(coluna));
      });

      colunas.add("Status secundário"); // Garante a presença da nova coluna

      let html = "<table><tr>";
      for (let coluna of colunas) {
        html += `<th>${coluna}</th>`;
      }
      html += "</tr>";

      for (let linha of resultados) {
        html += "<tr class='highlight'>";
        for (let coluna of colunas) {
          html += `<td>${linha[coluna] || ""}</td>`;
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
