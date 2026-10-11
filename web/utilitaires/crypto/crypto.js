// Aléatoire sûr et empreintes, avec l'API Web Crypto (navigateur et Node 18+).
// Ne jamais utiliser Math.random() pour un code, un jeton ou un identifiant sensible.

export function identifiantUnique() {
  return crypto.randomUUID();
}

// Code aléatoire sans biais : codeAleatoire(6) → "048213"
export function codeAleatoire(longueur = 6, alphabet = "0123456789") {
  const limite = 256 - (256 % alphabet.length); // rejette les octets qui biaiseraient le tirage
  let code = "";
  while (code.length < longueur) {
    for (const octet of crypto.getRandomValues(new Uint8Array(longueur * 2))) {
      if (octet < limite) code += alphabet[octet % alphabet.length];
      if (code.length === longueur) break;
    }
  }
  return code;
}

// Jeton aléatoire encodé en base64url (liens d'invitation, jetons de session…)
export function jetonAleatoire(octets = 32) {
  const binaire = String.fromCharCode(...crypto.getRandomValues(new Uint8Array(octets)));
  return btoa(binaire).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Empreinte SHA-256 en hexadécimal
export async function sha256(texte) {
  const empreinte = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texte));
  return [...new Uint8Array(empreinte)].map((o) => o.toString(16).padStart(2, "0")).join("");
}
