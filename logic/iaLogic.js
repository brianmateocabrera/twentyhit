// /logic/iaLogic.js

/**
 * Easy: elige carta aleatoria
 */
export function iaEasy(manoIA, mesa, estadoJuego) {
    return Phaser.Math.Between(0, manoIA.length - 1);
}

/**
 * Medium: elige carta más alta
 */
export function iaMedium(manoIA, mesa, estadoJuego) {
    let maxValor = -Infinity;
    let idxMax = 0;

    manoIA.forEach((carta, i) => {
        if (carta.valor > maxValor) {
            maxValor = carta.valor;
            idxMax = i;
        }
    });

    return idxMax;
}

/**
 * Hard: heurística básica
 * - Si puede superar la carta más alta en mesa, lo hace
 * - Si no, juega la carta más baja
 */
export function iaHard(manoIA, mesa, estadoJuego) {
    if (mesa.length > 0) {
        const maxMesa = Math.max(...mesa.map(c => c.valor));
        const posibles = manoIA
            .map((c, i) => ({ valor: c.valor, i }))
            .filter(c => c.valor > maxMesa);

        if (posibles.length > 0) {
            // devuelve la carta más baja que supere mesa
            return posibles.reduce((a, b) => a.valor < b.valor ? a : b).i;
        }
    }

    // fallback: carta más baja
    const minCarta = manoIA.reduce((a, b) => a.valor < b.valor ? a : b);
    return manoIA.indexOf(minCarta);
}

/**
 * Diccionario opcional para acceder por nombre de dificultad
 */
export const IA = {
    easy: iaEasy,
    medium: iaMedium,
    hard: iaHard
};