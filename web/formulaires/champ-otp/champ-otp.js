// Transforme les <input> d'un conteneur en champ de code à usage unique (code SMS, 2FA).
// Gère : passage automatique à la case suivante, retour arrière, collage, remplissage auto du SMS.
export function champOtp(conteneur, { surComplet } = {}) {
  const cases = [...conteneur.querySelectorAll("input")];
  const valeur = () => cases.map((c) => c.value).join("");
  const verifierComplet = () => {
    if (valeur().length === cases.length) surComplet?.(valeur());
  };

  const remplir = (debut, chiffres) => {
    [...chiffres].slice(0, cases.length - debut).forEach((c, j) => (cases[debut + j].value = c));
    cases[Math.min(debut + chiffres.length, cases.length - 1)].focus();
  };

  cases.forEach((input, i) => {
    input.inputMode = "numeric";
    input.autocomplete = i === 0 ? "one-time-code" : "off";
    input.setAttribute("aria-label", `Chiffre ${i + 1} sur ${cases.length}`);

    input.addEventListener("input", () => {
      const chiffres = input.value.replace(/\D/g, "");
      if (chiffres.length > 1) {
        remplir(i, chiffres);
      } else {
        input.value = chiffres;
        if (chiffres && i < cases.length - 1) cases[i + 1].focus();
      }
      verifierComplet();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && i > 0) cases[i - 1].focus();
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      remplir(i, e.clipboardData.getData("text").replace(/\D/g, ""));
      verifierComplet();
    });
  });

  return {
    valeur,
    vider() {
      cases.forEach((c) => (c.value = ""));
      cases[0].focus();
    },
  };
}
