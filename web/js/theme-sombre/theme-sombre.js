// Thème clair/sombre mémorisé ; par défaut, suit la préférence du système.
const CLE = "theme";

export function initTheme() {
  const sauve = localStorage.getItem(CLE);
  const systeme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = sauve ?? systeme;
}

export function basculerTheme() {
  const nouveau = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nouveau;
  localStorage.setItem(CLE, nouveau);
  return nouveau;
}
