// Exécute `fn` au plus une fois toutes les `intervalle` ms (scroll, mousemove, resize…).
export function throttle(fn, intervalle = 200) {
  let dernier = 0;
  let minuteur;
  return (...args) => {
    const reste = intervalle - (Date.now() - dernier);
    clearTimeout(minuteur);
    if (reste <= 0) {
      dernier = Date.now();
      fn(...args);
    } else {
      minuteur = setTimeout(() => {
        dernier = Date.now();
        fn(...args);
      }, reste);
    }
  };
}
