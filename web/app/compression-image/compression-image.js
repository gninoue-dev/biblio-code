// Réduit une photo avant envoi (une photo de téléphone de 5 Mo passe souvent à environ 300 Ko).
// Respecte l'orientation EXIF. Renvoie le fichier d'origine si la compression ne gagne rien.
export async function compresserImage(fichier, { largeurMax = 1600, hauteurMax = 1600, qualite = 0.8, type = "image/jpeg" } = {}) {
  const image = await createImageBitmap(fichier, { imageOrientation: "from-image" });
  const echelle = Math.min(1, largeurMax / image.width, hauteurMax / image.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * echelle);
  canvas.height = Math.round(image.height * echelle);
  const ctx = canvas.getContext("2d");
  if (type === "image/jpeg") {
    ctx.fillStyle = "#fff"; // le JPEG n'a pas de transparence
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const blob = await new Promise((resoudre) => canvas.toBlob(resoudre, type, qualite));
  if (!blob || (blob.size >= fichier.size && echelle === 1)) return fichier;
  const extension = { "image/jpeg": ".jpg", "image/webp": ".webp", "image/png": ".png" }[type] ?? "";
  return new File([blob], fichier.name.replace(/\.[^.]+$/, "") + extension, { type });
}
