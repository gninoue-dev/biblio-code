# biblio-code

**▶ [Démo en direct](https://gninoue-dev.github.io/biblio-code/demo/)** : essaie chaque module dans ton navigateur.

Ma bibliothèque de **fonctionnalités réutilisables** : du code testé que j'importe dans mes projets au lieu de le réécrire à chaque fois.

- **Web** : utilitaires, formulaires, fonctionnalités d'application web (API, routeur, état, notifications…)
- **Banque / fintech** : calculs d'argent sans erreurs d'arrondi, IBAN, cartes bancaires, transactions, prêts, devises (EUR ↔ franc CFA)
- **Mobile** : Android (Kotlin) : notifications quotidiennes, empreinte digitale, écran protégé, partage WhatsApp…
- **Jeux** : Godot 4 (machine à états, sauvegarde versionnée, économie F2P, dialogues…) et Unity (C#)
- **Python** : bots et scripts (réessais, logs, `.env`, alertes Telegram, indicateurs de trading, gestion du risque)

Aucune dépendance externe : seulement ce qui est intégré au langage.

**Tout est testé** : JavaScript (`node --test`), Python (`unittest`), Godot (moteur 4.7 sans fenêtre) et Kotlin (compilé avec les vraies bibliothèques Android).

## Utiliser la bibliothèque dans un projet

### 1. Avec npm (projet Vite, React, Angular, Node…)

```bash
npm install github:gninoue-dev/biblio-code
```

```js
import { validerIban, formaterMontant, toast, creerClientApi } from "biblio-code";
```

### 2. Sans rien installer (page HTML simple)

```html
<script type="module">
  import { formaterMontant } from "https://cdn.jsdelivr.net/gh/gninoue-dev/biblio-code@v0.4.0/web/index.js";
  document.body.textContent = formaterMontant(150000, "XOF"); // 150 000 F CFA
</script>
```

### 3. Copier un seul module

Chaque fichier se suffit à lui-même : tu peux copier `web/banque/iban/iban.js` dans ton projet, sans le reste.

### 4. Godot, Android, Python

Copie le dossier du module dans ton projet. Chaque README indique comment l'installer : autoload Godot, permission Android, etc.

### 5. Dans VS Code

Tape le préfixe d'un module (par exemple `bib-iban`) puis `Tab`, et le code s'insère. Pour activer les préfixes dans tous tes projets, lance `python3 outils/biblio.py installer`.

## Catalogue

<!-- catalogue -->
| Module | Préfixe VS Code | Description |
|---|---|---|
| [game/godot/boutons-deplacables](game/godot/boutons-deplacables) | `bib-boutons-mobiles` | Boutons tactiles déplaçables par le joueur, positions mémorisées |
| [game/godot/dialogues](game/godot/dialogues) | `bib-dialogue` | Boîte de dialogue lettre par lettre, répliques en JSON (mode histoire) |
| [game/godot/economie](game/godot/economie) | `bib-economie` | Monnaies du jeu + objets possédés (skins) pour un jeu free-to-play |
| [game/godot/gestionnaire-audio](game/godot/gestionnaire-audio) | `bib-audio` | Audio : musique en fondu enchaîné, effets superposés, volumes sauvegardés |
| [game/godot/hitstop](game/godot/hitstop) | `bib-hitstop` | Gel d'impact (hitstop) + vibration, pour des coups qui ont du poids |
| [game/godot/joystick-tactile](game/godot/joystick-tactile) | `bib-joystick` | Joystick virtuel tactile multi-touch (Godot 4) |
| [game/godot/machine-etats](game/godot/machine-etats) | `bib-etats` | Machine à états (joueur, ennemi, IA, menus) par fonctions |
| [game/godot/recompense-quotidienne](game/godot/recompense-quotidienne) | `bib-quotidien` | Récompense de connexion quotidienne avec série (rétention F2P) |
| [game/godot/sauvegarde](game/godot/sauvegarde) | `bib-save-godot` | Autoload de sauvegarde JSON dans user:// (Godot 4) |
| [game/godot/sauvegarde-versionnee](game/godot/sauvegarde-versionnee) | `bib-save-version` | Sauvegarde versionnée : migrations, écriture sûre, copie de secours |
| [game/godot/tampon-entrees](game/godot/tampon-entrees) | `bib-tampon` | Tampon d'entrées (input buffer) pour des commandes réactives |
| [game/godot/transition-scene](game/godot/transition-scene) | `bib-transition` | Changement de scène avec fondu au noir (autoload) |
| [game/godot/tremblement-camera](game/godot/tremblement-camera) | `bib-shake` | Tremblement de caméra 2D sur les impacts (Godot 4) |
| [game/unity/pool-objets](game/unity/pool-objets) | `bib-pool` | Pool d'objets pour projectiles/effets (évite les saccades) |
| [game/unity/sauvegarde-json](game/unity/sauvegarde-json) | `bib-save-unity` | Sauvegarde/chargement JSON dans persistentDataPath |
| [game/unity/singleton](game/unity/singleton) | `bib-singleton` | Singleton générique pour managers (GameManager, AudioManager…) |
| [mobile/android/biometrie](mobile/android/biometrie) | `bib-biometrie` | Déverrouillage par empreinte/visage avant une action sensible |
| [mobile/android/connexion-reseau](mobile/android/connexion-reseau) | `bib-reseau` | Vérifie si le téléphone a vraiment Internet |
| [mobile/android/contenu-du-jour](mobile/android/contenu-du-jour) | `bib-jour` | Contenu du jour (citation, défi, lettre) selon une date de départ |
| [mobile/android/ecran-securise](mobile/android/ecran-securise) | `bib-secure` | Bloquer captures d'écran et aperçu dans les applis récentes (FLAG_SECURE) |
| [mobile/android/notification-quotidienne](mobile/android/notification-quotidienne) | `bib-rappel` | Notification de rappel quotidienne à heure fixe (WorkManager) |
| [mobile/android/notifications](mobile/android/notifications) | `bib-notif` | Canal + affichage de notification (Android 8 à 15) |
| [mobile/android/partage](mobile/android/partage) | `bib-partager` | Partager texte/fichier + ouvrir WhatsApp avec message prérempli |
| [mobile/android/permission-notifications](mobile/android/permission-notifications) | `bib-permnotif` | Demande la permission d'envoyer des notifications (Android 13+) |
| [mobile/android/preferences](mobile/android/preferences) | `bib-prefs` | Sauvegarde de réglages simples avec SharedPreferences |
| [mobile/android/vibration](mobile/android/vibration) | `bib-vibrer` | Vibration et retour tactile (succès, erreur, boutons) |
| [python/config-env](python/config-env) | `bib-py-env` | Lire un fichier .env et des variables typées (sans dépendance) |
| [python/gestion-risque](python/gestion-risque) | `bib-py-risque` | Taille de position selon le risque (%), stop ATR, ratio risque/rendement |
| [python/indicateurs](python/indicateurs) | `bib-py-indicateurs` | Indicateurs techniques : SMA, EMA, RSI, ATR, Bollinger, MACD (sans dépendance) |
| [python/journal](python/journal) | `bib-py-journal` | Logs console + fichier avec rotation automatique |
| [python/limiteur-debit](python/limiteur-debit) | `bib-py-limiteur` | Limiteur de débit (N appels par période) pour respecter les quotas d'API |
| [python/notification-telegram](python/notification-telegram) | `bib-py-telegram` | Alertes Telegram (bot, rapports) sans dépendance, messages longs découpés |
| [python/reessayer](python/reessayer) | `bib-py-reessayer` | Décorateur de nouvelles tentatives avec attente exponentielle (sync et async) |
| [web/app/cache-requetes](web/app/cache-requetes) | `bib-cache` | Cache d'appels API (durée de vie, dédoublonnage, rafraîchissement en fond) |
| [web/app/client-api](web/app/client-api) | `bib-api` | Client API REST avec jeton et renouvellement automatique |
| [web/app/compression-image](web/app/compression-image) | `bib-compresser` | Compression/redimensionnement d'image avant envoi (photos téléphone) |
| [web/app/defilement-infini](web/app/defilement-infini) | `bib-scroll-infini` | Défilement infini avec IntersectionObserver |
| [web/app/formulaire-etapes](web/app/formulaire-etapes) | `bib-etapes` | Formulaire en plusieurs étapes avec validation et progression |
| [web/app/graphiques](web/app/graphiques) | `bib-graphique` | Graphiques SVG sans bibliothèque (sparkline, barres) |
| [web/app/hors-ligne](web/app/hors-ligne) | `bib-hors-ligne` | File d'attente hors ligne : actions envoyées au retour du réseau |
| [web/app/i18n](web/app/i18n) | `bib-i18n` | Traductions multilingues avec variables |
| [web/app/modale](web/app/modale) | `bib-confirmer` | Boîte de confirmation accessible (élément dialog, await) |
| [web/app/pagination](web/app/pagination) | `bib-pagination` | Pagination d'une liste + numéros de pages avec « … » |
| [web/app/panier](web/app/panier) | `bib-panier` | Panier e-commerce : quantités, code promo, livraison offerte, TVA |
| [web/app/partage](web/app/partage) | `bib-partage` | Partage natif + liens WhatsApp, Telegram, SMS, email |
| [web/app/pwa](web/app/pwa) | `bib-pwa` | Appli installable (PWA) : service worker, bouton installer, état réseau |
| [web/app/routeur](web/app/routeur) | `bib-routeur` | Routeur SPA par hash avec paramètres (#/comptes/:id) |
| [web/app/store](web/app/store) | `bib-store` | Store d'état global avec abonnements (mini Redux) |
| [web/app/tableau-donnees](web/app/tableau-donnees) | `bib-recherche-tri` | Recherche sans accents + tri naturel sur une liste d'objets |
| [web/app/toasts](web/app/toasts) | `bib-toast` | Notifications temporaires (succès, erreur…) sans dépendance |
| [web/app/upload-fichiers](web/app/upload-fichiers) | `bib-upload` | Glisser-déposer de fichiers avec contrôle type/taille et aperçu |
| [web/banque/argent](web/banque/argent) | `bib-argent` | Montants en centimes, saisie, formatage €/F CFA, répartition, taux |
| [web/banque/carte-bancaire](web/banque/carte-bancaire) | `bib-carte` | Carte bancaire : Luhn, réseau (Visa…), formatage, expiration, CVC |
| [web/banque/devises](web/banque/devises) | `bib-devises` | Conversion de devises (EUR ↔ F CFA, USD…) en unités mineures |
| [web/banque/iban](web/banque/iban) | `bib-iban` | Validation IBAN (mod 97) et BIC, formatage par blocs de 4 |
| [web/banque/inactivite](web/banque/inactivite) | `bib-inactivite` | Déconnexion auto après inactivité avec avertissement |
| [web/banque/masquage](web/banque/masquage) | `bib-masquer` | Masquer IBAN, numéro de carte, téléphone, email (••••) |
| [web/banque/mobile-money](web/banque/mobile-money) | `bib-mobile-money` | Numéros ivoiriens : validation, formatage, opérateur (Orange, MTN, Moov) |
| [web/banque/montant-en-lettres](web/banque/montant-en-lettres) | `bib-lettres` | Montant en toutes lettres en français (factures, chèques, contrats) |
| [web/banque/pret](web/banque/pret) | `bib-pret` | Simulateur de prêt : mensualité, tableau d'amortissement, coût total |
| [web/banque/transactions](web/banque/transactions) | `bib-transactions` | Solde, totaux par catégorie, regroupement par mois, filtres, export CSV |
| [web/formulaires/champ-otp](web/formulaires/champ-otp) | `bib-otp` | Champ code SMS / 2FA à cases (collage et auto-remplissage) |
| [web/formulaires/mot-de-passe](web/formulaires/mot-de-passe) | `bib-mdp` | Indicateur de force du mot de passe avec critères |
| [web/formulaires/soumission-unique](web/formulaires/soumission-unique) | `bib-anti-doublon` | Anti double envoi / double paiement + clé d'idempotence |
| [web/formulaires/validation](web/formulaires/validation) | `bib-validation` | Validation de formulaires (email, téléphone CI/FR, URL…) |
| [web/utilitaires/compte-a-rebours](web/utilitaires/compte-a-rebours) | `bib-rebours` | Compte à rebours fiable (« Renvoyer le code dans 00:30 », promos) |
| [web/utilitaires/crypto](web/utilitaires/crypto) | `bib-crypto` | UUID, code OTP, jeton aléatoire sûrs et empreinte SHA-256 |
| [web/utilitaires/dates](web/utilitaires/dates) | `bib-dates` | Dates relatives (« il y a 3 h ») et formatage en français |
| [web/utilitaires/debounce](web/utilitaires/debounce) | `bib-debounce` | Retarde une fonction tant qu'elle est rappelée (recherche, resize…) |
| [web/utilitaires/fetch-json](web/utilitaires/fetch-json) | `bib-fetch` | fetch JSON avec timeout et nouvelles tentatives automatiques |
| [web/utilitaires/jours-ouvres](web/utilitaires/jours-ouvres) | `bib-jours-ouvres` | Jours fériés CI/FR, Pâques, ajout de jours ouvrés (délais, échéances) |
| [web/utilitaires/presse-papier](web/utilitaires/presse-papier) | `bib-copier` | Bouton « Copier » vers le presse-papier |
| [web/utilitaires/recherche-floue](web/utilitaires/recherche-floue) | `bib-floue` | Recherche tolérante aux fautes (« Vouliez-vous dire… ») |
| [web/utilitaires/stockage](web/utilitaires/stockage) | `bib-stockage` | localStorage JSON avec expiration, sans erreurs |
| [web/utilitaires/telechargement](web/utilitaires/telechargement) | `bib-telecharger` | Télécharger un fichier généré côté navigateur |
| [web/utilitaires/texte](web/utilitaires/texte) | `bib-texte` | slug d'URL, troncature, échappement HTML anti-XSS |
| [web/utilitaires/theme-sombre](web/utilitaires/theme-sombre) | `bib-theme` | Bouton thème clair/sombre mémorisé dans le navigateur |
| [web/utilitaires/throttle](web/utilitaires/throttle) | `bib-throttle` | Limite la fréquence d'appel d'une fonction (scroll, resize) |
<!-- /catalogue -->

Chaque dossier a son README : exemples, prérequis et pièges à éviter.

## Règles pour l'argent

Les modules `banque` stockent les montants en **unités mineures entières** : des centimes pour l'euro, des francs pour le franc CFA, qui n'a pas de décimales. En JavaScript, `0.1 + 0.2` ne donne pas `0.3`, donc on n'utilise jamais de nombre à virgule pour de l'argent.

Les contrôles faits dans le navigateur (IBAN, carte, masquage, inactivité) améliorent l'expérience de l'utilisateur, mais **ne remplacent pas** les vérifications côté serveur.

## Développement

Pour voir la démo en local : `python3 -m http.server`, puis ouvre http://localhost:8000/demo/


```bash
./outils/tout_tester.sh                                         # TOUS les tests (JS, Python, Godot, Kotlin)
npm test                                                        # tests JavaScript seulement
python3 outils/biblio.py nouveau web/app/mon-module --langage javascript
python3 outils/biblio.py generer                                # met à jour index.js, le catalogue et les snippets
python3 outils/biblio.py liste
```

Pour ajouter un module :

1. Lance `nouveau`.
2. Écris le code et le README (en-tête `prefixe` et `description`).
3. Ajoute des tests dans `tests/` (`tests/python`, `tests/godot/test_modules.gd`, `tests/kotlin`).
4. Lance `generer`.

**Règle d'or :** un module = une fonctionnalité, sans dépendance vers les autres modules, testée, avec ses pièges notés.

## Licence

MIT : libre d'utilisation, y compris dans des projets commerciaux.
