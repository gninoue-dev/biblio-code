const UNITES = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

// « il y a 3 heures », « hier », « dans 2 jours »
export function dateRelative(date, { langue = "fr", maintenant = new Date() } = {}) {
  const secondes = Math.round((new Date(date) - maintenant) / 1000);
  const rtf = new Intl.RelativeTimeFormat(langue, { numeric: "auto" });
  for (const [unite, duree] of UNITES) {
    if (Math.abs(secondes) >= duree || unite === "second") {
      return rtf.format(Math.round(secondes / duree), unite);
    }
  }
}

// « 11 octobre 2026 » (options Intl.DateTimeFormat acceptées)
export function formaterDate(date, { langue = "fr-FR", ...options } = {}) {
  const format = Object.keys(options).length ? options : { dateStyle: "long" };
  return new Intl.DateTimeFormat(langue, format).format(new Date(date));
}
