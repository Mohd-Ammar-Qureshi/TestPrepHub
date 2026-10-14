/** Returns a number in [0, 1). Matches the signature of Math.random. */
export type RandomFn = () => number;

/** Returns a new array with the items in random order (Fisher-Yates). */
export function shuffle<T>(
  items: readonly T[],
  random: RandomFn = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
