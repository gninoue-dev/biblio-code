import { test, mock } from "node:test";
import assert from "node:assert/strict";
import {
  debounce, throttle, stockage, dateRelative, formaterDate, slugifier, tronquer, echapperHtml,
  valider, validerFormulaire, forceMotDePasse,
  paginer, numerosPages, rechercher, trierPar, correspondreRoute, creerStore, creerI18n,
  creerClientApi, fetchJson,
} from "../web/index.js";

test("debounce / throttle", async () => {
  let n = 0;
  const d = debounce(() => n++, 20);
  d(); d(); d();
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(n, 1);

  let t = 0;
  const th = throttle(() => t++, 50);
  th(); th(); th();
  assert.equal(t, 1);
  await new Promise((r) => setTimeout(r, 70));
  assert.equal(t, 2, "le dernier appel n'est pas perdu");
});

test("stockage avec expiration", () => {
  const donnees = new Map();
  globalThis.localStorage = {
    getItem: (k) => (donnees.has(k) ? donnees.get(k) : null),
    setItem: (k, v) => donnees.set(k, v),
    removeItem: (k) => donnees.delete(k),
  };
  stockage.ecrire("a", { x: 1 });
  assert.deepEqual(stockage.lire("a"), { x: 1 });
  stockage.ecrire("b", 1, -1);
  assert.equal(stockage.lire("b", "défaut"), "défaut");
  donnees.set("c", "{pas du json");
  assert.equal(stockage.lire("c", 0), 0);
  delete globalThis.localStorage;
  assert.equal(stockage.lire("a", "sans storage"), "sans storage");
});

test("dates", () => {
  const maintenant = new Date("2026-10-11T12:00:00Z");
  assert.equal(dateRelative("2026-10-11T09:00:00Z", { maintenant }), "il y a 3 heures");
  assert.equal(dateRelative("2026-10-10T12:00:00Z", { maintenant }), "hier");
  assert.equal(formaterDate("2026-10-11T12:00:00Z"), "11 octobre 2026");
});

test("texte", () => {
  assert.equal(slugifier("Été à Abidjan !"), "ete-a-abidjan");
  assert.equal(tronquer("abcdefghij", 5), "abcd…");
  assert.equal(echapperHtml(`<img src=x onerror="alert('x')">`), "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;");
});

test("validation", () => {
  assert.ok(valider.email("awa@mail.ci"));
  assert.ok(!valider.email("awa@mail"));
  assert.ok(valider.telephoneCI("07 07 12 34 56"));
  assert.ok(valider.telephoneCI("+225 0707123456"));
  assert.ok(!valider.telephoneCI("09 07 12 34 56"));
  assert.ok(valider.telephoneFR("06 12 34 56 78"));
  assert.ok(valider.telephoneInternational("+225 07 07 12 34 56"));
  assert.ok(valider.url("https://exemple.com"));
  assert.ok(!valider.url("javascript:alert(1)"));
  const r = validerFormulaire(
    { email: "", mdp: "court" },
    { email: [[valider.nonVide, "obligatoire"], [valider.email, "invalide"]], mdp: [[valider.longueurMin(12), "trop court"]] }
  );
  assert.deepEqual(r, { valide: false, erreurs: { email: "obligatoire", mdp: "trop court" } });
});

test("force du mot de passe", () => {
  assert.equal(forceMotDePasse("abc").score, 1);
  assert.equal(forceMotDePasse("MotDePasse!2026").niveau, "très fort");
  assert.ok(forceMotDePasse("aaaaaaaaaaaaA1!").score < 5);
});

test("pagination", () => {
  const liste = Array.from({ length: 95 }, (_, i) => i);
  const p = paginer(liste, 10, 10);
  assert.deepEqual([p.page, p.totalPages, p.elements.length, p.suivante], [10, 10, 5, null]);
  assert.equal(paginer(liste, 99).page, 10);
  assert.deepEqual(numerosPages(5, 20), [1, "…", 4, 5, 6, "…", 20]);
  assert.deepEqual(numerosPages(1, 3), [1, 2, 3]);
});

test("recherche et tri", () => {
  const clients = [{ nom: "Koné", solde: 5 }, { nom: "Bamba", solde: 50 }, { nom: "client 10", solde: 1 }, { nom: "client 2", solde: 2 }];
  assert.equal(rechercher(clients, "kone", ["nom"])[0].nom, "Koné");
  assert.deepEqual(trierPar(clients, "nom").map((c) => c.nom), ["Bamba", "client 2", "client 10", "Koné"]);
  assert.equal(trierPar(clients, "solde", "desc")[0].nom, "Bamba");
});

test("routeur", () => {
  assert.deepEqual(correspondreRoute("/comptes/:id", "/comptes/42"), { id: "42" });
  assert.deepEqual(correspondreRoute("/a/:x/b/:y", "/a/1/b/deux%20mots/"), { x: "1", y: "deux mots" });
  assert.equal(correspondreRoute("/comptes/:id", "/comptes"), null);
  assert.equal(correspondreRoute("/v1.0", "/v1x0"), null);
});

test("store", () => {
  const store = creerStore({ panier: [] });
  const vus = [];
  const desabonner = store.abonner((e) => vus.push(e.panier.length));
  store.modifier((e) => ({ ...e, panier: [...e.panier, "a"] }));
  store.modifier({ utilisateur: "Awa" });
  desabonner();
  store.modifier({ panier: [] });
  assert.deepEqual(vus, [1, 1]);
  assert.equal(store.lire().utilisateur, "Awa");
});

test("i18n", () => {
  const i18n = creerI18n({ fr: { bonjour: "Bonjour {nom}", seul: "FR" }, en: { bonjour: "Hello {nom}" } });
  assert.equal(i18n.t("bonjour", { nom: "Awa" }), "Bonjour Awa");
  i18n.changerLangue("en");
  assert.equal(i18n.t("bonjour", { nom: "Awa" }), "Hello Awa");
  assert.equal(i18n.t("seul"), "FR");
  assert.equal(i18n.t("inconnue"), "inconnue");
});

const reponse = (status, corps) => ({ ok: status < 400, status, json: async () => corps });

test("client API : renouvelle le jeton une seule fois sur 401", async () => {
  let jeton = "ancien";
  let renouvellements = 0;
  const fetchMock = mock.method(globalThis, "fetch", async (url, options) =>
    options.headers.Authorization === "Bearer neuf" ? reponse(200, { url }) : reponse(401, {})
  );
  const api = creerClientApi({
    baseUrl: "https://api.test",
    lireJeton: () => jeton,
    rafraichirJeton: async () => {
      renouvellements++;
      jeton = "neuf";
      return true;
    },
  });
  const resultats = await Promise.all([api.get("/a"), api.get("/b")]);
  assert.deepEqual(resultats.map((r) => r.url), ["https://api.test/a", "https://api.test/b"]);
  assert.equal(renouvellements, 1);
  fetchMock.mock.restore();
});

test("client API : déconnexion si le renouvellement échoue", async () => {
  let deconnecte = false;
  const fetchMock = mock.method(globalThis, "fetch", async () => reponse(401, { message: "expiré" }));
  const api = creerClientApi({ rafraichirJeton: async () => false, surDeconnexion: () => (deconnecte = true) });
  await assert.rejects(api.post("/x", { a: 1 }), (e) => e.status === 401 && e.donnees.message === "expiré");
  assert.ok(deconnecte);
  fetchMock.mock.restore();
});

test("fetchJson : réessaie sur erreur serveur, pas sur 404", async () => {
  let appels = 0;
  let fetchMock = mock.method(globalThis, "fetch", async () => (++appels < 2 ? reponse(503, {}) : reponse(200, { ok: 1 })));
  assert.deepEqual(await fetchJson("/x", { essais: 3 }), { ok: 1 });
  assert.equal(appels, 2);
  fetchMock.mock.restore();

  appels = 0;
  fetchMock = mock.method(globalThis, "fetch", async () => (appels++, reponse(404, {})));
  await assert.rejects(fetchJson("/x", { essais: 3 }), (e) => e.status === 404);
  assert.equal(appels, 1);
  fetchMock.mock.restore();
});
