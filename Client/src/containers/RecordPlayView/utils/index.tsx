export const padWithZero = (number: number): string => {
  const string = number.toString();
  if (number < 10) return `0${string}`;
  return string;
};

export default {
  getMMSSFromMillis: (millis: number): string => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    return `${padWithZero(minutes)}:${padWithZero(seconds)}`;
  },
};
