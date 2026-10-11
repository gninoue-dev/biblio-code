#!/usr/bin/env python3
"""Outil de la bibliothèque de code.

  python3 outils/biblio.py nouveau web/js/mon-snippet --langage javascript
  python3 outils/biblio.py generer      # met à jour .vscode/biblio.code-snippets
  python3 outils/biblio.py installer    # + copie les snippets dans VS Code (tous projets)
  python3 outils/biblio.py liste        # affiche tous les snippets
"""

import argparse
import json
import shutil
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / ".vscode" / "biblio.code-snippets"
DOSSIER_VSCODE = Path.home() / ".config" / "Code" / "User" / "snippets"

# langage -> (extension du fichier, portée VS Code)
LANGAGES = {
    "javascript": (".js", "javascript,typescript,javascriptreact,typescriptreact"),
    "typescript": (".ts", "typescript,typescriptreact"),
    "html": (".html", "html"),
    "css": (".css", "css,scss"),
    "kotlin": (".kt", "kotlin"),
    "gdscript": (".gd", "gdscript"),
    "csharp": (".cs", "csharp"),
    "python": (".py", "python"),
}


def lire_entete(readme: Path) -> dict:
    """Lit l'en-tête entre les deux lignes '---' au début du README."""
    lignes = readme.read_text(encoding="utf-8").splitlines()
    if not lignes or lignes[0].strip() != "---":
        return {}
    entete = {}
    for ligne in lignes[1:]:
        if ligne.strip() == "---":
            return entete
        if ":" in ligne:
            cle, valeur = ligne.split(":", 1)
            entete[cle.strip()] = valeur.strip()
    return {}


def trouver_snippets():
    for readme in sorted(RACINE.glob("*/**/README.md")):
        if "outils" in readme.parts or "modele" in readme.parts:
            continue
        entete = lire_entete(readme)
        if not {"prefixe", "description", "langage", "fichier"} <= entete.keys():
            print(f"⚠  En-tête incomplet, ignoré : {readme.relative_to(RACINE)}", file=sys.stderr)
            continue
        code = readme.parent / entete["fichier"]
        if not code.exists():
            print(f"⚠  Fichier introuvable : {code.relative_to(RACINE)}", file=sys.stderr)
            continue
        yield readme.parent, entete, code


def echapper(ligne: str) -> str:
    # Dans un snippet VS Code, \ et $ ont un sens spécial.
    return ligne.replace("\\", "\\\\").replace("$", "\\$")


def generer() -> int:
    snippets = {}
    for dossier, entete, code in trouver_snippets():
        portee = LANGAGES.get(entete["langage"], (None, entete["langage"]))[1]
        nom = str(dossier.relative_to(RACINE))
        snippets[nom] = {
            "scope": portee,
            "prefix": entete["prefixe"],
            "description": entete["description"],
            "body": [echapper(l) for l in code.read_text(encoding="utf-8").splitlines()],
        }
    SORTIE.parent.mkdir(exist_ok=True)
    SORTIE.write_text(json.dumps(snippets, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"✓ {len(snippets)} snippets écrits dans {SORTIE.relative_to(RACINE)}")
    return len(snippets)


def installer():
    generer()
    DOSSIER_VSCODE.mkdir(parents=True, exist_ok=True)
    shutil.copy(SORTIE, DOSSIER_VSCODE / "biblio.code-snippets")
    print(f"✓ Installé dans {DOSSIER_VSCODE} (disponible dans tous tes projets VS Code)")


def nouveau(chemin: str, langage: str):
    if langage not in LANGAGES:
        sys.exit(f"Langage inconnu. Choix : {', '.join(LANGAGES)}")
    dossier = RACINE / chemin
    if dossier.exists():
        sys.exit(f"Existe déjà : {chemin}")
    dossier.mkdir(parents=True)
    nom = dossier.name
    fichier = nom + LANGAGES[langage][0]
    (dossier / fichier).write_text("", encoding="utf-8")
    modele = (RACINE / "modele" / "README.md").read_text(encoding="utf-8")
    modele = modele.replace("NOM", nom).replace("LANGAGE", langage).replace("FICHIER", fichier)
    (dossier / "README.md").write_text(modele, encoding="utf-8")
    print(f"✓ Créé {chemin}/ → écris ton code dans {fichier}, complète le README, puis lance « generer ».")


def liste():
    for dossier, entete, _ in trouver_snippets():
        print(f"{entete['prefixe']:<28} {str(dossier.relative_to(RACINE)):<36} {entete['description']}")


def main():
    p = argparse.ArgumentParser(description="Gère la bibliothèque de snippets.")
    sous = p.add_subparsers(dest="commande", required=True)
    n = sous.add_parser("nouveau", help="crée un snippet vide")
    n.add_argument("chemin", help="ex : game/godot/dash")
    n.add_argument("--langage", required=True, choices=LANGAGES)
    sous.add_parser("generer", help="génère les snippets VS Code")
    sous.add_parser("installer", help="génère et installe dans VS Code")
    sous.add_parser("liste", help="liste les snippets")
    args = p.parse_args()

    if args.commande == "nouveau":
        nouveau(args.chemin, args.langage)
    elif args.commande == "generer":
        generer()
    elif args.commande == "installer":
        installer()
    else:
        liste()


if __name__ == "__main__":
    main()
