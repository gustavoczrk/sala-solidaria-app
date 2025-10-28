/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      // ADICIONE A SEÇÃO DE CORES ABAIXO
      colors: {
        'gunmetal': '#2D3142',    // Cor escura para texto principal
        'paynes-gray': '#4F5D75', // Cor secundária para texto/bordas
        'coral': '#EF8354',      // Cor vibrante para botões/destaques
        'koppel': '#58B09C',      // Cor secundária/calma
        'nyanza': '#CAF7E2',      // Cor clara para fundos sutis
      },
    },
  },
  plugins: [],
}