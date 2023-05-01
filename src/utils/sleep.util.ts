export const sleep = (ms: number) => new Promise((res) => setInterval(res, ms));
