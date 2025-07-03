export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}