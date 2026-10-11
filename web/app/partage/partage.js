// Partage natif du téléphone, avec repli sur la copie. Liens directs WhatsApp, Telegram, SMS, email.

// Renvoie "partage", "copie" ou "annule"
export async function partager({ titre, texte, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title: titre, text: texte, url });
      return "partage";
    } catch (erreur) {
      if (erreur.name === "AbortError") return "annule";
    }
  }
  await navigator.clipboard.writeText([texte, url].filter(Boolean).join(" "));
  return "copie";
}

const chiffres = (numero) => String(numero ?? "").replace(/\D/g, "");

// numero au format international sans + : "2250707123456". Sans numéro : l'utilisateur choisit le contact.
export function lienWhatsApp(texte, numero) {
  return `https://wa.me/${chiffres(numero)}?text=${encodeURIComponent(texte)}`;
}

export function lienTelegram(url, texte = "") {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texte)}`;
}

export function lienSms(numero, texte) {
  return `sms:${String(numero).replace(/[^\d+]/g, "")}?body=${encodeURIComponent(texte)}`;
}

export function lienEmail(destinataire, { sujet = "", corps = "" } = {}) {
  const params = new URLSearchParams({ subject: sujet, body: corps }).toString().replace(/\+/g, "%20");
  return `mailto:${destinataire}?${params}`;
}
