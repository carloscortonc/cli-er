/** Basic implementation of edit-distance (Levenshtein distance)
 * https://en.wikipedia.org/wiki/Levenshtein_distance#Recursive
 */
function distance(aWord: string, bWord: string) {
  // Store in a dictionary to avoid repeating same operations
  const dicc: { [key: string]: number } = {};
  const proxy = (a: string, b: string) => {
    const id = `${a}:${b}`;
    if (dicc[id] !== undefined) {
      return dicc[id];
    }
    const res = d(a, b);
    dicc[id] = res;
    return res;
  };
  function d(_a: string, _b: string): number {
    const [a, b] = _a.length > _b.length ? [_a, _b] : [_b, _a];
    if (b.length === 0) {
      return a.length;
    }
    if (a[0] === b[0]) {
      return proxy(a.slice(1), b.slice(1));
    }
    return (
      1 +
      Math.min(
        // Deleting character from a
        proxy(a.slice(1), b),
        // Adding character in b
        proxy(a, b.slice(1)),
        // Replace a character in each word
        proxy(a.slice(1), b.slice(1)),
      )
    );
  }
  return d(aWord, bWord);
}

/** Find the closest word to the given target from the provided candidate list */
export function closest(target: string, list: string[]): { distance: number; value: string } {
  return list
    .map((e) => ({ distance: distance(target, e), value: e }))
    .reduce((acc, curr) => (curr.distance < acc.distance ? curr : acc), { distance: Infinity } as any);
}
