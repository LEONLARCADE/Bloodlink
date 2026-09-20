/**
 * Tiny class-name joiner. Avoids adding clsx/tailwind-merge as dependencies.
 * Accepts strings, arrays and conditional falsy values.
 */
export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ")
    .trim();
}

export default cn;