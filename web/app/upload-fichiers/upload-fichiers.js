// Zone de glisser-déposer (+ clic) avec contrôle du type et de la taille des fichiers.
export function zoneDepot(zone, { accepter = [], tailleMaxMo = 5, multiple = true, surFichiers, surErreur } = {}) {
  const input = Object.assign(document.createElement("input"), { type: "file", multiple, hidden: true });
  if (accepter.length) input.accept = accepter.join(",");
  document.body.append(input);

  const typeAccepte = (f) =>
    !accepter.length ||
    accepter.some((t) =>
      t.endsWith("/*") ? f.type.startsWith(t.slice(0, -1)) : f.type === t || f.name.toLowerCase().endsWith(t)
    );

  const traiter = (liste) => {
    const valides = [];
    for (const f of [...liste].slice(0, multiple ? undefined : 1)) {
      if (!typeAccepte(f)) surErreur?.(`${f.name} : type de fichier non autorisé`);
      else if (f.size > tailleMaxMo * 1024 * 1024) surErreur?.(`${f.name} : dépasse ${tailleMaxMo} Mo`);
      else valides.push(f);
    }
    if (valides.length) surFichiers?.(valides);
  };

  zone.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    traiter(input.files);
    input.value = "";
  });
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("survol");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("survol"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("survol");
    traiter(e.dataTransfer.files);
  });
}

// URL temporaire pour afficher une image avant envoi : <img src=...>
export function apercuImage(fichier) {
  return URL.createObjectURL(fichier);
}
