import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decimalesDevise, versUnitesMineures, formaterMontant, repartir, appliquerTaux,
  validerIban, formaterIban, validerBic,
  validerLuhn, detecterReseau, formaterNumeroCarte, validerExpiration, validerCvc,
  masquer, masquerEmail,
  soldeTransactions, totauxParCategorie, regrouperParMois, filtrerTransactions, exporterCsv,
  mensualite, tableauAmortissement,
  convertir, PARITE_FCFA,
} from "../web/index.js";

const nbsp = (s) => s.replace(/[  ]/g, " ");

test("argent : décimales par devise", () => {
  assert.equal(decimalesDevise("EUR"), 2);
  assert.equal(decimalesDevise("XOF"), 0);
  assert.equal(decimalesDevise("TND"), 3);
});

test("argent : saisie → unités mineures", () => {
  assert.equal(versUnitesMineures("1 234,56"), 123456);
  assert.equal(versUnitesMineures("1,234.56"), 123456);
  assert.equal(versUnitesMineures("1.234"), 123400);
  assert.equal(versUnitesMineures("12,5"), 1250);
  assert.equal(versUnitesMineures("-8,20 €"), -820);
  assert.equal(versUnitesMineures("150 000", "XOF"), 150000);
  assert.equal(versUnitesMineures("1.500", "XOF"), 1500);
  assert.throws(() => versUnitesMineures("1234.567"));
  assert.throws(() => versUnitesMineures("abc"));
  assert.throws(() => versUnitesMineures("1500,5", "XOF"));
});

test("argent : formatage", () => {
  assert.equal(nbsp(formaterMontant(123456, "EUR")), "1 234,56 €");
  assert.equal(nbsp(formaterMontant(150000, "XOF")), "150 000 F CFA");
});

test("argent : répartition sans perte", () => {
  assert.deepEqual(repartir(1000, 3), [334, 333, 333]);
  assert.deepEqual(repartir(1000, [70, 30]), [700, 300]);
  assert.deepEqual(repartir(-1000, 3), [-334, -333, -333]);
  assert.equal(repartir(99999, 7).reduce((a, b) => a + b), 99999);
  assert.equal(appliquerTaux(250000, 1.5), 3750);
  assert.equal(appliquerTaux(-250, 10), -25);
});

test("iban", () => {
  assert.ok(validerIban("FR76 3000 6000 0112 3456 7890 189"));
  assert.ok(validerIban("DE89370400440532013000"));
  assert.ok(validerIban("gb82 west 1234 5698 7654 32"));
  assert.ok(!validerIban("FR76 3000 6000 0112 3456 7890 188"));
  assert.ok(!validerIban("FR76 3000 6000 0112 3456 7890 18"));
  assert.equal(formaterIban("fr7630006000011234567890189"), "FR76 3000 6000 0112 3456 7890 189");
  assert.ok(validerBic("BNPAFRPP"));
  assert.ok(validerBic("SGCICIAB XXX".replace(" ", "")));
  assert.ok(!validerBic("BNP"));
});

test("carte bancaire", () => {
  assert.ok(validerLuhn("4111 1111 1111 1111"));
  assert.ok(validerLuhn("5555555555554444"));
  assert.ok(!validerLuhn("4111 1111 1111 1112"));
  assert.equal(detecterReseau("4111"), "visa");
  assert.equal(detecterReseau("5555"), "mastercard");
  assert.equal(detecterReseau("2221 00"), "mastercard");
  assert.equal(detecterReseau("3782"), "amex");
  assert.equal(formaterNumeroCarte("4111111111111111"), "4111 1111 1111 1111");
  assert.equal(formaterNumeroCarte("378282246310005"), "3782 822463 10005");
  const oct2026 = new Date(2026, 9, 11);
  assert.ok(validerExpiration("10/26", oct2026));
  assert.ok(!validerExpiration("09/26", oct2026));
  assert.ok(validerExpiration("01/2030", oct2026));
  assert.ok(!validerExpiration("13/27", oct2026));
  assert.ok(validerCvc("123", "visa"));
  assert.ok(validerCvc("1234", "amex"));
  assert.ok(!validerCvc("123", "amex"));
});

test("masquage", () => {
  assert.equal(masquer("4111 1111 1111 1111"), "•••• •••• •••• 1111");
  assert.equal(masquer("07 07 12 34 56", { visibles: 2 }), "•• •• •• •• 56");
  assert.equal(masquerEmail("awa.kone@mail.com"), "a•••••••@mail.com");
});

const transactions = [
  { date: "2026-09-28", libelle: "Loyer", montant: -150000, categorie: "logement" },
  { date: "2026-10-01", libelle: "Salaire", montant: 450000, categorie: "revenus" },
  { date: "2026-10-03", libelle: "Supermarché", montant: -23500, categorie: "courses" },
  { date: "2026-10-05", libelle: "=HYPERLINK(\"x\")", montant: -1000, categorie: "courses" },
];

test("transactions : solde, totaux, mois", () => {
  assert.equal(soldeTransactions(transactions, 10000), 285500);
  assert.deepEqual(totauxParCategorie(transactions).courses, { debits: -24500, credits: 0, nombre: 2 });
  assert.deepEqual([...regrouperParMois(transactions).keys()], ["2026-10", "2026-09"]);
});

test("transactions : filtres", () => {
  assert.equal(filtrerTransactions(transactions, { du: "2026-10-01" }).length, 3);
  assert.equal(filtrerTransactions(transactions, { type: "credit" }).length, 1);
  assert.equal(filtrerTransactions(transactions, { min: 20000, max: 200000 }).length, 2);
  assert.equal(filtrerTransactions(transactions, { recherche: "SUPER" })[0].libelle, "Supermarché");
});

test("transactions : export CSV protégé", () => {
  const csv = exporterCsv(transactions, { decimales: 0 });
  assert.ok(csv.startsWith("﻿Date;Libellé;Catégorie;Montant"));
  assert.ok(csv.includes("2026-10-01;Salaire;revenus;450000"));
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`), "la formule doit être neutralisée");
  assert.ok(exporterCsv([{ date: "2026-10-01", libelle: "a", montant: -820 }]).includes(";-8,20"));
});

test("prêt", () => {
  assert.equal(mensualite(10_000_000, 3.5, 240), 57996);
  assert.equal(mensualite(120000, 0, 12), 10000);
  const tableau = tableauAmortissement(10_000_000, 3.5, 240);
  assert.equal(tableau.length, 240);
  assert.equal(tableau.at(-1).restant, 0);
  assert.equal(tableau.reduce((s, l) => s + l.principal, 0), 10_000_000);
});

test("devises", () => {
  assert.equal(convertir(10000, "EUR", "XOF", PARITE_FCFA), 65596);
  assert.equal(convertir(65596, "XOF", "EUR", PARITE_FCFA), 10000);
  assert.throws(() => convertir(1, "EUR", "JPY", PARITE_FCFA));
});
