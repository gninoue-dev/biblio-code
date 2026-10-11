"""Tests des modules Python. Lancer : python3 -m unittest discover -s tests/python"""
import asyncio
import importlib.util
import io
import json
import logging
import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

RACINE = Path(__file__).resolve().parents[2] / "python"


def charger(dossier, fichier):
    spec = importlib.util.spec_from_file_location(fichier, RACINE / dossier / f"{fichier}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


reessayer = charger("reessayer", "reessayer")
journal = charger("journal", "journal")
config_env = charger("config-env", "config_env")
telegram = charger("notification-telegram", "notification_telegram")
limiteur = charger("limiteur-debit", "limiteur_debit")
ind = charger("indicateurs", "indicateurs")
risque = charger("gestion-risque", "gestion_risque")


class TestReessayer(unittest.TestCase):
    def test_reussit_apres_echecs(self):
        appels = []

        @reessayer.reessayer(essais=3, attente=0.001, alea=False)
        def fragile():
            appels.append(1)
            if len(appels) < 3:
                raise ConnectionError("coupure")
            return "ok"

        self.assertEqual(fragile(), "ok")
        self.assertEqual(len(appels), 3)

    def test_abandonne_et_relance_erreur(self):
        @reessayer.reessayer(essais=2, attente=0.001)
        def toujours_ko():
            raise TimeoutError("trop long")

        with self.assertRaises(TimeoutError):
            toujours_ko()

    def test_ne_reessaie_pas_les_autres_exceptions(self):
        appels = []

        @reessayer.reessayer(essais=5, attente=0.001, exceptions=(ConnectionError,))
        def mauvaise_donnee():
            appels.append(1)
            raise ValueError("bug")

        with self.assertRaises(ValueError):
            mauvaise_donnee()
        self.assertEqual(len(appels), 1)

    def test_async(self):
        appels = []

        @reessayer.reessayer(essais=3, attente=0.001)
        async def fragile():
            appels.append(1)
            if len(appels) < 2:
                raise ConnectionError()
            return 42

        self.assertEqual(asyncio.run(fragile()), 42)


class TestJournal(unittest.TestCase):
    def test_fichier_et_pas_de_doublon(self):
        with tempfile.TemporaryDirectory() as d:
            chemin = Path(d) / "logs" / "bot.log"
            log = journal.configurer_journal("test_bot", fichier=chemin)
            journal.configurer_journal("test_bot", fichier=chemin)
            self.assertEqual(len(log.handlers), 2)
            log.info("bonjour")
            for h in log.handlers:
                h.flush()
            self.assertIn("INFO    | test_bot | bonjour", chemin.read_text(encoding="utf-8"))
            for h in list(log.handlers):
                h.close()
                log.removeHandler(h)


class TestConfigEnv(unittest.TestCase):
    def test_lecture_et_types(self):
        with tempfile.TemporaryDirectory() as d:
            env = Path(d) / ".env"
            env.write_text('# commentaire\nexport JETON_T="12:AB # pas un commentaire"\nRISQUE_T=1.5  # risque\nDEMO_T=oui\nVIDE_T=\n', encoding="utf-8")
            with mock.patch.dict(os.environ, {"DEMO_T": "non"}, clear=False):
                lues = config_env.charger_env(env)
                self.assertEqual(lues["JETON_T"], "12:AB # pas un commentaire")
                self.assertEqual(config_env.lire_env("RISQUE_T", type_=float), 1.5)
                self.assertFalse(config_env.lire_env("DEMO_T", type_=bool), "la variable existante n'est pas écrasée")
                self.assertEqual(config_env.lire_env("ABSENTE_T", 7, int), 7)
                with self.assertRaises(RuntimeError):
                    config_env.lire_env("ABSENTE_T", obligatoire=True)
                with self.assertRaises(ValueError):
                    config_env.lire_env("JETON_T", type_=int)
                for cle in ("JETON_T", "RISQUE_T", "VIDE_T"):
                    os.environ.pop(cle, None)


class TestTelegram(unittest.TestCase):
    def test_decoupage(self):
        texte = "\n".join(f"ligne {i:04d}" for i in range(1000))
        morceaux = telegram.decouper(texte)
        self.assertTrue(all(len(m) <= 4096 for m in morceaux))
        self.assertEqual("\n".join(morceaux), texte)
        self.assertEqual(telegram.decouper("x" * 5000), ["x" * 4096, "x" * 904])

    def test_envoi(self):
        envoyes = []

        class Reponse(io.BytesIO):
            def __enter__(self):
                return self

            def __exit__(self, *a):
                return False

        def faux_urlopen(requete, timeout):
            envoyes.append((requete.full_url, requete.data.decode()))
            return Reponse(json.dumps({"ok": True}).encode())

        with mock.patch.object(telegram.urllib.request, "urlopen", faux_urlopen):
            self.assertTrue(telegram.envoyer_telegram("<b>Achat</b>", "JETON", 42))
        self.assertEqual(envoyes[0][0], "https://api.telegram.org/botJETON/sendMessage")
        self.assertIn("parse_mode=HTML", envoyes[0][1])

        def erreur_reseau(requete, timeout):
            raise telegram.urllib.error.URLError("hors ligne")

        with mock.patch.object(telegram.urllib.request, "urlopen", erreur_reseau):
            self.assertFalse(telegram.envoyer_telegram("x", "J", 1), "pas d'exception, renvoie False")


class TestLimiteur(unittest.TestCase):
    def test_fenetre_glissante(self):
        t = [0.0]
        pauses = []

        def dormir(s):
            pauses.append(round(s, 3))
            t[0] += s

        lim = limiteur.LimiteurDebit(3, 1.0, horloge=lambda: t[0], dormir=dormir)
        for _ in range(3):
            self.assertEqual(lim.acquerir(), 0.0)
        t[0] = 0.4
        self.assertAlmostEqual(lim.acquerir(), 0.6)
        self.assertEqual(pauses, [0.6])
        with lim:
            pass


class TestIndicateurs(unittest.TestCase):
    # Exemple de référence StockCharts pour le RSI(14)
    CLOTURES = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61, 46.28,
                46.28, 46.00, 46.03, 46.41, 46.22, 45.64, 46.21, 46.25, 45.71, 46.45, 45.78, 45.35, 44.03, 44.18,
                44.22, 44.57, 43.42, 42.66, 43.13]

    def test_sma_ema(self):
        self.assertEqual(ind.sma([1, 2, 3, 4], 2), [None, 1.5, 2.5, 3.5])
        e = ind.ema([1, 2, 3, 4, 5], 3)
        self.assertEqual(e[:2], [None, None])
        self.assertAlmostEqual(e[2], 2.0)
        self.assertAlmostEqual(e[3], 3.0)
        self.assertAlmostEqual(e[4], 4.0)

    def test_rsi_reference(self):
        r = ind.rsi(self.CLOTURES, 14)
        self.assertIsNone(r[13])
        self.assertAlmostEqual(r[14], 70.46, delta=0.1)
        self.assertAlmostEqual(r[-1], 37.79, delta=0.1)
        self.assertEqual(ind.rsi(list(range(20)), 14)[-1], 100.0)
        self.assertEqual(ind.rsi(list(range(20, 0, -1)), 14)[-1], 0.0)

    def test_atr(self):
        hauts, bas, clot = [10, 11, 12, 13], [8, 9, 10, 9], [9, 10, 11, 12]
        a = ind.atr(hauts, bas, clot, 2)
        self.assertEqual(a[0], None)
        self.assertAlmostEqual(a[1], 2.0)   # moyenne de 2 et 2
        self.assertAlmostEqual(a[3], (2.0 * 1 + 4) / 2)  # vrai range = 13-9 = 4 (après 2.0)

    def test_bollinger_macd(self):
        milieu, haut, bas = ind.bandes_bollinger([2, 4, 4, 4, 5, 5, 7, 9], periode=8)
        self.assertAlmostEqual(milieu[-1], 5.0)
        self.assertAlmostEqual(haut[-1], 9.0)  # écart-type 2
        self.assertAlmostEqual(bas[-1], 1.0)
        valeurs = [float(i) for i in range(60)]
        m, s, h = ind.macd(valeurs)
        self.assertIsNone(m[24])
        self.assertIsNotNone(s[-1])
        self.assertAlmostEqual(h[-1], 0.0, places=6)  # tendance parfaitement linéaire


class TestRisque(unittest.TestCase):
    def test_taille_position_or(self):
        lots = risque.taille_position(10_000, 1, 2041.5, 2035.2, valeur_par_point=100, pas=0.01, taille_min=0.01)
        self.assertEqual(lots, 0.15)
        self.assertLessEqual(risque.perte_si_stop(lots, 2041.5, 2035.2, 100), 100)

    def test_cas_limites(self):
        self.assertEqual(risque.taille_position(10_000, 1, 2000, 2000), 0.0)
        self.assertEqual(risque.taille_position(100, 1, 2000, 1900, valeur_par_point=100, taille_min=0.01), 0.0)
        self.assertEqual(risque.taille_position(1e6, 5, 2000, 1999, valeur_par_point=100, taille_max=50), 50)
        self.assertEqual(risque.taille_position(10_000, 2, 1.1000, 1.0950, valeur_par_point=100_000, pas=0.01), 0.4)

    def test_ratios(self):
        self.assertAlmostEqual(risque.ratio_risque_rendement(100, 95, 110), 2.0)
        self.assertAlmostEqual(risque.stop_atr(100, 4, 1.5), 94.0)
        self.assertAlmostEqual(risque.stop_atr(100, 4, 1.5, achat=False), 106.0)


if __name__ == "__main__":
    logging.disable(logging.WARNING)
    unittest.main()
