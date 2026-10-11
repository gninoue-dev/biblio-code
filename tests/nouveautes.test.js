import { test } from "node:test";
import assert from "node:assert/strict";
import {
  identifiantUnique, codeAleatoire, jetonAleatoire, sha256,
  distanceLevenshtein, similarite, suggestions,
  formaterDuree, compteARebours,
  datePaques, joursFeries, estJourOuvre, ajouterJoursOuvres, joursOuvresEntre,
  ajouterAuPanier, modifierQuantite, retirerDuPanier, calculerPanier,
  creerFileHorsLigne, memoriserAsync, sparkline, barres,
  lienWhatsApp, lienTelegram, lienSms, lienEmail, creerParcours,
  uneSeuleFois, cleIdempotence,
  normaliserTelephoneCI, operateurCI, formaterTelephoneCI, telephoneInternationalCI,
  nombreEnLettres, montantEnLettres,
} from "../web/index.js";

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

test("crypto", async () => {
  assert.match(identifiantUnique(), /^[0-9a-f-]{36}$/);
  assert.match(codeAleatoire(6), /^\d{6}$/);
  assert.match(codeAleatoire(8, "AB"), /^[AB]{8}$/);
  assert.match(jetonAleatoire(), /^[A-Za-z0-9_-]{43}$/);
  assert.equal(await sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  // répartition sans biais grossier
  const compte = Array(10).fill(0);
  for (const c of codeAleatoire(20000)) compte[c]++;
  assert.ok(compte.every((n) => n > 1700 && n < 2300), compte.join(","));
});

test("recherche floue", () => {
  assert.equal(distanceLevenshtein("chat", "chats"), 1);
  assert.equal(distanceLevenshtein("kitten", "sitting"), 3);
  assert.equal(similarite("Koné", "kone"), 1);
  const villes = ["Abidjan", "Bouaké", "Yamoussoukro", "San-Pédro"];
  assert.equal(suggestions("abidjn", villes)[0].element, "Abidjan");
  assert.equal(suggestions("yamousokro", villes)[0].element, "Yamoussoukro");
  assert.deepEqual(suggestions("xyz", villes), []);
  assert.equal(suggestions("kone", [{ nom: "Awa Koné" }, { nom: "Yao" }], { cle: (c) => c.nom })[0].element.nom, "Awa Koné");
});

test("compte à rebours", async () => {
  assert.equal(formaterDuree(65000), "01:05");
  assert.equal(formaterDuree(3725000), "1:02:05");
  assert.equal(formaterDuree(-5), "00:00");
  let fini = false;
  const tics = [];
  compteARebours(120, { intervalle: 20, surTic: (r) => tics.push(r), surFin: () => (fini = true) });
  await attendre(200);
  assert.ok(fini);
  assert.equal(tics.at(-1), 0);
});

test("jours ouvrés", () => {
  assert.equal(datePaques(2026), "2026-04-05");
  assert.equal(datePaques(2025), "2025-04-20");
  assert.equal(datePaques(2027), "2027-03-28");
  const ci = joursFeries(2026, "CI");
  assert.ok(ci.includes("2026-04-06") && ci.includes("2026-05-14") && ci.includes("2026-05-25"));
  assert.ok(ci.includes("2026-08-07") && ci.includes("2026-11-15"));
  assert.ok(joursFeries(2026, "FR").includes("2026-07-14"));
  assert.ok(!estJourOuvre("2026-08-07"));
  assert.ok(!estJourOuvre("2026-10-11")); // dimanche
  assert.ok(estJourOuvre("2026-10-12"));
  assert.ok(!estJourOuvre("2026-03-20", { feriesEnPlus: ["2026-03-20"] }));
  assert.equal(ajouterJoursOuvres("2026-12-24", 1), "2026-12-28");
  assert.equal(ajouterJoursOuvres("2026-12-24", 2), "2026-12-29");
  assert.equal(ajouterJoursOuvres("2026-12-28", -1), "2026-12-24");
  assert.equal(joursOuvresEntre("2026-10-01", "2026-10-31"), 21);
});

test("panier", () => {
  let p = ajouterAuPanier([], { id: "a", prix: 15000 }, 2);
  p = ajouterAuPanier(p, { id: "a", prix: 15000 });
  p = ajouterAuPanier(p, { id: "b", prix: 2500 });
  assert.equal(p.find((l) => l.id === "a").quantite, 3);
  assert.equal(modifierQuantite(p, "b", 0).length, 1);
  assert.equal(retirerDuPanier(p, "a").length, 1);

  const r = calculerPanier(p, { remise: { type: "pourcentage", valeur: 10, minimum: 20000 }, livraison: 2000, livraisonGratuiteDes: 50000, tauxTva: 18 });
  assert.deepEqual(
    { n: r.nombreArticles, st: r.sousTotal, rem: r.remise, liv: r.livraison, tot: r.total, manque: r.manquePourLivraisonGratuite },
    { n: 4, st: 47500, rem: 4750, liv: 2000, tot: 44750, manque: 7250 }
  );
  assert.equal(r.dontTva, 44750 - Math.round(44750 / 1.18));
  assert.equal(calculerPanier(p, { remise: { type: "montant", valeur: 5000, minimum: 100000 } }).erreurRemise, "minimum");
  assert.equal(calculerPanier([], { livraison: 2000 }).total, 0);
  assert.equal(calculerPanier(p, { livraison: 2000, livraisonGratuiteDes: 40000 }).livraison, 0);
});

test("file hors ligne", async () => {
  const memoire = new Map();
  const stockage = { getItem: (k) => memoire.get(k) ?? null, setItem: (k, v) => memoire.set(k, v) };
  const envoyes = [];
  let reseau = false;
  const envoyer = async (d) => {
    if (d === "refus") throw Object.assign(new Error("400"), { definitive: true });
    if (!reseau) throw new Error("hors ligne");
    envoyes.push(d);
  };
  const file = creerFileHorsLigne({ envoyer, stockage });
  await file.ajouter("a");
  await file.ajouter("refus");
  assert.equal(file.enAttente(), 2);

  // la file survit à un rechargement de page
  const file2 = creerFileHorsLigne({ envoyer, stockage });
  assert.deepEqual(file2.elements(), ["a", "refus"]);
  reseau = true;
  await file2.vider();
  assert.deepEqual(envoyes, ["a"]);
  assert.equal(file2.enAttente(), 0, "l'action refusée définitivement est retirée");
});

test("cache de requêtes", async () => {
  let appels = 0;
  const lire = memoriserAsync(async (id) => (await attendre(10), `${id}-${++appels}`), { dureeMs: 50 });
  const [a, b] = await Promise.all([lire(1), lire(1)]);
  assert.equal(a, "1-1");
  assert.equal(b, "1-1", "requêtes simultanées dédoublonnées");
  assert.equal(await lire(1), "1-1");
  assert.equal(await lire(2), "2-2");
  await attendre(60);
  assert.equal(await lire(1), "1-3", "expiré → rechargé");
  lire.invalider(1);
  assert.equal(await lire(1), "1-4");

  let n = 0;
  const perime = memoriserAsync(async () => ++n, { dureeMs: 10, perime: true });
  assert.equal(await perime(), 1);
  await attendre(20);
  assert.equal(await perime(), 1, "valeur périmée renvoyée tout de suite");
  await attendre(5);
  assert.equal(await perime(), 2, "rafraîchie en arrière-plan");

  let essais = 0;
  const fragile = memoriserAsync(async () => { if (++essais === 1) throw new Error("x"); return "ok"; });
  await assert.rejects(fragile());
  assert.equal(await fragile(), "ok", "l'erreur n'est pas mise en cache");
});

test("graphiques", () => {
  const s = sparkline([1, 3, 2], { largeur: 100, hauteur: 20, epaisseur: 2 });
  assert.match(s, /points="2,18 50,2 98,10"/);
  const b = barres([{ libelle: "<Logement>", valeur: 100 }, { libelle: "Courses", valeur: 50 }]);
  assert.ok(b.includes("&lt;Logement&gt;") && !b.includes("<Logement>"));
  assert.equal((b.match(/<rect/g) || []).length, 2);
});

test("liens de partage", () => {
  assert.equal(lienWhatsApp("Bonjour & merci", "+225 07 07 12 34 56"), "https://wa.me/2250707123456?text=Bonjour%20%26%20merci");
  assert.equal(lienTelegram("https://x.ci", "Salut"), "https://t.me/share/url?url=https%3A%2F%2Fx.ci&text=Salut");
  assert.equal(lienSms("+225 07 07", "code 1"), "sms:+2250707?body=code%201");
  assert.equal(lienEmail("a@b.ci", { sujet: "Re: test", corps: "Bonjour" }), "mailto:a@b.ci?subject=Re%3A%20test&body=Bonjour");
});

test("parcours en étapes", () => {
  const p = creerParcours([
    { id: "identite", valider: (d) => (d.nom ? null : { nom: "obligatoire" }) },
    { id: "contact", valider: (d) => (d.tel ? null : { tel: "obligatoire" }) },
    { id: "fin" },
  ]);
  assert.deepEqual(p.suivant(), { ok: false, erreurs: { nom: "obligatoire" } });
  assert.equal(p.allerA("fin"), false, "pas de saut sans valider");
  p.modifier({ nom: "Awa" });
  assert.ok(p.suivant().ok);
  assert.equal(p.etape.id, "contact");
  assert.equal(p.progression, 0.5);
  p.precedent();
  assert.ok(p.allerA("contact"));
  p.modifier({ tel: "07" });
  p.suivant();
  assert.ok(p.estDerniere);
  p.modifier({ nom: "" });
  const fin = p.terminer();
  assert.equal(fin.ok, false);
  assert.equal(fin.etape, "identite", "revient à l'étape fautive");
});

test("une seule fois", async () => {
  let executions = 0;
  const payer = uneSeuleFois(async () => (await attendre(20), ++executions));
  const r = await Promise.all([payer(), payer(), payer()]);
  assert.deepEqual(r, [1, 1, 1]);
  assert.equal(await payer(), 2, "de nouveau possible après la fin");
  assert.notEqual(cleIdempotence(), cleIdempotence());
});

test("mobile money CI", () => {
  assert.equal(normaliserTelephoneCI("+225 07 07 12 34 56"), "0707123456");
  assert.equal(normaliserTelephoneCI("00225 0505123456"), "0505123456");
  assert.equal(normaliserTelephoneCI("2250101123456"), "0101123456");
  assert.equal(normaliserTelephoneCI("09 07 12 34 56"), null);
  assert.equal(normaliserTelephoneCI("07 07 12 34"), null);
  assert.deepEqual(operateurCI("07 07 12 34 56"), { operateur: "Orange", type: "mobile" });
  assert.deepEqual(operateurCI("0505123456"), { operateur: "MTN", type: "mobile" });
  assert.deepEqual(operateurCI("0101123456"), { operateur: "Moov Africa", type: "mobile" });
  assert.deepEqual(operateurCI("27 22 12 34 56"), { operateur: "Orange", type: "fixe" });
  assert.equal(formaterTelephoneCI("0707123456", { international: true }), "+225 07 07 12 34 56");
  assert.equal(telephoneInternationalCI("07.07.12.34.56"), "2250707123456");
});

test("nombres en lettres", () => {
  const cas = {
    0: "zéro", 1: "un", 16: "seize", 17: "dix-sept", 21: "vingt et un", 22: "vingt-deux",
    70: "soixante-dix", 71: "soixante et onze", 72: "soixante-douze", 80: "quatre-vingts",
    81: "quatre-vingt-un", 90: "quatre-vingt-dix", 91: "quatre-vingt-onze", 99: "quatre-vingt-dix-neuf",
    100: "cent", 101: "cent un", 180: "cent quatre-vingts", 200: "deux cents", 201: "deux cent un",
    1000: "mille", 1001: "mille un", 1234: "mille deux cent trente-quatre", 2000: "deux mille",
    80000: "quatre-vingt mille", 200000: "deux cent mille", 1000000: "un million",
    2000000: "deux millions", 200000000: "deux cents millions", 80000000: "quatre-vingts millions",
    1000000000: "un milliard", 1999999: "un million neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf",
  };
  for (const [n, attendu] of Object.entries(cas)) assert.equal(nombreEnLettres(Number(n)), attendu, `n = ${n}`);
  assert.throws(() => nombreEnLettres(1.5));
});

test("montants en lettres", () => {
  assert.equal(montantEnLettres(150000, "XOF"), "cent cinquante mille francs CFA");
  assert.equal(montantEnLettres(1, "XOF"), "un franc CFA");
  assert.equal(montantEnLettres(123456, "EUR"), "mille deux cent trente-quatre euros et cinquante-six centimes");
  assert.equal(montantEnLettres(101, "EUR"), "un euro et un centime");
  assert.equal(montantEnLettres(100000000, "EUR"), "un million d'euros");
  assert.equal(montantEnLettres(2000000000, "XOF"), "deux milliards de francs CFA");
  assert.equal(montantEnLettres(-500, "EUR"), "moins cinq euros");
});
