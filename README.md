# 📊 Verificador Casa Libelle de Planilhas da Amplimed

Este projeto é uma aplicação web simples feita em **HTML**, **CSS** e **JavaScript** que permite ao usuário importar uma planilha (`.xlsx`) e visualizar, em uma tabela organizada, as linhas em que a coluna **Valor** está preenchida com `0`, mesmo que formatada como moeda (ex: `R$ 0,00`).

## ✅ Funcionalidades

- 📂 Upload de arquivos `.xlsx` via botão customizado.
- 📄 Leitura e conversão automática da planilha para JSON.
- 🔍 Filtro inteligente que detecta valores zerados, mesmo formatados com "R$" ou vírgula.
- 📌 Exibição de colunas: `Profissional`, `Paciente`, `Procedimento`, `Valor`, `Status` e `Status secundário`.
- 🎨 Interface leve, estilizada e adaptável.
- 💬 Exibe o nome do arquivo carregado.

## 🧠 Tecnologias usadas

- HTML5
- CSS3
- JavaScript (ES6+)
- [SheetJS (xlsx)](https://sheetjs.com/) para leitura de planilhas

## ▶️ Como usar

1. Clone ou baixe este repositório.
2. Abra o arquivo `index.html` no seu navegador.
3. Clique em **"Escolher arquivo"** e selecione uma planilha `.xlsx` com as colunas esperadas.
4. Veja na tela as linhas onde a coluna **Valor** contém `0`.

## 🗂️ Estrutura esperada da planilha

A primeira aba da planilha deve conter as colunas:

| Profissional | Paciente | Procedimento | Valor | Status | Status secundário |
|--------------|----------|--------------|--------|--------|--------------------|
| João         | Ana      | Consulta     | R$ 0,00| Pago   | Aguardando envio  |

> **Nota:** A coluna "Status secundário" é opcional e será exibida apenas se presente.

## 💡 Personalização

Você pode modificar:
- A lógica de filtragem no arquivo `script.js`.
- Os estilos do botão e da tabela em `style.css`.
- O layout geral no `index.html`.

## 📦 Dependências

- **SheetJS** é carregado via CDN no `index.html`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
