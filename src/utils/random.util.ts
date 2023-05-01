export function getRandomNum(min: number, max: number) {
  return Math.floor(min + (Math.random() * (max - min)));
}
